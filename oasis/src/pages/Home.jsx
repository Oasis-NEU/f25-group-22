import React from 'react'

export default function Home() {
  return (
    <div style={{ fontFamily: "'Cabin', sans-serif", backgroundColor: "#f5f5f5", color: "#333", margin: 0, padding: 0 }}>

      {/* Hero Section */}
      <div style={{ background: "linear-gradient(135deg, rgba(46, 111, 64, 0.4) 0%, rgba(27, 77, 62, 0.4) 100%), url('https://pics.freeartbackgrounds.com/midle/Forest_Trail_Background-212.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        padding: "80px 2rem",
        textAlign: "center"
       }}>
        <h1 style={{ fontSize: "48px", marginBottom: "1rem", fontWeight: "bold" }}>Find Your Next Adventure</h1>
        <p style={{ fontSize: "18px", marginBottom: "2rem", opacity: 0.9 }}>Discover hiking routes with weather, calories, and more</p>
      
      </div>

      {/* Featured Routes */}
      <div style={{ padding: "3rem 2rem", backgroundColor: "white", margin: "2rem 0" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "2rem", textAlign: "center", color: "#2E6F40" }}>Popular Routes</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Route Card 1 */}
          <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}>
            <div style={{ width: "100%", height: "200px", backgroundColor: "#ddd" }}></div>
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ color: "#2E6F40", marginBottom: "0.5rem", fontSize: "18px" }}>Mountain Peak Trail</h3>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#666", marginTop: "1rem" }}>
                <span>8.5 km</span>
                <span>Moderate</span>
                <span>420 cal</span>
              </div>
            </div>
          </div>

          {/* Route Card 2 */}
          <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}>
            <div style={{ width: "100%", height: "200px", backgroundColor: "#ddd" }}></div>
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ color: "#2E6F40", marginBottom: "0.5rem", fontSize: "18px" }}>Forest Loop Trail</h3>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#666", marginTop: "1rem" }}>
                <span>5.2 km</span>
                <span>Easy</span>
                <span>260 cal</span>
              </div>
            </div>
          </div>

          {/* Route Card 3 */}
          <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}>
            <div style={{ width: "100%", height: "200px", backgroundColor: "#ddd" }}></div>
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ color: "#2E6F40", marginBottom: "0.5rem", fontSize: "18px" }}>Riverside Path</h3>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#666", marginTop: "1rem" }}>
                <span>6.0 km</span>
                <span>Easy</span>
                <span>300 cal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#2E6F40", color: "white", padding: "2rem", textAlign: "center", marginTop: "3rem" }}>
        <p>© 2025 RouteReady. Find your next adventure.</p>
        <p>Contact | About | Privacy Policy</p>
      </footer>
    </div>
  )
}
