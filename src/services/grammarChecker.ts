import type { Correction } from '../types'

interface GrammarRule {
  pattern: RegExp
  suggestion: string | ((match: string) => string)
  explanation: string
}

const GRAMMAR_RULES: GrammarRule[] = [
  {
    pattern: /\bi am agree\b/gi,
    suggestion: 'I agree',
    explanation: 'Use "I agree" — "agree" is a verb, not used with "am".',
  },
  {
    pattern: /\bhe don't\b/gi,
    suggestion: 'he doesn\'t',
    explanation: 'Third person singular uses "doesn\'t", not "don\'t".',
  },
  {
    pattern: /\bshe don't\b/gi,
    suggestion: 'she doesn\'t',
    explanation: 'Third person singular uses "doesn\'t", not "don\'t".',
  },
  {
    pattern: /\bthey was\b/gi,
    suggestion: 'they were',
    explanation: '"They" takes plural verb "were".',
  },
  {
    pattern: /\bi have (\d+) years old\b/gi,
    suggestion: 'I am $1 years old',
    explanation: 'Age uses "I am", not "I have".',
  },
  {
    pattern: /\bhow much (?:is )?the price\b/gi,
    suggestion: 'how much does it cost',
    explanation: 'A more natural way to ask about price.',
  },
  {
    pattern: /\bexplain me\b/gi,
    suggestion: 'explain to me',
    explanation: '"Explain" needs the preposition "to" before the object.',
  },
  {
    pattern: /\bdiscuss about\b/gi,
    suggestion: 'discuss',
    explanation: '"Discuss" already includes "about" — don\'t add it again.',
  },
  {
    pattern: /\breturn back\b/gi,
    suggestion: 'return',
    explanation: '"Return" already means "go back" — "back" is redundant.',
  },
  {
    pattern: /\bmore better\b/gi,
    suggestion: 'better',
    explanation: '"Better" is already comparative — no need for "more".',
  },
  {
    pattern: /\bvery unique\b/gi,
    suggestion: 'unique',
    explanation: '"Unique" means one of a kind — "very" is unnecessary.',
  },
  {
    pattern: /\bcan you (?:to )?help me to\b/gi,
    suggestion: 'can you help me',
    explanation: 'After "help me", use the base verb without "to".',
  },
  {
    pattern: /\bi am interesting in\b/gi,
    suggestion: 'I am interested in',
    explanation: 'Use "interested" (how you feel), not "interesting" (describing something).',
  },
  {
    pattern: /\blook forward to meet\b/gi,
    suggestion: 'look forward to meeting',
    explanation: 'After "look forward to", use gerund (-ing form).',
  },
  {
    pattern: /\bdepends of\b/gi,
    suggestion: 'depends on',
    explanation: 'The correct preposition is "on", not "of".',
  },
]

const EXPRESSION_IMPROVEMENTS: { pattern: RegExp; suggestion: string; explanation: string }[] = [
  {
    pattern: /\bi think so\b/gi,
    suggestion: 'I believe so / That sounds right',
    explanation: 'Try a more confident phrase in professional settings.',
  },
  {
    pattern: /\bvery very\b/gi,
    suggestion: 'extremely / really',
    explanation: 'Repeating "very" weakens your message — use a stronger adverb.',
  },
  {
    pattern: /\bi want to order\b/gi,
    suggestion: "I'd like to order",
    explanation: '"I\'d like" sounds more polite in service contexts.',
  },
  {
    pattern: /\bgive me\b/gi,
    suggestion: 'Could I have',
    explanation: '"Could I have" is more polite than "give me".',
  },
  {
    pattern: /\bi don't know nothing\b/gi,
    suggestion: "I don't know anything",
    explanation: 'Double negatives are incorrect in standard English.',
  },
]

export function checkGrammar(text: string): Correction[] {
  const corrections: Correction[] = []
  const seen = new Set<string>()

  for (const rule of GRAMMAR_RULES) {
    const matches = text.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags))
    for (const match of matches) {
      const original = match[0]
      const key = original.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)

      const suggestion =
        typeof rule.suggestion === 'function'
          ? rule.suggestion(original)
          : original.replace(rule.pattern, rule.suggestion)

      corrections.push({
        type: 'grammar',
        original,
        suggestion,
        explanation: rule.explanation,
      })
    }
  }

  for (const rule of EXPRESSION_IMPROVEMENTS) {
    const matches = text.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags))
    for (const match of matches) {
      const original = match[0]
      const key = `expr:${original.toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)

      corrections.push({
        type: 'expression',
        original,
        suggestion: rule.suggestion,
        explanation: rule.explanation,
      })
    }
  }

  return corrections
}

export function computeGrammarAccuracy(totalTurns: number, correctionCount: number): number {
  if (totalTurns === 0) return 100
  const errorRate = correctionCount / totalTurns
  return Math.max(0, Math.min(100, Math.round((1 - errorRate * 0.5) * 100)))
}
