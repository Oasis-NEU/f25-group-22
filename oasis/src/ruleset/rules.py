#handle cleaned pd dataframe from webscraping, use data to x
import pandas as pd
import numpy as np
#also import other files for cleaned dataframe, user info, etc

df_hike = pd.DataFrame() # Placeholder for cleaned DataFrame
df_user = pd.DataFrame() # Placeholder for user info DataFrame
df_weather = pd.DataFrame() # Placeholder for weather DataFrame

def get_terrain_coefficient(terrain_type):
    """
    Returns Pandolf equation terrain coefficient (η).
    """
    terrain_coefficients = {
        'paved': 1.0,
        'maintained_trail': 1.2,
        'grass': 1.08,
        'rocky': 1.4,
        'off_trail': 1.5,
        'sand': 1.8,
        'snow': 1.7,
        'swamp': 3.5
    }
    return terrain_coefficients.get(terrain_type, 1.2)

def parse_trail_characteristics(df_hike):
    """
    Extract trail characteristics from AllTrails data.
    Returns dictionary with parsed terrain type, conditions, and features.
    """
    features = df_hike['features'].values[0]
    if isinstance(features, str):
        features = eval(features)
    if not isinstance(features, list):
        features = []
    
    has_paved = 'paved' in features or 'partially-paved' in features
    has_forest = 'forest' in features
    has_river = 'river' in features
    has_waterfall = 'waterfall' in features
    has_snow = any(f in features for f in ['snow', 'ice'])
    has_cave = 'cave' in features
    
    if has_paved:
        terrain_type = 'paved'
    elif has_forest:
        terrain_type = 'maintained_trail'
    elif 'sand' in features:
        terrain_type = 'sand'
    else:
        terrain_type = 'maintained_trail'
    
    distance_miles = float(df_hike['length'].values[0]) * 0.000621371
    elevation_gain_ft = float(df_hike['elevation_gain'].values[0]) * 3.28084
    difficulty = int(df_hike['difficulty_rating'].values[0])
    
    has_river_crossing = has_river or has_waterfall
    has_snow_ice = has_snow
    has_scrambling = (difficulty >= 5) & (elevation_gain_ft > 2000)
    
    visitor_usage = df_hike['visitor_usage'].values[0]
    if pd.isna(visitor_usage):
        remoteness = 'moderate'
    else:
        usage = int(visitor_usage)
        if usage >= 3:
            remoteness = 'low'
        elif usage >= 2:
            remoteness = 'moderate'
        else:
            remoteness = 'high'
    
    bear_states = ['Alaska', 'Montana', 'Wyoming', 'Idaho', 'Colorado', 'Washington', 
                   'California', 'Oregon', 'Arizona', 'New Mexico']
    state = df_hike['state_name'].values[0]
    bear_country = state in bear_states
    
    return {
        'distance_miles': distance_miles,
        'elevation_gain_ft': elevation_gain_ft,
        'difficulty_rating': difficulty,
        'terrain_type': terrain_type,
        'has_river_crossing': has_river_crossing,
        'has_snow_ice': has_snow_ice,
        'has_scrambling': has_scrambling,
        'remoteness': remoteness,
        'bear_country': bear_country,
        'features': features
    }

def calculate_difficulty_score(distance_miles, elevation_gain_ft, terrain_type='maintained_trail',
                               temperature_f=70, altitude_ft=0, has_river=False, 
                               has_scrambling=False, is_winter=False):
    """
    Calculate comprehensive difficulty score using Shenandoah formula.
    Returns dictionary with score, rating (1-7), and level description.
    """
    base_score = np.sqrt((elevation_gain_ft * 2) * distance_miles)
    
    adjustments = 0
    if temperature_f > 90:
        adjustments += 20
    if altitude_ft > 10000:
        adjustments += 15
    if altitude_ft > 8000:
        adjustments += 10
    if has_river:
        adjustments += 5
    if has_scrambling:
        adjustments += 5
    if is_winter:
        adjustments += 10
    
    terrain_coef = get_terrain_coefficient(terrain_type)
    if terrain_coef > 1.3:
        adjustments += 10
    
    total_score = base_score + adjustments
    
    if total_score < 50:
        rating = 1
        level = "Easy"
    elif total_score < 80:
        rating = 2
        level = "Easy-Moderate"
    elif total_score < 100:
        rating = 3
        level = "Moderate"
    elif total_score < 150:
        rating = 4
        level = "Moderate-Strenuous"
    elif total_score < 200:
        rating = 5
        level = "Strenuous"
    elif total_score < 250:
        rating = 6
        level = "Very Strenuous"
    else:
        rating = 7
        level = "Extreme"
    
    return {
        'score': total_score,
        'rating': rating,
        'level': level
    }

