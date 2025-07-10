import { useState, useEffect } from 'react';

function CheckInList() {
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    // Fetch check-ins when component mounts
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch('http://localhost:5050/api/checkins', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCheckins(data);
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      'Excellent': '😄',
      'Good': '🙂',
      'Okay': '😐',
      'Poor': '😔',
      'Terrible': '😢'
    };
    return emojis[mood] || '😐';
  };

  const getSleepQualityEmoji = (quality) => {
    const emojis = {
      'Excellent': '😴',
      'Good': '😊',
      'Fair': '😐',
      'Poor': '😴',
      'Terrible': '😵'
    };
    return emojis[quality] || '😐';
  };

  // Helper to show N/A for missing values
  const show = (val, suffix = '') => (val === undefined || val === null || val === '' ? 'N/A' : `${val}${suffix}`);

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <h2>Recent Health Check-ins</h2>
      {checkins.length === 0 ? (
        <p>No check-ins yet. Complete your first enhanced check-in above!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {checkins.map((checkin, index) => (
            <div 
              key={index} 
              style={{
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '12px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #eee'
              }}>
                <h3 style={{ margin: 0, color: '#333' }}>
                  {getMoodEmoji(checkin.mood)} {show(checkin.mood)} Mood
                </h3>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  {new Date(checkin.timestamp).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {/* Core Wellness */}
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>Core Wellness</h4>
                  <p><strong>Energy:</strong> {show(checkin.energy, '/10')}</p>
                  <p><strong>Soreness:</strong> {show(checkin.soreness, '/10')}</p>
                </div>

                {/* Sleep */}
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#28a745' }}>Sleep</h4>
                  <p><strong>Hours:</strong> {show(checkin.sleepHours, 'h')}</p>
                  <p><strong>Quality:</strong> {checkin.sleepQuality ? getSleepQualityEmoji(checkin.sleepQuality) + ' ' + checkin.sleepQuality : 'N/A'}</p>
                </div>

                {/* Stress & Recovery */}
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffc107' }}>Stress & Recovery</h4>
                  <p><strong>Stress:</strong> {show(checkin.stressLevel, '/10')}</p>
                  <p><strong>Recovery:</strong> {show(checkin.recovery)}</p>
                </div>

                {/* Hydration & Nutrition */}
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#17a2b8' }}>Hydration & Nutrition</h4>
                  <p><strong>Hydration:</strong> {show(checkin.hydration, '/10')}</p>
                  <p><strong>Nutrition:</strong> {show(checkin.nutritionQuality)}</p>
                </div>

                {/* Fitness */}
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#dc3545' }}>Fitness</h4>
                  <p><strong>Motivation:</strong> {show(checkin.workoutMotivation, '/10')}</p>
                  <p><strong>Goal:</strong> {show(checkin.fitnessGoal)}</p>
                </div>
              </div>

              {/* Notes */}
              {checkin.notes && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #007bff'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>Notes</h4>
                  <p style={{ margin: 0, fontStyle: 'italic' }}>"{checkin.notes}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CheckInList;