export type CompetencyId =
  | 'access-and-use'
  | 'information-and-critical-thinking'
  | 'communication-and-collaboration'
  | 'production-and-creativity'
  | 'security-and-ethics'
  | 'citizenship-and-inclusion'
  | 'computational-thinking-and-automated-systems'

export const competencyLabels: Record<CompetencyId, string> = {
  'access-and-use': 'Acesso e utilização',
  'information-and-critical-thinking': 'Informação e pensamento crítico',
  'communication-and-collaboration': 'Comunicação e colaboração',
  'production-and-creativity': 'Produção e criatividade',
  'security-and-ethics': 'Segurança e ética',
  'citizenship-and-inclusion': 'Cidadania e inclusão',
  'computational-thinking-and-automated-systems': 'Pensamento computacional e sistemas automatizados'
}

export const competencyIds: CompetencyId[] = [
  'access-and-use',
  'information-and-critical-thinking',
  'communication-and-collaboration',
  'production-and-creativity',
  'security-and-ethics',
  'citizenship-and-inclusion',
  'computational-thinking-and-automated-systems'
]

export type QuestionContext = 'diagnostico' | 'feira'

export type QuestionOption = {
  id: string
  label: string
  score: 0 | 1 | 2
}

export type Question = {
  id: string
  competency: CompetencyId
  contexts: QuestionContext[]
  statement: string
  options: QuestionOption[]
}

export type CompetencyResult = {
  competency: CompetencyId
  earnedScore: number
  maxScore: number
  percentage: number
  feedback: string
}

export type DiagnosticResult = {
  overallPercentage: number
  competencies: CompetencyResult[]
}