def water_amount(df_hike, df_user, df_weather):
    """
    Calculate recommended water amount in liters.
    Formula: time-based consumption + elevation adjustment + environmental multipliers.
    """
    trail = parse_trail_characteristics(df_hike)
    distance = trail['distance_miles']
    elevation_gain = trail['elevation_gain_ft']
    difficulty = trail['difficulty_rating']
    terrain = trail['terrain_type']
    
    state = df_hike['state_name'].values[0]
    avg_altitude = get_altitude_estimate(state)
    
    temp = df_weather['temperature_f'].values[0]
    humidity = df_weather['humidity_percent'].values[0]
    wind = df_weather['wind_mph'].values[0]
    
    experience = df_user['experience'].values[0]
    pack_weight = df_user['pack_weight_lbs'].values[0]
    
    time_hours = estimate_hike_time(distance, elevation_gain, difficulty, experience, pack_weight)
    
    if difficulty <= 2:
        base_rate = 0.5
    elif difficulty <= 4:
        base_rate = 0.65
    elif difficulty <= 5:
        base_rate = 0.8
    else:
        base_rate = 1.0
    
    base_water = time_hours * base_rate
    elevation_water = (elevation_gain / 1000) * 0.5
    water_liters = base_water + elevation_water
    
    multiplier = 1.0
    
    if temp > 80:
        temp_factor = 1 + ((temp - 80) / 20) * 0.5
        multiplier *= temp_factor
    
    if avg_altitude > 8000:
        multiplier *= 1.25
    
    if humidity > 70:
        multiplier *= 1.2
    
    if wind > 15:
        multiplier *= 1.15
    
    if terrain in ['sand', 'desert', 'exposed']:
        multiplier *= 1.8
    
    water_liters *= multiplier
    
    if experience == 'beginner':
        water_liters *= 1.15
    
    if temp > 90 or distance > 10 or avg_altitude > 10000:
        safety_margin = 1.0
    else:
        safety_margin = 0.5
    
    water_liters += safety_margin
    water_liters = np.ceil(water_liters * 2) / 2
    
    return {
        'total_liters': water_liters,
        'total_ounces': round(water_liters * 33.8, 1),
        'estimated_hours': round(time_hours, 1),
        'rate_per_hour': round(water_liters / time_hours, 2),
        'bottles_needed': int(np.ceil(water_liters / 0.7))
    }

