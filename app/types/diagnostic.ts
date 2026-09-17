export type Competency =
  | 'information-critical-thinking'
  | 'security-privacy'
  | 'digital-citizenship'
  | 'artificial-intelligence-critical-thinking'

export const competencyLabels: Record<Competency, string> = {
  'information-critical-thinking': 'Informação e pensamento crítico',
  'security-privacy': 'Segurança e privacidade',
  'digital-citizenship': 'Cidadania digital',
  'artificial-intelligence-critical-thinking': 'Inteligência artificial e pensamento crítico'
}

export type QuestionOption = {
  id: string
  label: string
  score: number
}

export type Question = {
  id: string
  competency: Competency
  statement: string
  options: QuestionOption[]
}

export type CompetencyResult = {
  competency: Competency
  earnedScore: number
  maxScore: number
  percentage: number
  feedback: string
}

export type DiagnosticResult = {
  overallPercentage: number
  competencies: CompetencyResult[]
}