import type { Scene } from '../types'

export const SCENES: Scene[] = [
  {
    id: 'interview',
    title: 'Job Interview',
    titleZh: '求职面试',
    description: 'Practice answering common interview questions with confidence and clarity.',
    icon: '💼',
    difficulty: 'advanced',
    aiPersona: 'You are a friendly HR manager conducting a job interview for a software engineer role.',
    openingLine: "Good morning! Thanks for coming in today. Could you start by telling me a little about yourself?",
    goals: ['Introduce yourself professionally', 'Describe your experience', 'Answer behavioral questions'],
    vocabulary: ['background', 'strengths', 'achievements', 'collaborate', 'challenge'],
  },
  {
    id: 'restaurant',
    title: 'Ordering Food',
    titleZh: '餐厅点餐',
    description: 'Order meals, ask about ingredients, and handle special requests naturally.',
    icon: '🍽️',
    difficulty: 'beginner',
    aiPersona: 'You are a warm restaurant server at a casual American diner.',
    openingLine: "Hi there! Welcome to Sunny Diner. What can I get started for you today?",
    goals: ['Order food and drinks', 'Ask about menu items', 'Request modifications politely'],
    vocabulary: ['appetizer', 'medium rare', 'allergic', 'bill', 'recommendation'],
  },
  {
    id: 'meeting',
    title: 'Team Meeting',
    titleZh: '团队会议',
    description: 'Present updates, share opinions, and participate in workplace discussions.',
    icon: '📊',
    difficulty: 'intermediate',
    aiPersona: 'You are a project lead running a weekly team sync meeting.',
    openingLine: "Alright team, let's get started. Does anyone have updates on the current sprint?",
    goals: ['Give status updates', 'Propose ideas', 'Agree or disagree politely'],
    vocabulary: ['deadline', 'blocker', 'milestone', 'stakeholder', 'action item'],
  },
  {
    id: 'travel',
    title: 'Travel & Directions',
    titleZh: '旅行问路',
    description: 'Navigate airports, hotels, and cities while asking for help.',
    icon: '✈️',
    difficulty: 'beginner',
    aiPersona: 'You are a helpful local at a tourist information desk.',
    openingLine: "Hello! Welcome to the city. How can I help you today?",
    goals: ['Ask for directions', 'Book accommodation', 'Handle travel problems'],
    vocabulary: ['platform', 'reservation', 'landmark', 'exchange rate', 'departure'],
  },
  {
    id: 'smalltalk',
    title: 'Small Talk',
    titleZh: '日常闲聊',
    description: 'Build rapport through casual conversations about hobbies, weather, and daily life.',
    icon: '💬',
    difficulty: 'beginner',
    aiPersona: 'You are a friendly neighbor meeting someone at a community event.',
    openingLine: "Hey! Nice weather today, isn't it? Are you new around here?",
    goals: ['Start conversations naturally', 'Share opinions', 'Keep the chat flowing'],
    vocabulary: ['weekend', 'hobby', 'recently', 'sounds great', 'by the way'],
  },
]

export function getSceneById(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id)
}