def cal_amount(df_hike, df_user, df_weather):
    """
    Calculate calories burned and recommended food to carry.
    Based on ADK Magazine formula, Pandolf equation, and NOLS nutrition guidelines.
    """
    trail = parse_trail_characteristics(df_hike)
    distance = trail['distance_miles']
    elevation_gain = trail['elevation_gain_ft']
    terrain = trail['terrain_type']
    difficulty = trail['difficulty_rating']
    
    weight = df_user['weight_lbs'].values[0]
    age = df_user['age'].values[0]
    height = df_user['height_inches'].values[0]
    pack_weight = df_user['pack_weight_lbs'].values[0]
    experience = df_user['experience'].values[0]
    
    temp = df_weather['temperature_f'].values[0]
    
    time_hours = estimate_hike_time(distance, elevation_gain, difficulty, experience, pack_weight)
    
    age_factor = 1 - 0.004 * (age - 45) if age > 45 else 1 + 0.004 * (45 - age)
    height_factor = 1 + 0.01 * (height - 70)
    weight_factor = weight / 150
    
    distance_calories = 270 * distance * weight_factor
    elevation_calories = (elevation_gain / 1000) * 260
    calories_burned = (distance_calories + elevation_calories) * age_factor * height_factor
    
    terrain_multiplier = get_terrain_coefficient(terrain)
    calories_burned *= (terrain_multiplier / 1.2)
    
    pack_penalty = (pack_weight / 10) * 60 * time_hours
    calories_burned += pack_penalty
    
    bmr_calories = time_hours * 110
    calories_burned += bmr_calories
    
    if time_hours < 3:
        food_calories = calories_burned + 200
        food_weight_oz = food_calories / 125
        recommendation = "trail_snacks"
    elif time_hours < 8:
        food_calories = calories_burned * 0.6 + 400
        food_weight_oz = food_calories / 125
        recommendation = "lunch_and_snacks"
    else:
        days = np.ceil(time_hours / 10)
        if difficulty <= 4:
            daily_calories = 3200
            food_lbs_per_day = 2.0
        elif difficulty <= 5:
            daily_calories = 3600
            food_lbs_per_day = 2.2
        else:
            daily_calories = 4200
            food_lbs_per_day = 2.5
        
        food_calories = daily_calories * (days + 1)
        food_weight_oz = food_lbs_per_day * (days + 1) * 16
        recommendation = "multi_day_backpacking"
    
    calories_per_hour = 250
    snack_frequency_minutes = 60
    
    return {
        'calories_burned': round(calories_burned, 0),
        'food_calories_needed': round(food_calories, 0),
        'food_weight_oz': round(food_weight_oz, 1),
        'food_weight_lbs': round(food_weight_oz / 16, 2),
        'calories_per_hour': calories_per_hour,
        'snack_frequency_min': snack_frequency_minutes,
        'recommendation_type': recommendation,
        'estimated_time_hours': round(time_hours, 1)
    }

