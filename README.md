# RouteReady 🏔️

[![Oasis-NEU](https://img.shields.io/badge/Oasis-NEU-green)](https://oasisneu.com/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-Build-purple)](https://vitejs.dev/)

**Your complete hiking companion for discovering, planning, and tracking amazing outdoor adventures.**

RouteReady is a comprehensive hiking platform designed to make outdoor adventures accessible, safe, and enjoyable for everyone. Whether you're a seasoned mountaineer or just starting your hiking journey, RouteReady provides the tools and information you need to explore nature with confidence.

---

## ✨ Features

### 🗺️ **Discover Trails**
Browse thousands of hiking trails with detailed information, difficulty ratings, and user reviews. Filter by location, difficulty level, and trail length to find the perfect hike for your skill level.

### 📅 **Plan Your Hikes**
Schedule your hiking adventures with our intelligent planning tools that consider:
- Weather forecasts for your hiking date
- Trail difficulty matched to your experience level
- Group size and coordination
- Personalized calorie and nutrition recommendations

### ✅ **Track Progress**
Record completed hikes, track your achievements, and build your personal hiking portfolio over time. Mark hikes as complete and maintain a history of all your outdoor adventures.

### 🌤️ **Weather Integration**
Get accurate weather predictions for your planned hikes to ensure safe and enjoyable trips. Real-time weather data helps you make informed decisions about when to hit the trail.

### 🎒 **Smart Packing Lists**
Receive personalized packing recommendations based on:
- Trail difficulty and duration
- Weather conditions
- Your physical profile (weight, height, age)
- Group size

### 👥 **Group Planning**
Coordinate hikes with friends and family, share plans, and ensure everyone is prepared for the adventure ahead.

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building interactive components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### APIs & Integrations
- **OpenWeatherMap API** - Weather forecast data
- **AllTrails Dataset** - Trail information and details

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- OpenWeatherMap API key (optional, for weather features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Oasis-NEU/f25-group-22.git
   cd f25-group-22
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_OPENWEATHER_API_KEY=your-openweather-key-here
   ```

4. **Set up Supabase database**
   
   - Create a new Supabase project
   - Run the SQL migrations in the `supabase/migrations` folder (or create tables manually)
   - Configure Row Level Security policies as needed

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
f25-group-22/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── RecommendedTrails.jsx
│   │   ├── PlannedTrails.jsx
│   │   ├── PlanHike.jsx
│   │   ├── InformationPage.jsx
│   │   └── ...
│   ├── config/             # Configuration files
│   │   └── supabase.js
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Application entry point
├── public/                 # Static assets
├── .env                    # Environment variables (not in repo)
├── package.json
├── vite.config.js
└── README.md
```

---

### How to Use RouteReady

1. **Browse Trails**
   - Navigate to the Recommended Trails page
   - Filter trails by difficulty and length
   - Click on a trail to view detailed information

2. **Plan a Hike**
   - Go to the "Plan a Hike" page
   - Enter your hiking location and date
   - Provide your group size and personal information
   - Review weather forecasts and personalized recommendations
   - Submit to save your planned hike

3. **View Planned Hikes**
   - Access "Your Planned Trails" to see all upcoming hikes
   - Click on a hike to expand and view details
   - Mark hikes as complete when finished
   - Delete hikes you no longer plan to do

4. **Track Your Progress**
   - Completed hikes appear in a separate section
   - Build your hiking achievement log over time
   - Review past adventures and notes

---

# Link To AllTrails CSV:
https://github.com/j-ane/trail-data/blob/master/alltrails-data.csv
