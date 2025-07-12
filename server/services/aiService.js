const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  // Analyze recent check-ins and provide insights
  async analyzeCheckins(checkins) {
    try {
      const recentCheckins = checkins.slice(0, 7); // Last 7 days
      
      const prompt = `As a fitness and wellness AI coach, analyze this user's recent health check-ins and provide personalized insights and recommendations.

Recent Check-ins:
${recentCheckins.map(checkin => `
Date: ${new Date(checkin.timestamp).toLocaleDateString()}
Mood: ${checkin.mood}
Energy: ${checkin.energy}/10
Soreness: ${checkin.soreness}/10
Sleep: ${checkin.sleepHours || 'N/A'} hours, Quality: ${checkin.sleepQuality || 'N/A'}
Stress: ${checkin.stressLevel || 'N/A'}/10
Recovery: ${checkin.recovery || 'N/A'}
Hydration: ${checkin.hydration || 'N/A'}/10
Nutrition: ${checkin.nutritionQuality || 'N/A'}
Workout Motivation: ${checkin.workoutMotivation || 'N/A'}/10
Fitness Goal: ${checkin.fitnessGoal || 'N/A'}
Notes: ${checkin.notes || 'None'}
`).join('\n')}

Please provide:
1. **Overall Health Assessment** (2-3 sentences)
2. **Key Patterns** you notice (mood, energy, sleep, stress trends)
3. **Workout Recommendations** based on current state
4. **Recovery Advice** if needed
5. **Nutrition Tips** based on goals and current state
6. **Motivation Boost** if energy/motivation is low

Keep each section concise and actionable. Be encouraging but realistic.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are FitCoach AI, a supportive and knowledgeable fitness and wellness coach. Provide personalized, actionable advice based on user data. Be encouraging, realistic, and focus on practical steps users can take."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return "I'm having trouble analyzing your data right now. Please try again later.";
    }
  }

  // Generate personalized workout recommendations
  async generateWorkoutRecommendation(checkin) {
    try {
      const prompt = `Based on this user's current state, suggest a personalized workout:

Current State:
- Mood: ${checkin.mood}
- Energy Level: ${checkin.energy}/10
- Soreness: ${checkin.soreness}/10
- Recovery Status: ${checkin.recovery || 'N/A'}
- Stress Level: ${checkin.stressLevel || 'N/A'}/10
- Workout Motivation: ${checkin.workoutMotivation || 'N/A'}/10
- Fitness Goal: ${checkin.fitnessGoal || 'General Fitness'}

Provide:
1. **Workout Type** (strength, cardio, yoga, rest day, etc.)
2. **Intensity Level** (low, moderate, high)
3. **Duration** (15, 30, 45, 60 minutes)
4. **Specific Exercises** (3-5 exercises with sets/reps)
5. **Modifications** if needed for current state
6. **Recovery Tips** if soreness is high

Be specific and consider their current energy, soreness, and motivation levels.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a personal trainer creating customized workout plans. Consider the user's current physical and mental state to provide safe, effective, and motivating workout recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Workout Recommendation Error:', error);
      return "I'm having trouble generating a workout recommendation right now. Consider taking a rest day or doing light stretching.";
    }
  }

  // Answer user questions about their health data
  async answerHealthQuestion(question, checkins) {
    try {
      const recentCheckins = checkins.slice(0, 7);
      
      const prompt = `A user is asking about their health data. Here's their question:
"${question}"

Recent Check-in Data:
${recentCheckins.map(checkin => `
Date: ${new Date(checkin.timestamp).toLocaleDateString()}
Mood: ${checkin.mood}
Energy: ${checkin.energy}/10
Soreness: ${checkin.soreness}/10
Sleep: ${checkin.sleepHours || 'N/A'} hours, Quality: ${checkin.sleepQuality || 'N/A'}
Stress: ${checkin.stressLevel || 'N/A'}/10
Recovery: ${checkin.recovery || 'N/A'}
Hydration: ${checkin.hydration || 'N/A'}/10
Nutrition: ${checkin.nutritionQuality || 'N/A'}
Workout Motivation: ${checkin.workoutMotivation || 'N/A'}/10
Fitness Goal: ${checkin.fitnessGoal || 'N/A'}
`).join('\n')}

Please provide a helpful, personalized answer based on their data. Be encouraging and actionable.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are FitCoach AI, a supportive health and fitness coach. Answer questions based on the user's data, provide personalized insights, and offer practical advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Health Question Error:', error);
      return "I'm having trouble processing your question right now. Please try again later.";
    }
  }
}

module.exports = new AIService(); 