def gear_recommendations(df_hike, df_user, df_weather):
    """
    Generate comprehensive gear list based on trail characteristics.
    Returns categorized gear dictionary with items organized by type.
    """
    trail = parse_trail_characteristics(df_hike)
    distance = trail['distance_miles']
    elevation_gain = trail['elevation_gain_ft']
    difficulty = trail['difficulty_rating']
    features = trail['features']
    has_river = trail['has_river_crossing']
    has_snow = trail['has_snow_ice']
    has_scrambling = trail['has_scrambling']
    remoteness = trail['remoteness']
    bear_country = trail['bear_country']
    terrain = trail['terrain_type']
    
    state = df_hike['state_name'].values[0]
    altitude = get_altitude_estimate(state)
    
    temp = df_weather['temperature_f'].values[0]
    forecast = df_weather['forecast'].values[0]
    season = df_weather['season'].values[0]
    
    experience = df_user['experience'].values[0]
    
    time_hours = estimate_hike_time(distance, elevation_gain, difficulty, experience)
    
    gear = {
        'ten_essentials': [],
        'clothing': [],
        'footwear': [],
        'packs_and_bags': [],
        'safety_and_navigation': [],
        'terrain_specific': [],
        'environmental': [],
        'optional_recommended': []
    }
    
    gear['ten_essentials'] = [
        'Map (paper topographic)',
        'Compass',
        'GPS device or smartphone with offline maps',
        'LED headlamp with extra batteries',
        'Sunglasses (100% UV protection)',
        'Sunscreen (SPF 30+)',
        'Sun hat (brimmed)',
        'First aid kit',
        'Multi-tool or knife',
        'Gear repair kit (duct tape, cordage)',
        'Waterproof matches and lighter',
        'Fire starter (tinder)',
        'Emergency shelter (space blanket or bivy)',
        'Extra food (one day minimum)',
        'Water bottles (2+ quarts capacity)',
        'Water treatment (filter or tablets)',
        'Extra insulating layer',
        'Rain jacket'
    ]
    
    if time_hours < 2:
        pack_size = "10-20L waist pack or small daypack"
    elif time_hours < 8:
        pack_size = "20-30L daypack with hip belt"
    elif time_hours < 16:
        pack_size = "40-50L backpack"
    elif time_hours < 40:
        pack_size = "50-70L backpack"
    else:
        pack_size = "70-80L expedition pack"
    
    gear['packs_and_bags'].append(pack_size)
    
    if difficulty >= 3:
        gear['terrain_specific'].extend([
            'Trekking poles (recommended)',
            'Hiking boots with ankle support',
            'Extended first aid kit (athletic tape, blister care)'
        ])
    
    if difficulty >= 5:
        gear['terrain_specific'].extend([
            'Trekking poles (essential)',
            'Technical hiking boots (stiff sole)',
            'Emergency bivvy (mandatory)',
            'Helmet (for rockfall zones)'
        ])
        gear['safety_and_navigation'].extend([
            'GPS with preloaded route',
            'Personal Locator Beacon (PLB) or satellite messenger (recommended)'
        ])
    
    if difficulty >= 7:
        gear['terrain_specific'].extend([
            'Climbing harness and rope',
            'Helmet (mandatory)',
            'Carabiners and belay device',
            'Climbing protection gear'
        ])
        gear['safety_and_navigation'].append('Satellite messenger (mandatory for extreme terrain)')
    
    if difficulty <= 2:
        gear['footwear'].append('Trail runners or light hiking shoes acceptable')
    elif difficulty <= 4:
        gear['footwear'].append('Mid-cut hiking boots with ankle support')
    else:
        gear['footwear'].append('High-cut hiking boots (stiff sole for technical terrain)')
    
    if has_river:
        gear['terrain_specific'].extend([
            'Trekking poles (essential for 3-point contact)',
            'Water crossing shoes or sandals with secure straps',
            'Quick-dry pants or shorts',
            'Dry bag for electronics and clothing'
        ])
        if remoteness in ['high', 'extreme']:
            gear['terrain_specific'].append('50+ feet rope for group crossings')
    
    if has_snow or season == 'winter':
        gear['terrain_specific'].extend([
            'Microspikes or traction devices (light snow)',
            'Gaiters (waterproof)',
            'Insulated gloves and warm hat',
            'Extra warm layers (down or synthetic jacket)'
        ])
        
        if difficulty >= 4 or elevation_gain > 2000:
            gear['terrain_specific'].extend([
                '12-point crampons (technical terrain)',
                'Ice axe (55-70cm walking axe)',
                'Insulated boots (rated to 0°F or colder)',
                'Avalanche probe and shovel (if avalanche terrain)'
            ])
    
    if has_scrambling:
        gear['terrain_specific'].extend([
            'Gloves for hand protection',
            'Helmet (rockfall protection)',
            'Approach shoes or sticky rubber boots'
        ])
    
    if altitude > 8000:
        gear['environmental'].extend([
            'Extra sun protection (SPF 50+ sunscreen)',
            'Lip balm with SPF 30+',
            'Altitude sickness medication (Diamox) - consult doctor',
            'Ibuprofen and digestive aids'
        ])
        gear['clothing'].append('Warmer layers (temps 20-30°F colder than lower elevations)')
    
    if altitude > 10000:
        gear['environmental'].extend([
            'Mandatory acclimatization plan',
            'Sunglasses with side shields (snow blindness prevention)',
            'Extra high-calorie food'
        ])
        gear['safety_and_navigation'].append('Satellite messenger or PLB (strongly recommended)')
    
    if altitude > 12000:
        gear['environmental'].extend([
            '0°F to -10°F sleeping bag (if overnight)',
            '4-season tent',
            'Portable oxygen (optional but beneficial)'
        ])
    
    if temp > 80 or terrain == 'sand':
        gear['environmental'].extend([
            'Long-sleeve lightweight shirt (UPF 35-50+)',
            'Long lightweight pants',
            'Wide-brimmed hat with neck cape',
            'Buff or bandana for face/neck',
            'Desert gloves for sun protection',
            'Sunglasses (polarized, 100% UV)',
            'SPF 50+ sunscreen',
            'Umbrella for portable shade (optional)',
            'Down jacket or fleece (desert nights drop to freezing)'
        ])
    
    if forecast == 'rain' or 'forest' in features:
        gear['environmental'].extend([
            'Waterproof rain jacket with hood (Gore-Tex or equivalent)',
            'Rain pants',
            'Pack cover or internal waterproof liner',
            'Waterproof stuff sack for extra clothes',
            'Gaiters (for wet vegetation)'
        ])
    
    if bear_country:
        gear['safety_and_navigation'].extend([
            'Bear spray (EPA-approved, 7.9+ oz, chest/belt holster)',
            'Bear canister (BV450 or BV500) or Ursack',
            '50+ feet bear hang rope (if canister not available)',
            'Noise makers (whistle - 3 blasts for emergency)',
            'Knowledge: sleep-cook-store 200ft apart triangle'
        ])
    
    if remoteness == 'moderate':
        gear['safety_and_navigation'].extend([
            'Whistle (3 blasts = emergency)',
            'Detailed paper map',
            'Charged cell phone',
            'Headlamp with extra batteries',
            'Signal mirror'
        ])
    
    if remoteness == 'high':
        gear['safety_and_navigation'].extend([
            'PLB or satellite messenger (mandatory)',
            'Two-way radios for group communication',
            'Emergency blanket',
            'Comprehensive first aid kit with wilderness guide',
            'SAM splint',
            'Two extra days food minimum',
            'Backup water purification method'
        ])
    
    if remoteness == 'extreme':
        gear['safety_and_navigation'].extend([
            'Two communication devices (PLB + satellite messenger)',
            'Extensive first aid kit with tourniquet',
            'Multiple fire starting methods',
            'Emergency fishing kit',
            '100+ feet paracord',
            'Repair kit with sewing supplies',
            'Three extra days food minimum',
            'SPOT or InReach with tracking enabled'
        ])
    
    if distance > 10:
        gear['optional_recommended'].extend([
            'Extra socks',
            'Foot care kit (moleskin, athletic tape, blister bandages)',
            'Electrolyte tablets or powder',
            'Additional snacks beyond requirement'
        ])
    
    if time_hours > 12:
        gear['packs_and_bags'].extend([
            'Sleeping bag (rated for expected temps)',
            'Sleeping pad',
            'Tent or shelter (1-2 person = 2-4L packed)',
            'Cooking system (stove, fuel, pot)',
            'Bear canister or food storage',
            'Camp shoes or sandals',
            'Toiletries and trowel',
            'Water treatment system',
            'Headlamp with extra batteries (critical for camp)'
        ])
    
    estimated_pack_weight = calculate_pack_weight(df_hike, df_user, df_weather, gear, time_hours, difficulty)
    
    return {
        'gear_by_category': gear,
        'total_gear_items': sum(len(items) for items in gear.values()),
        'pack_size_recommended': pack_size,
        'estimated_pack_weight_lbs': estimated_pack_weight
    }

