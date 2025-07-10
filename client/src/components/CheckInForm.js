import { useState } from "react";

// Enhanced component for comprehensive daily health check-in
function CheckInForm() {
  // Core wellness metrics
  const [mood, setMood] = useState("Good");
  const [energy, setEnergy] = useState(5);
  const [soreness, setSoreness] = useState(5);
  
  // Sleep tracking
  const [sleepHours, setSleepHours] = useState(8);
  const [sleepQuality, setSleepQuality] = useState("Good");
  
  // Stress and recovery
  const [stressLevel, setStressLevel] = useState(5);
  const [recovery, setRecovery] = useState("Mostly Recovered");
  
  // Hydration and nutrition
  const [hydration, setHydration] = useState(5);
  const [nutritionQuality, setNutritionQuality] = useState("Good");
  
  // Fitness and goals
  const [workoutMotivation, setWorkoutMotivation] = useState(5);
  const [fitnessGoal, setFitnessGoal] = useState("General Fitness");
  
  // Additional notes
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Function to handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting enhanced check-in...");

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          mood, 
          energy, 
          soreness, 
          sleepHours, 
          sleepQuality, 
          stressLevel, 
          recovery, 
          hydration, 
          nutritionQuality, 
          workoutMotivation, 
          fitnessGoal, 
          notes 
        })
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form
        setMood("Good");
        setEnergy(5);
        setSoreness(5);
        setSleepHours(8);
        setSleepQuality("Good");
        setStressLevel(5);
        setRecovery("Mostly Recovered");
        setHydration(5);
        setNutritionQuality("Good");
        setWorkoutMotivation(5);
        setFitnessGoal("General Fitness");
        setNotes("");
        // Trigger a page refresh to update the check-ins list
        window.location.reload();
      } else {
        console.error("Failed to submit check-in");
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2>Daily Health Check-In</h2>
      {submitted && <p style={{ color: "green" }}>✅ Enhanced check-in submitted!</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        
        {/* Core Wellness Section */}
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Core Wellness</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>Mood:</label>
            <select 
              value={mood} 
              onChange={(e) => setMood(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Okay">Okay</option>
              <option value="Poor">Poor</option>
              <option value="Terrible">Terrible</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Energy Level (1–10): {energy}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Soreness Level (1–10): {soreness}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={soreness}
              onChange={(e) => setSoreness(Number(e.target.value))}
              required
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Sleep Section */}
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Sleep</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>Hours of Sleep: {sleepHours}</label>
            <input
              type="range"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Sleep Quality:</label>
            <select 
              value={sleepQuality} 
              onChange={(e) => setSleepQuality(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Terrible">Terrible</option>
            </select>
          </div>
        </div>

        {/* Stress & Recovery Section */}
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Stress & Recovery</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>Stress Level (1–10): {stressLevel}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Recovery Status:</label>
            <select 
              value={recovery} 
              onChange={(e) => setRecovery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="Fully Recovered">Fully Recovered</option>
              <option value="Mostly Recovered">Mostly Recovered</option>
              <option value="Somewhat Recovered">Somewhat Recovered</option>
              <option value="Still Sore">Still Sore</option>
              <option value="Very Sore">Very Sore</option>
            </select>
          </div>
        </div>

        {/* Hydration & Nutrition Section */}
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Hydration & Nutrition</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>Hydration Level (1–10): {hydration}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={hydration}
              onChange={(e) => setHydration(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Nutrition Quality:</label>
            <select 
              value={nutritionQuality} 
              onChange={(e) => setNutritionQuality(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Very Poor">Very Poor</option>
            </select>
          </div>
        </div>

        {/* Fitness Section */}
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Fitness</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>Workout Motivation (1–10): {workoutMotivation}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={workoutMotivation}
              onChange={(e) => setWorkoutMotivation(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Fitness Goal:</label>
            <select 
              value={fitnessGoal} 
              onChange={(e) => setFitnessGoal(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Fat Loss">Fat Loss</option>
              <option value="Endurance">Endurance</option>
              <option value="Strength">Strength</option>
              <option value="General Fitness">General Fitness</option>
              <option value="Recovery">Recovery</option>
            </select>
          </div>
        </div>

        {/* Notes Section */}
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Additional Notes</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>Notes (optional):</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional thoughts, goals, or observations..."
              maxLength="500"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
            <small style={{ color: '#666' }}>{notes.length}/500 characters</small>
          </div>
        </div>

        <button 
          type="submit"
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Submit Enhanced Check-In
        </button>
      </form>
    </div>
  );
}

export default CheckInForm;
