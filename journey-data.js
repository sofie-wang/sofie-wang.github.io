// Qualitative journey narrative supplied by Sofie. Directions are proposals,
// distinct from pain points and opportunities; no validation is implied.
export const moodieJourney = [
  {
    id: 'onboarding', title: 'Awareness & Onboarding',
    summary: 'Discover a tool for bedtime connection.',
    emotion: 'Curious and hopeful.',
    painSummary: 'Too much setup before getting started.',
    goal: 'Find a tool to help Mia express emotions and reinforce positive values during bedtime.',
    action: 'Lily discovers an emotion education app, downloads it, and completes onboarding.',
    pain: 'Excessive setup questions may create friction.',
    opportunity: 'Simplify onboarding and reduce unnecessary setup steps.',
    direction: 'Progressive onboarding that collects only essential information initially.',
    // Coordinates illustrate a narrative, not measured emotion scores.
    y: 65, accent: '#b5a3db'
  },
  {
    id: 'daily', title: 'Daily Use',
    summary: 'Name a feeling and share the day.',
    emotion: 'Initially engaged, followed by frustration.',
    painSummary: 'Typing is difficult; check-ins can be forgotten.',
    goal: 'Help Mia reflect on her day and express her emotions.',
    action: 'Lily opens the app and asks Mia how she feels. Mia shares her experiences but struggles with typing.',
    pain: 'Young children may struggle with text-based interaction. Parents may also forget to open the app regularly.',
    opportunity: 'Introduce child-friendly input methods and reduce the effort required for daily check-ins.',
    direction: 'Voice-based input, playful visual prompts, and lightweight check-ins.',
    y: 140, accent: '#d2ae91'
  },
  {
    id: 'story', title: 'Story Generation',
    summary: 'Turn daily experiences into a bedtime tale.',
    emotion: 'Interested but occasionally disappointed.',
    painSummary: 'Generic stories can miss the child’s experience.',
    goal: 'Use bedtime storytelling to reinforce emotional learning.',
    action: 'The app generates a personalized bedtime story based on Mia’s emotional experiences.',
    pain: 'AI-generated stories may feel repetitive or generic, and content may not always match the child’s experience.',
    opportunity: 'Improve story relevance and personalization.',
    direction: 'Use contextual prompts, personalized story elements, and parent-guided customization.',
    y: 100, accent: '#aea8ce'
  },
  {
    id: 'reflection', title: 'Reflection & Parent Insights',
    summary: 'Look back on emotional patterns together.',
    emotion: 'Interested but potentially overwhelmed.',
    painSummary: 'Too much data; too little actionable guidance.',
    goal: 'Understand Mia’s emotional patterns and progress over time.',
    action: 'Lily reviews a weekly emotional summary and receives parenting suggestions.',
    pain: 'Too much information can overwhelm parents. Generic recommendations may not feel actionable.',
    opportunity: 'Present insights in a clear, concise, and personalized way.',
    direction: 'A simplified insights dashboard highlighting meaningful patterns and actionable recommendations.',
    y: 127, accent: '#b7c9b4'
  }
];
