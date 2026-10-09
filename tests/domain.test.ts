import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { diagnosticQuestions as bank } from '../server/db/questions'
import { selectQuestions } from '../server/domain/select-questions'
import { calculateDiagnosticResult } from '../server/domain/result'
import { answersSchema, filtersSchema, profileSchema, validateAnswers } from '../server/domain/validation'
import { assertDevelopmentSeed, assertLocalReset, getEnvironment } from '../server/domain/environment'
import { publicQuestion } from '../server/domain/sessions'
import { protectDistribution } from '../server/domain/dashboard'
import { competencyIds } from '../shared/diagnostic'

test('seed matches all 28 questions, contexts and 112 alternatives in the source document', () => {
  const source = readFileSync('banco-questoes-padi.md','utf8')
  assert.equal(bank.length,28)
  for (const [i,q] of bank.entries()) {
    assert.equal(q.id,`Q${String(i+1).padStart(2,'0')}`)
    assert.equal(q.competency,competencyIds[Math.floor(i/4)])
    const block = source.split(`## ${q.id} — `)[1]!.split('\n## ')[0]!
    assert.ok(block.includes(q.statement))
    assert.deepEqual(block.match(/\*\*Contextos:\*\* (.+)/)![1]!.split(', '),q.contexts)
    assert.equal(q.options.length,4)
    for (const o of q.options) assert.ok(block.includes(`**${o.id} — ${o.score} ponto${o.score === 1 ? '' : 's'}:** ${o.label}`))
  }
})
test('research selects exactly two questions per axis and no duplicates', () => {
  for(let i=0;i<100;i++) {
    const selected=selectQuestions({questions:bank,total:14,context:'diagnostico'})
    assert.equal(selected.length,14); assert.equal(new Set(selected.map(q=>q.id)).size,14)
    for(const id of competencyIds) assert.equal(selected.filter(q=>q.competency===id).length,2)
  }
})
test('fair selects five distinct axes and eligible questions only', () => {
  for(let i=0;i<100;i++) {
    const selected=selectQuestions({questions:bank,total:5,context:'feira'})
    assert.equal(new Set(selected.map(q=>q.competency)).size,5)
    assert.ok(selected.every(q=>q.contexts.includes('feira')))
  }
})
test('selection generalizes to 1–28 and fails for impossible or broken banks', () => {
  for(let total=1;total<=28;total++) {
    const selected=selectQuestions({questions:bank,total,context:'diagnostico'})
    const counts=competencyIds.map(id=>selected.filter(q=>q.competency===id).length)
    assert.equal(selected.length,total)
    assert.ok(Math.max(...counts)-Math.min(...counts)<=1)
    if(total>=7) assert.ok(counts.every(n=>n>=1))
  }
  for(const total of [0,-1,29,NaN,1.5]) assert.throws(()=>selectQuestions({questions:bank,total,context:'diagnostico'}))
  assert.throws(()=>selectQuestions({questions:bank.slice(4),total:14,context:'diagnostico'}))
  assert.throws(()=>selectQuestions({questions:[...bank,bank[0]!],total:14,context:'diagnostico'}))
})
test('server calculates normalized scores and omits absent competencies', () => {
  const q=[bank[0]!,bank[1]!,bank[4]!]
  const result=calculateDiagnosticResult(q,{Q01:'A',Q02:'B',Q05:'C'})
  assert.equal(result.earnedScore,3);assert.equal(result.maxScore,6);assert.equal(result.overallPercentage,50)
  assert.equal(result.competencies.length,2)
  assert.equal(result.competencies[0]!.percentage,75)
  assert.equal(result.competencies[1]!.percentage,0)
})
test('submission rejects incomplete, duplicate, foreign and invalid answers, or completed session', () => {
  const q=bank.slice(0,2)
  const valid=[{questionId:'Q01',optionId:'A'},{questionId:'Q02',optionId:'B'}]
  assert.deepEqual(validateAnswers(q,valid,false),{Q01:'A',Q02:'B'})
  for(const input of [valid.slice(0,1),[valid[0]!,valid[0]!],[valid[0]!,{questionId:'Q03',optionId:'A'}],[valid[0]!,{questionId:'Q02',optionId:'Z'}]]) assert.throws(()=>validateAnswers(q,input,false))
  assert.throws(()=>validateAnswers(q,valid,true))
  assert.equal(answersSchema.safeParse({answers:valid,score:100}).success,false)
})
test('public question projection never exposes internal metadata', () => {
  const q=publicQuestion(bank[0]!)
  assert.deepEqual(Object.keys(q).sort(),['competency','id','options','statement'])
  for(const o of q.options) assert.deepEqual(Object.keys(o).sort(),['id','label'])
})
test('filters and contextual options reject unknown keys, values and arrays', () => {
  assert.equal(filtersSchema.safeParse({}).success,true)
  assert.equal(filtersSchema.safeParse({area:'tecnologia'}).success,true)
  for(const input of [{area:'unknown'},{total:'5'},{area:['tecnologia']},{course:'computacao'},{semester:'1'}]) assert.equal(filtersSchema.safeParse(input).success,false)
  for (const area of ['tecnologia','servicos','sem-area','prefiro-nao-informar'])
    assert.equal(profileSchema.safeParse({area}).success,true)
  for (const input of [{}, {area:''}, {area:'unknown'}, {area:'tecnologia',course:'computacao'}])
    assert.equal(profileSchema.safeParse(input).success,false)
})
test('production seed and remote resets fail closed', () => {
  assert.throws(()=>assertDevelopmentSeed('production'))
  assert.doesNotThrow(()=>assertDevelopmentSeed('local'));assert.doesNotThrow(()=>assertDevelopmentSeed('homolog'))
  assert.throws(()=>assertLocalReset('production'));assert.throws(()=>assertLocalReset('homolog'))
  assert.doesNotThrow(()=>assertLocalReset('local'))
  assert.throws(()=>getEnvironment({}));assert.throws(()=>getEnvironment({APP_ENV:'development'}))
  assert.throws(()=>getEnvironment({APP_ENV:'homolog',VERCEL_ENV:'production'}))
  assert.throws(()=>getEnvironment({APP_ENV:'production',VERCEL_ENV:'preview'}))
})
test('small distribution cells suppress the entire breakdown, preventing subtraction', () => {
  assert.equal(protectDistribution([{value:'A',count:40},{value:'B',count:4}]),null)
  assert.deepEqual(protectDistribution([{value:'A',count:5},{value:'B',count:5}])?.map(r=>r.percentage),[50,50])
})