def calculate_pack_weight(df_hike, df_user, df_weather, gear_dict, time_hours, difficulty):
    """
    Estimate total pack weight based on gear carried.
    Returns weight in pounds.
    """
    base_weight = 4
    
    water_result = water_amount(df_hike, df_user, df_weather)
    water_weight = water_result['total_liters'] * 2.2
    
    cal_result = cal_amount(df_hike, df_user, df_weather)
    food_weight = cal_result['food_weight_lbs']
    
    clothing_weight = 3
    
    overnight_weight = 0
    if time_hours > 12:
        overnight_weight = 12
    
    technical_weight = 0
    if difficulty >= 5:
        technical_weight += 2
    if difficulty >= 7:
        technical_weight += 5
    
    total = base_weight + water_weight + food_weight + clothing_weight + overnight_weight + technical_weight
    
    return round(total, 1)

def time_estimate(df_hike, df_user, df_weather):
    """
    Comprehensive time estimate using Naismith, Book Time, and NOLS methods.
    Returns range with conservative buffer and multiple calculation methods.
    """
    trail = parse_trail_characteristics(df_hike)
    distance = trail['distance_miles']
    elevation_gain = trail['elevation_gain_ft']
    difficulty = trail['difficulty_rating']
    
    state = df_hike['state_name'].values[0]
    altitude = get_altitude_estimate(state)
    
    experience = df_user['experience'].values[0]
    pack_weight = df_user['pack_weight_lbs'].values[0]
    
    temp = df_weather['temperature_f'].values[0]
    forecast = df_weather['forecast'].values[0]
    
    naismith_hours = (distance / 3) + (elevation_gain / 2000)
    book_time_hours = (distance / 2) + (elevation_gain / 2000)
    energy_miles = distance + ((elevation_gain / 1000) * 2)
    nols_hours = energy_miles / 2
    
    if experience == 'elite':
        base_time = naismith_hours
    elif experience == 'experienced':
        base_time = naismith_hours * 1.1
    elif experience == 'intermediate':
        base_time = book_time_hours
    else:
        base_time = book_time_hours * 1.3
    
    final_time = base_time
    
    if pack_weight > 25:
        final_time *= 1.5
    elif pack_weight > 15:
        final_time *= 1.1
    
    if temp > 90:
        final_time *= 1.2
    if forecast in ['rain', 'snow']:
        final_time *= 1.1
    
    if altitude > 12000:
        final_time *= 1.5
    elif altitude > 10000:
        final_time *= 1.3
    elif altitude > 8000:
        final_time *= 1.1
    
    if difficulty >= 6:
        final_time *= 1.2
    
    min_time = final_time * 0.9
    max_time = final_time * 1.3
    
    return {
        'estimated_hours': round(final_time, 1),
        'min_hours': round(min_time, 1),
        'max_hours': round(max_time, 1),
        'pace_mph': round(distance / final_time, 2),
        'naismith_hours': round(naismith_hours, 1),
        'book_time_hours': round(book_time_hours, 1),
        'nols_energy_miles': round(energy_miles, 1)
    }

