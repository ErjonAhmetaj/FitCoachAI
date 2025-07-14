import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, Divider } from '@mui/material';

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
      
      if (!response.ok) {
        console.error('Failed to fetch check-ins:', response.status, response.statusText);
        setCheckins([]);
        return;
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setCheckins(data);
      } else {
        console.error('Expected array but got:', typeof data, data);
        setCheckins([]);
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      setCheckins([]);
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

  // Ensure checkins is always an array
  const checkinsArray = Array.isArray(checkins) ? checkins : [];

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" color="primary" gutterBottom>Recent Health Check-ins</Typography>
      {checkinsArray.length === 0 ? (
        <Typography>No check-ins yet. Complete your first enhanced check-in above!</Typography>
      ) : (
        <Grid container spacing={3}>
          {checkinsArray.map((checkin, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getMoodEmoji(checkin.mood)} {show(checkin.mood)} Mood
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(checkin.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {/* Core Wellness */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="primary">Core Wellness</Typography>
                      <Typography>Energy: {show(checkin.energy, '/10')}</Typography>
                      <Typography>Soreness: {show(checkin.soreness, '/10')}</Typography>
                      <Typography>Weight: {show(checkin.weight, ' lbs')}</Typography>
                    </Grid>
                    {/* Sleep */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="primary">Sleep</Typography>
                      <Typography>Hours: {show(checkin.sleepHours, 'h')}</Typography>
                      <Typography>Quality: {checkin.sleepQuality ? getSleepQualityEmoji(checkin.sleepQuality) + ' ' + checkin.sleepQuality : 'N/A'}</Typography>
                    </Grid>
                    {/* Stress & Recovery */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="primary">Stress & Recovery</Typography>
                      <Typography>Stress: {show(checkin.stressLevel, '/10')}</Typography>
                      <Typography>Recovery: {show(checkin.recovery)}</Typography>
                    </Grid>
                    {/* Hydration & Nutrition */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="primary">Hydration & Nutrition</Typography>
                      <Typography>Hydration: {show(checkin.hydration, '/10')}</Typography>
                      <Typography>Nutrition: {show(checkin.nutritionQuality)}</Typography>
                    </Grid>
                    {/* Fitness */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="primary">Fitness</Typography>
                      <Typography>Motivation: {show(checkin.workoutMotivation, '/10')}</Typography>
                      <Typography>Goal: {show(checkin.fitnessGoal)}</Typography>
                    </Grid>
                  </Grid>
                  {/* Notes */}
                  {checkin.notes && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="primary">Notes</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        "{checkin.notes}"
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default CheckInList;