import { type Competency, competencyLabels, type DiagnosticResult, type Question } from '~/types/diagnostic'

export const diagnosticFeedback = (percentage: number) => {
  if (percentage < 40) return 'Há oportunidades importantes para desenvolver esta competência.'
  if (percentage < 70) return 'Você demonstra alguns conhecimentos nesta competência, com espaço para aprofundamento.'
  return 'Suas respostas demonstram bom domínio das situações apresentadas nesta competência.'
}

export const calculateDiagnosticResult = (
  questions: Question[],
  answers: Record<string, string>
): DiagnosticResult => {
  const competencies = [...new Set(questions.map(question => question.competency))]
  let earnedTotal = 0
  let maximumTotal = 0

  const results = competencies.map((competency: Competency) => {
    const competencyQuestions = questions.filter(question => question.competency === competency)
    const maxScore = competencyQuestions.reduce((total, question) => {
      return total + Math.max(...question.options.map(option => option.score), 0)
    }, 0)
    const earnedScore = competencyQuestions.reduce((total, question) => {
      const selectedOption = question.options.find(option => option.id === answers[question.id])
      return total + (selectedOption?.score ?? 0)
    }, 0)
    const percentage = maxScore === 0 ? 0 : (earnedScore / maxScore) * 100

    earnedTotal += earnedScore
    maximumTotal += maxScore

    return {
      competency,
      earnedScore,
      maxScore,
      percentage,
      feedback: diagnosticFeedback(percentage)
    }
  })

  return {
    overallPercentage: maximumTotal === 0 ? 0 : (earnedTotal / maximumTotal) * 100,
    competencies: results
  }
}

export const getCompetencyLabel = (competency: Competency) => competencyLabels[competency]