test('session access requires an independent secret, fails closed for legacy sessions', async () => {
  const { createSessionAccess, assertSessionAccess, hashSessionToken } = await import('../server/domain/session-access')
  const first = createSessionAccess()
  const second = createSessionAccess()
  assert.equal(first.accessToken.length,43)
  assert.equal(first.accessTokenHash.length,64)
  assert.notEqual(first.accessToken,second.accessToken)
  assert.equal(hashSessionToken(first.accessToken),first.accessTokenHash)
  assert.doesNotThrow(() => assertSessionAccess(first.accessTokenHash,first.accessToken))
  for (const token of [undefined,'',second.accessToken,'00000000-0000-4000-8000-000000000000'])
    assert.throws(() => assertSessionAccess(first.accessTokenHash,token), {statusCode:403})
  assert.throws(() => assertSessionAccess(null,first.accessToken), {statusCode:403})
})

test('area filter checks the overall sample for small complements', async () => {
  const { filterAncestors, isSmallRemainder } = await import('../server/domain/aggregate-privacy')
  const ancestors = filterAncestors({area:'tecnologia'})
  assert.equal(ancestors.length,1)
  assert.ok(ancestors.some(f => Object.keys(f).length === 0))
  assert.equal(isSmallRemainder(8,5),true)
  assert.equal(isSmallRemainder(10,5),false)
  assert.equal(isSmallRemainder(5,5),false)
})
