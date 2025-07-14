import { useState } from "react";
import { Card, CardContent, Typography, Box, TextField, Slider, Select, MenuItem, Button, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
  // Weight
  const [weight, setWeight] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          notes,
          weight: weight ? Number(weight) : undefined
        })
      });
      if (response.ok) {
        setSubmitted(true);
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
        setWeight("");
        setTimeout(() => navigate('/'), 1200); // Redirect after short delay
      } else {
        console.error("Failed to submit check-in");
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5" color="primary" gutterBottom>Daily Health Check-In</Typography>
          {submitted && <Typography color="success.main" sx={{ mb: 2 }}>✅ Enhanced check-in submitted!</Typography>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Core Wellness Section */}
            <Box>
              <Typography variant="h6" color="secondary" gutterBottom>Core Wellness</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Mood</InputLabel>
                <Select value={mood} label="Mood" onChange={e => setMood(e.target.value)} required>
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Okay">Okay</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                  <MenuItem value="Terrible">Terrible</MenuItem>
                </Select>
              </FormControl>
              <Typography gutterBottom>Energy Level: {energy}</Typography>
              <Slider value={energy} min={1} max={10} step={1} onChange={(_, v) => setEnergy(v)} valueLabelDisplay="auto" sx={{ mb: 2 }} />
              <Typography gutterBottom>Soreness Level: {soreness}</Typography>
              <Slider value={soreness} min={1} max={10} step={1} onChange={(_, v) => setSoreness(v)} valueLabelDisplay="auto" sx={{ mb: 2 }} />
              <TextField label="Weight (lbs)" type="number" min="0" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} fullWidth sx={{ mb: 2 }} />
            </Box>
            {/* Sleep Section */}
            <Box>
              <Typography variant="h6" color="secondary" gutterBottom>Sleep</Typography>
              <Typography gutterBottom>Hours of Sleep: {sleepHours}</Typography>
              <Slider value={sleepHours} min={0} max={24} step={1} onChange={(_, v) => setSleepHours(v)} valueLabelDisplay="auto" sx={{ mb: 2 }} />
              <FormControl fullWidth>
                <InputLabel>Sleep Quality</InputLabel>
                <Select value={sleepQuality} label="Sleep Quality" onChange={e => setSleepQuality(e.target.value)}>
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                  <MenuItem value="Terrible">Terrible</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Stress & Recovery Section */}
            <Box>
              <Typography variant="h6" color="secondary" gutterBottom>Stress & Recovery</Typography>
              <Typography gutterBottom>Stress Level: {stressLevel}</Typography>
              <Slider value={stressLevel} min={1} max={10} step={1} onChange={(_, v) => setStressLevel(v)} valueLabelDisplay="auto" sx={{ mb: 2 }} />
              <FormControl fullWidth>
                <InputLabel>Recovery Status</InputLabel>
                <Select value={recovery} label="Recovery Status" onChange={e => setRecovery(e.target.value)}>
                  <MenuItem value="Fully Recovered">Fully Recovered</MenuItem>
                  <MenuItem value="Mostly Recovered">Mostly Recovered</MenuItem>
                  <MenuItem value="Somewhat Recovered">Somewhat Recovered</MenuItem>
                  <MenuItem value="Still Sore">Still Sore</MenuItem>
                  <MenuItem value="Very Sore">Very Sore</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Hydration & Nutrition Section */}
            <Box>
              <Typography variant="h6" color="secondary" gutterBottom>Hydration & Nutrition</Typography>
              <Typography gutterBottom>Hydration Level: {hydration}</Typography>
              <Slider value={hydration} min={1} max={10} step={1} onChange={(_, v) => setHydration(v)} valueLabelDisplay="auto" sx={{ mb: 2 }} />
              <FormControl fullWidth>
                <InputLabel>Nutrition Quality</InputLabel>
                <Select value={nutritionQuality} label="Nutrition Quality" onChange={e => setNutritionQuality(e.target.value)}>
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                  <MenuItem value="Very Poor">Very Poor</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Fitness Section */}
            <Box>
              <Typography variant="h6" color="secondary" gutterBottom>Fitness</Typography>
              <Typography gutterBottom>Workout Motivation: {workoutMotivation}</Typography>
              <Slider value={workoutMotivation} min={1} max={10} step={1} onChange={(_, v) => setWorkoutMotivation(v)} valueLabelDisplay="auto" sx={{ mb: 2 }} />
              <FormControl fullWidth>
                <InputLabel>Fitness Goal</InputLabel>
                <Select value={fitnessGoal} label="Fitness Goal" onChange={e => setFitnessGoal(e.target.value)}>
                  <MenuItem value="Muscle Gain">Muscle Gain</MenuItem>
                  <MenuItem value="Fat Loss">Fat Loss</MenuItem>
                  <MenuItem value="Endurance">Endurance</MenuItem>
                  <MenuItem value="Strength">Strength</MenuItem>
                  <MenuItem value="General Fitness">General Fitness</MenuItem>
                  <MenuItem value="Recovery">Recovery</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Notes Section */}
            <Box>
              <Typography variant="h6" color="secondary" gutterBottom>Additional Notes</Typography>
              <TextField
                label="Notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any additional thoughts, goals, or observations..."
                multiline
                minRows={3}
                maxRows={6}
                fullWidth
                inputProps={{ maxLength: 500 }}
                helperText={`${notes.length}/500 characters`}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ fontWeight: 600 }}>
              Submit Enhanced Check-In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CheckInForm;
