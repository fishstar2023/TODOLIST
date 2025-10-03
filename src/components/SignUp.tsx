import React, { useState } from "react";
import "./SignUp.css";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hikingType: "",
    tripsPerYear: "",
    interview: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" && e.target instanceof HTMLInputElement
          ? e.target.checked
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Thank you for joining the Hiking Survey Project!");
  };

  return (
    <div className="signup-container">
      {/* 天空 */}
      <div className="sky">
        <div className="sun">
          <div className="rays"></div>
        </div>
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
      </div>

<div className="mountain-bg">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
    <path fill="#a5d6a7" d="M0,224L60,200L120,210L180,190L240,200L300,180L360,190L420,170L480,180L540,160L600,170L660,150L720,160L780,140L840,150L900,130L960,140L1020,120L1080,130L1140,110L1200,120L1260,100L1320,110L1380,90L1440,100L1440,320L0,320Z"/>
    <path fill="#66bb6a" d="M0,256L60,230L120,240L180,220L240,230L300,210L360,220L420,200L480,210L540,190L600,200L660,180L720,190L780,170L840,180L900,160L960,170L1020,150L1080,160L1140,140L1200,150L1260,130L1320,140L1380,120L1440,130L1440,320L0,320Z"/>
    <path fill="#2e7d32" d="M0,288L60,260L120,270L180,250L240,260L300,240L360,250L420,230L480,240L540,220L600,230L660,210L720,220L780,200L840,210L900,190L960,200L1020,180L1080,190L1140,170L1200,180L1260,160L1320,170L1380,150L1440,160L1440,320L0,320Z"/>
  </svg>

  {/* 小人 */}
  <svg
    className="hiker"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
  >
    <circle cx="32" cy="8" r="6" fill="#fff" />
    <rect x="28" y="14" width="8" height="18" fill="#fff" rx="2" />
    <line x1="32" y1="20" x2="20" y2="32" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
    <line x1="32" y1="30" x2="44" y2="46" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
    <line x1="32" y1="30" x2="20" y2="48" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
  </svg>
</div>

      {/* 表單 */}
      <div className="signup-card">
        <h1>Hiking Survey Project ⛰️</h1>
        <p>Help us collect data on mountain environments and hiking experiences</p>

        <form onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Preferred Hiking Type
            <select
              name="hikingType"
              value={formData.hikingType}
              onChange={handleChange}
              required
            >
              <option value="">Select one</option>
              <option value="day">Day Hikes</option>
              <option value="multi">Multi-day Treks</option>
              <option value="abroad">Overseas Hiking</option>
            </select>
          </label>

          <label>
            Average Hiking Trips per Year
            <input
              type="number"
              name="tripsPerYear"
              placeholder="Trips"
              value={formData.tripsPerYear}
              onChange={handleChange}
            />
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              name="interview"
              checked={formData.interview}
              onChange={handleChange}
            />
            I am willing to join follow-up interviews
          </label>

          <button type="submit" className="submit-btn">
            Sign Up Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
