export const surveyRules = {
  research: { questionCount: 14, context: 'diagnostico' },
  fair: { questionCount: 5, context: 'feira' }
} as const
export const MIN_AGGREGATE_SAMPLE_SIZE = 5
export const contextualOptions = {
  course: [
    { value: 'computacao', label: 'Ciência da Computação' },
    { value: 'administracao', label: 'Administração' },
    { value: 'pedagogia', label: 'Pedagogia' },
    { value: 'engenharia', label: 'Engenharia' },
    { value: 'outro', label: 'Outro' }
  ],
  semester: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}º semestre` })),
  device: [
    { value: 'celular', label: 'Celular' }, { value: 'computador', label: 'Notebook/computador' },
    { value: 'tablet', label: 'Tablet' }, { value: 'outro', label: 'Outro' }
  ],
  internet: [
    { value: 'regular', label: 'Regular sem grandes dificuldades' },
    { value: 'limitada', label: 'Com algumas limitações' }, { value: 'irregular', label: 'Irregular' }
  ],
  help: [
    { value: 'frequentemente', label: 'Frequentemente' }, { value: 'as-vezes', label: 'Às vezes' },
    { value: 'raramente', label: 'Raramente' }, { value: 'nunca', label: 'Nunca' }
  ]
}
export type Profile = Record<keyof typeof contextualOptions, string>
export const profileLabels: Record<keyof Profile, string> = {
  course: 'Curso', semester: 'Semestre', device: 'Principal dispositivo para estudar',
  internet: 'Condição de acesso à internet', help: 'Frequência de necessidade de ajuda em tarefas digitais'
}
