import type { Scene, Correction } from '../types'

interface ResponseContext {
  scene: Scene
  userMessage: string
  turnIndex: number
  history: { role: string; text: string }[]
}

const SCENE_RESPONSES: Record<string, ((ctx: ResponseContext) => string)[]> = {
  interview: [
    (ctx) => {
      if (/about (?:my)?self|background|introduce/i.test(ctx.userMessage)) {
        return "That's a great start! What would you say is your biggest professional strength?"
      }
      if (/strength|strong|good at|skill/i.test(ctx.userMessage)) {
        return "Interesting! Can you tell me about a challenging project you worked on and how you handled it?"
      }
      if (/challenge|difficult|problem|project/i.test(ctx.userMessage)) {
        return "Thank you for sharing that. Where do you see yourself in five years?"
      }
      if (/five years|future|goal|career/i.test(ctx.userMessage)) {
        return "Great vision! Do you have any questions for me about the role or our company?"
      }
      if (/question|ask|wonder|salary|benefit/i.test(ctx.userMessage)) {
        return "Those are thoughtful questions! We'll follow up by email. Thank you for your time today — you did well!"
      }
      return "I see. Could you elaborate a bit more on that?"
    },
  ],
  restaurant: [
    (ctx) => {
      if (/burger|steak|chicken|salad|pasta|order|want|like|have/i.test(ctx.userMessage)) {
        return "Great choice! Would you like any sides with that? We have fries, coleslaw, or a house salad."
      }
      if (/fries|salad|coleslaw|side/i.test(ctx.userMessage)) {
        return "Perfect! And what would you like to drink — water, soda, or something else?"
      }
      if (/water|soda|coffee|tea|juice|beer|wine|drink/i.test(ctx.userMessage)) {
        return "Got it! Any allergies or dietary restrictions I should know about?"
      }
      if (/no|none|allerg|vegetarian|vegan|gluten/i.test(ctx.userMessage)) {
        return "Noted! I'll put that order in right away. Would you like to start with an appetizer while you wait?"
      }
      if (/appetizer|starter|no thanks|skip|bill|check/i.test(ctx.userMessage)) {
        return "Sure thing! Your order will be out shortly. Enjoy your meal!"
      }
      return "Absolutely! Is there anything else you'd like to add to your order?"
    },
  ],
  meeting: [
    (ctx) => {
      if (/update|progress|done|finished|complete|working/i.test(ctx.userMessage)) {
        return "Thanks for the update. Are there any blockers the team should know about?"
      }
      if (/blocker|issue|problem|stuck|delay/i.test(ctx.userMessage)) {
        return "Let's note that. Does anyone have suggestions on how we can unblock this?"
      }
      if (/suggest|idea|propose|recommend|could|should/i.test(ctx.userMessage)) {
        return "That's a solid suggestion. What timeline are we looking at for implementation?"
      }
      if (/timeline|deadline|week|sprint|friday|monday/i.test(ctx.userMessage)) {
        return "Sounds reasonable. Any other items before we wrap up?"
      }
      if (/no|nothing|all good|wrap|done|thanks/i.test(ctx.userMessage)) {
        return "Great meeting, everyone. I'll send out the action items. Have a good rest of your day!"
      }
      return "Good point. Could you share a bit more detail on that?"
    },
  ],
  travel: [
    (ctx) => {
      if (/hotel|stay|room|book|reservation/i.test(ctx.userMessage)) {
        return "There's a nice hotel about ten minutes from here. Would you prefer something budget-friendly or more upscale?"
      }
      if (/budget|cheap|affordable|upscale|luxury/i.test(ctx.userMessage)) {
        return "I can recommend a few options. How many nights will you be staying?"
      }
      if (/night|day|week|direction|how (?:do i|to) get|where/i.test(ctx.userMessage)) {
        return "The easiest way is to take the metro Line 2. It's about a 15-minute ride. Need a map?"
      }
      if (/map|yes|please|thank|ticket|metro/i.test(ctx.userMessage)) {
        return "Here you go! The tourist office also has free Wi-Fi if you need it. Anything else?"
      }
      if (/no|nothing|that's all|goodbye|bye/i.test(ctx.userMessage)) {
        return "Enjoy your stay! Feel free to come back if you need anything. Safe travels!"
      }
      return "Sure! What specifically would you like to know about the area?"
    },
  ],
  smalltalk: [
    (ctx) => {
      if (/weather|nice|beautiful|cold|hot|rain/i.test(ctx.userMessage)) {
        return "It really is! Do you have any plans for the weekend?"
      }
      if (/weekend|plan|going|visit|hobby|free time/i.test(ctx.userMessage)) {
        return "That sounds fun! What do you usually do to relax after a busy week?"
      }
      if (/read|movie|sport|music|game|relax|walk/i.test(ctx.userMessage)) {
        return "Nice! Have you discovered any good restaurants or cafes around here yet?"
      }
      if (/restaurant|cafe|food|eat|yes|no|new/i.test(ctx.userMessage)) {
        return "There's a great coffee shop just around the corner. You should check it out! It was really nice chatting with you."
      }
      return "Oh really? Tell me more — I'd love to hear about that!"
    },
  ],
}

