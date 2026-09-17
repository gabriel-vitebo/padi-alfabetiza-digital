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
}

export type Question = {
  id: string
  competency: Competency
  statement: string
  options: QuestionOption[]
}