def calculate_trail_difficulty(df_hike, df_weather):
    """
    Calculate comprehensive difficulty rating combining Shenandoah formula
    with environmental factors. Returns rating (1-7) with description.
    """
    trail = parse_trail_characteristics(df_hike)
    distance = trail['distance_miles']
    elevation_gain = trail['elevation_gain_ft']
    terrain = trail['terrain_type']
    has_river = trail['has_river_crossing']
    has_scrambling = trail['has_scrambling']
    
    state = df_hike['state_name'].values[0]
    altitude = get_altitude_estimate(state)
    
    temp = df_weather['temperature_f'].values[0]
    season = df_weather['season'].values[0]
    
    result = calculate_difficulty_score(
        distance, 
        elevation_gain, 
        terrain,
        temp, 
        altitude, 
        has_river, 
        has_scrambling,
        season == 'winter'
    )
    
    descriptions = {
        1: "Easy: Suitable for all fitness levels. Well-maintained trail with minimal elevation.",
        2: "Easy-Moderate: Suitable for beginners with basic fitness. Some elevation or distance.",
        3: "Moderate: Requires good fitness. Sustained elevation gain or longer distance.",
        4: "Moderate-Strenuous: Requires very good fitness and some hiking experience.",
        5: "Strenuous: Challenging for most hikers. Significant elevation and/or distance.",
        6: "Very Strenuous: Only for experienced hikers in excellent condition.",
        7: "Extreme/Expert: Technical skills required. Serious physical and mental challenge."
    }
    
    result['description'] = descriptions[result['rating']]
    
    return result