export async function generateCoachResponse(ctx: ResponseContext): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined

  if (apiKey) {
    try {
      return await callOpenAI(ctx, apiKey)
    } catch {
      // fall through to local engine
    }
  }

  return generateLocalResponse(ctx)
}

async function callOpenAI(ctx: ResponseContext, apiKey: string): Promise<string> {
  const systemPrompt = `${ctx.scene.aiPersona}
You are role-playing in an English speaking practice session. Scene: ${ctx.scene.title}.
Goals: ${ctx.scene.goals.join('; ')}.
Keep responses concise (1-3 sentences), natural, and conversational.
Stay in character. Do not break the fourth wall or mention you are an AI.
Respond only in English.`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...ctx.history.slice(-6).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
    { role: 'user', content: ctx.userMessage },
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 150,
      temperature: 0.8,
    }),
  })

  if (!res.ok) throw new Error('OpenAI API error')
  const data = await res.json()
  return data.choices[0].message.content.trim()
}

function generateLocalResponse(ctx: ResponseContext): string {
  const handlers = SCENE_RESPONSES[ctx.scene.id] ?? []
  if (handlers.length > 0) {
    return handlers[0](ctx)
  }
  return "That's interesting! Could you tell me more?"
}

export function generateInlineFeedback(corrections: Correction[]): string | null {
  if (corrections.length === 0) return null
  const top = corrections[0]
  if (top.type === 'grammar') {
    return `Quick tip: instead of "${top.original}", try "${top.suggestion.split('.')[0]}".`
  }
  if (top.type === 'expression') {
    return `You could also say: "${top.suggestion.split('/')[0].trim()}" — ${top.explanation}`
  }
  return null
}

export function buildSessionSummary(
  scene: Scene,
  turns: number,
  avgPronunciation: number,
  grammarAccuracy: number,
  fluencyScore: number,
  corrections: Correction[],
  vocabularyUsed: string[],
): { strengths: string[]; improvements: string[] } {
  const strengths: string[] = []
  const improvements: string[] = []

  if (turns >= 5) strengths.push('Good engagement — you kept the conversation going.')
  else improvements.push('Try to speak more turns to build fluency.')

  if (avgPronunciation >= 80) strengths.push('Clear pronunciation overall.')
  else if (avgPronunciation >= 60) improvements.push('Work on enunciation — practice flagged words slowly.')
  else improvements.push('Focus on speaking slowly and clearly.')

  if (grammarAccuracy >= 85) strengths.push('Strong grammar accuracy.')
  else {
    const grammarIssues = corrections.filter((c) => c.type === 'grammar')
    if (grammarIssues.length > 0) {
      improvements.push(`Watch out for: "${grammarIssues[0].original}" → "${grammarIssues[0].suggestion}"`)
    } else {
      improvements.push('Review common grammar patterns before your next session.')
    }
  }

  if (fluencyScore >= 70) strengths.push('Natural conversational flow.')
  else improvements.push('Try longer, connected responses instead of short phrases.')

  const sceneVocab = scene.vocabulary.filter((v) =>
    vocabularyUsed.some((used) => used.toLowerCase().includes(v.toLowerCase())),
  )
  if (sceneVocab.length >= 2) {
    strengths.push(`Used scene vocabulary: ${sceneVocab.join(', ')}`)
  } else {
    improvements.push(`Try using these words: ${scene.vocabulary.slice(0, 3).join(', ')}`)
  }

  if (strengths.length === 0) strengths.push('Great effort completing the session!')
  if (improvements.length === 0) improvements.push('Keep practicing to maintain your level.')

  return { strengths, improvements }
}
