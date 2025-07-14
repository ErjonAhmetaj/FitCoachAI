import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

function ProgressDashboard() {
  const [checkins, setCheckins] = useState([]);
  const [weightGoal, setWeightGoal] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [goalMessage, setGoalMessage] = useState("");
  const [goalLoading, setGoalLoading] = useState(false);

  useEffect(() => {
    const fetchCheckins = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/api/checkins', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCheckins(Array.isArray(data) ? data.reverse() : []); // reverse for chronological order
    };
    const fetchGoal = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/api/weight-goal', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.weightGoal !== undefined && data.weightGoal !== null) {
        setWeightGoal(data.weightGoal);
        setGoalInput(data.weightGoal);
      }
    };
    fetchCheckins();
    fetchGoal();
  }, []);

  // Update weight goal
  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    setGoalLoading(true);
    setGoalMessage("");
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5050/api/weight-goal', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ weightGoal: goalInput })
    });
    const data = await response.json();
    setGoalLoading(false);
    if (response.ok) {
      setWeightGoal(data.weightGoal);
      setGoalMessage('Weight goal updated!');
    } else {
      setGoalMessage(data.error || 'Failed to update weight goal');
    }
  };

  // Map mood strings to numbers for charting
  const moodToNum = mood => {
    switch (mood) {
      case 'Excellent': return 5;
      case 'Good': return 4;
      case 'Okay': return 3;
      case 'Poor': return 2;
      case 'Terrible': return 1;
      default: return null;
    }
  };
  const numToMood = num => ['Terrible','Poor','Okay','Good','Excellent'][num-1] || 'N/A';

  // Prepare data for charts
  const chartData = checkins.map(c => ({
    date: new Date(c.timestamp).toLocaleDateString(),
    mood: moodToNum(c.mood),
    energy: c.energy,
    sleep: c.sleepHours,
    soreness: c.soreness,
    stress: c.stressLevel,
    hydration: c.hydration,
    weight: c.weight,
  }));

  // Find the most recent weight
  const latestWeight = chartData.find(d => d.weight !== undefined && d.weight !== null)?.weight;
  const showProgress = latestWeight && weightGoal;
  const progressPercent = showProgress ? Math.round(100 * (latestWeight / weightGoal)) : 0;

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: 'auto' }}>
      <h2>📈 Progress Dashboard</h2>
      {/* Weight Goal Section */}
      <div style={{ marginBottom: '2rem', background: '#f8f9fa', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3>🎯 Weight Goal</h3>
        <form onSubmit={handleGoalSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <label>Set your weight goal (lbs):</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            style={{ width: '120px', padding: '0.5rem' }}
          />
          <button type="submit" disabled={goalLoading} style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: goalLoading ? 'not-allowed' : 'pointer' }}>
            {goalLoading ? 'Saving...' : 'Save Goal'}
          </button>
        </form>
        {goalMessage && <div style={{ color: goalMessage.includes('updated') ? 'green' : 'red' }}>{goalMessage}</div>}
        {weightGoal && <div style={{ marginTop: '0.5rem' }}>Current goal: <strong>{weightGoal} lbs</strong></div>}
        {showProgress && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '0.25rem' }}>Latest weight: <strong>{latestWeight} lbs</strong></div>
            <div style={{ background: '#e9ecef', borderRadius: '4px', height: '24px', width: '100%', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, background: '#28a745', height: '100%', transition: 'width 0.5s' }}></div>
            </div>
            <div style={{ fontSize: '0.95rem', marginTop: '0.25rem' }}>Progress: {progressPercent}% of goal</div>
          </div>
        )}
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Mood Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} tickFormatter={numToMood} allowDecimals={false} />
            <Tooltip formatter={(value, name) => name === 'mood' ? numToMood(value) : value} />
            <Legend />
            <Line type="monotone" dataKey="mood" stroke="#8884d8" name="Mood" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Energy & Soreness Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="energy" stroke="#82ca9d" name="Energy" dot />
            <Line type="monotone" dataKey="soreness" stroke="#ff7300" name="Soreness" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Sleep Hours Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sleep" fill="#8884d8" name="Sleep Hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Stress & Hydration Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="stress" stroke="#8884d8" name="Stress" dot />
            <Line type="monotone" dataKey="hydration" stroke="#00bcd4" name="Hydration" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weight Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Weight Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData.filter(d => d.weight !== undefined && d.weight !== null)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={true} label={{ value: 'lbs', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#ff1493" name="Weight (lbs)" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProgressDashboard; 