def generate_hiking_recommendations(df_hike, df_user, df_weather):
    """
    Generate complete hiking recommendations for water, calories, gear, and time.
    Returns comprehensive dictionary with all recommendations and safety notes.
    """
    water = water_amount(df_hike, df_user, df_weather)
    calories = cal_amount(df_hike, df_user, df_weather)
    gear = gear_recommendations(df_hike, df_user, df_weather)
    time = time_estimate(df_hike, df_user, df_weather)
    difficulty = calculate_trail_difficulty(df_hike, df_weather)
    
    recommendations = {
        'trail_info': {
            'name': df_hike['name'].values[0],
            'distance_miles': parse_trail_characteristics(df_hike)['distance_miles'],
            'elevation_gain_ft': parse_trail_characteristics(df_hike)['elevation_gain_ft'],
            'difficulty_rating': difficulty['rating'],
            'difficulty_level': difficulty['level'],
            'difficulty_score': difficulty['score'],
            'description': difficulty['description']
        },
        
        'time': {
            'estimated_hours': time['estimated_hours'],
            'range_hours': f"{time['min_hours']} - {time['max_hours']}",
            'average_pace_mph': time['pace_mph'],
            'start_time_recommendation': 'Start early (6-8am) for long hikes'
        },
        
        'water': {
            'total_liters': water['total_liters'],
            'total_ounces': water['total_ounces'],
            'bottles_needed': water['bottles_needed'],
            'consumption_rate': f"{water['rate_per_hour']} L/hour",
            'hydration_tip': 'Drink before you feel thirsty. Monitor urine color (pale yellow = good).'
        },
        
        'food': {
            'calories_burned': calories['calories_burned'],
            'food_calories': calories['food_calories_needed'],
            'food_weight_lbs': calories['food_weight_lbs'],
            'snack_frequency': f"Eat every {calories['snack_frequency_min']} minutes ({calories['calories_per_hour']} cal/hour)",
            'recommendation': calories['recommendation_type']
        },
        
        'gear': {
            'pack_size': gear['packs_and_bags'][0] if gear['packs_and_bags'] else 'Not specified',
            'estimated_pack_weight_lbs': gear['estimated_pack_weight_lbs'],
            'gear_by_category': gear,
            'total_items': gear['total_gear_items']
        },
        
        'safety_notes': generate_safety_notes(df_hike, df_weather, difficulty['rating'])
    }
    
    return recommendations

def generate_safety_notes(df_hike, df_weather, difficulty_rating):
    """
    Generate specific safety warnings based on trail conditions.
    Returns list of formatted safety note strings.
    """
    notes = []
    
    state = df_hike['state_name'].values[0]
    altitude = get_altitude_estimate(state)
    
    trail = parse_trail_characteristics(df_hike)
    remoteness = trail['remoteness']
    bear_country = trail['bear_country']
    
    temp = df_weather['temperature_f'].values[0]
    
    if altitude > 10000:
        notes.append("⚠️ HIGH ALTITUDE: Acclimatize for 1-2 days at 8,000-9,000ft before ascending. Increase sleeping elevation max 1,000ft per day.")
    elif altitude > 8000:
        notes.append("⚠️ Altitude effects possible. Bring altitude medication, increase water intake by 25%.")
    
    if temp > 95:
        notes.append("⚠️ EXTREME HEAT: Start before dawn (4-6am). Triple water estimates. Watch for heat exhaustion signs.")
    elif temp > 85:
        notes.append("⚠️ Hot conditions: Double water supply. Take frequent breaks in shade.")
    
    if difficulty_rating >= 6:
        notes.append("⚠️ VERY STRENUOUS: Only attempt if in excellent physical condition with relevant experience.")
    
    if remoteness in ['high', 'extreme']:
        notes.append("⚠️ REMOTE AREA: Carry satellite communication device. Leave trip plan with emergency contact.")
    
    if bear_country:
        notes.append("🐻 BEAR COUNTRY: Carry bear spray in holster (not pack). Make noise. Hike in groups of 4+ if possible.")
    
    notes.append("✓ Always carry the Ten Essentials, even on short hikes.")
    notes.append("✓ Check weather forecast before departure and monitor conditions.")
    notes.append("✓ Tell someone your plans: route, expected return time, emergency contact.")
    
    return notes






def gear_recommendation():
    # Based on hike and user data, recommend gear
    gear = []
    if(df_hike['Grade'] > 10).any() or (df_hike['Distance'] > 8).any() or (df_hike['Elevation'] > 2000).any():
        gear.append('Trekking Poles')
    if(df_weather['Precipitation Probability'] > 30).any():
        gear.append('Rain Jacket')
    if(df_weather['Precipitation Probability'] > 60).any():
        gear.append('Rain Pants')
    if(df_weather['Temp'].max() < 32).any():
        gear.append('Winter Jacket')
    if(df_weather['Temp'].max() < 50).any():
        gear.append('Fleece Layer')
    if(df_weather['Temp'].max() > 70).any():
        gear.append('Sun Hat')
    if(df_weather['UV Index'].max() > 5).any():
        gear.append('Sunglasses')
    if(df_hike['Time'].max() > 6).any():
        gear.append('Headlamp')
    
    return gear
