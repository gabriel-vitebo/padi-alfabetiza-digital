export const surveyRules = {
  research: { questionCount: 10, context: 'diagnostico' },
  fair: { questionCount: 5, context: 'feira' }
} as const
export const MIN_AGGREGATE_SAMPLE_SIZE = 5
export const contextualOptions = {
  area: [
    { value: 'tecnologia', label: 'Tecnologia e computação' },
    { value: 'gestao', label: 'Administração, negócios e finanças' },
    { value: 'educacao', label: 'Educação e ensino' },
    { value: 'saude', label: 'Saúde e bem-estar' },
    { value: 'engenharia', label: 'Engenharias, construção e indústria' },
    { value: 'direito', label: 'Direito e segurança pública' },
    { value: 'comunicacao', label: 'Comunicação, artes e cultura' },
    { value: 'servicos', label: 'Comércio e serviços' },
    { value: 'agro', label: 'Agropecuária e meio ambiente' },
    { value: 'outra', label: 'Outra área' },
    { value: 'sem-area', label: 'Não estudo nem atuo em uma área no momento' },
    { value: 'prefiro-nao-informar', label: 'Prefiro não informar' }
  ]
}
export type Profile = Record<keyof typeof contextualOptions, string>
export const profileLabels: Record<keyof Profile, string> = {
  area: 'Área de estudo ou atuação'
}
