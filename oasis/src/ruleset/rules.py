#handle cleaned pd dataframe from webscraping, use data to x
import pandas as pd
import numpy as np
#also import other files for cleaned dataframe, user info, etc

df_hike = pd.DataFrame() # Placeholder for cleaned DataFrame
df_user = pd.DataFrame() # Placeholder for user info DataFrame
df_weather = pd.DataFrame() # Placeholder for weather DataFrame

def water_amount():
    # Based on hike and user data, calculate recommended water amount in liters
    water = ((df_hike['Distance'] * 20) + (df_hike['Elevation']/16.66) + ((df_weather['Temp']-80)/20*120) + ((df_hike['Altitude']-10000)/2000*120))/120 + 0.5
    if(df_weather['Temp'] > 80):
        water *= 1.3
    if(df_hike['Altitude'] > 8000):
        water += (df_hike['Time'] /24)
    if(df_user['Experience'] == 'beginner'):
        water *= 1.15
        
    return water


def cal_amount():
    # Based on hike and user data, calculate recommended calorie intake
    pass

def clothing_recommendation():
    # Based on hike and user data, recommend clothing
    pass

def pack_weight():
    pass





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
