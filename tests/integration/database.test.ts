import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createDatabase } from '../../server/db/client'
import { getEnvironment } from '../../server/domain/environment'
import { startSession, submitSession, getSession, getResult } from '../../server/domain/sessions'
import { dashboardSummary } from '../../server/domain/dashboard'
if (getEnvironment() !== 'local' || !new URL(process.env.DATABASE_URL!).pathname.endsWith('_test')) throw new Error('Testes exigem APP_ENV=local e banco com sufixo _test')
const sql=createDatabase()
const ids:string[]=[]
const profile={course:'computacao',semester:'1',device:'computador',internet:'regular',help:'raramente'}
before(async()=>{const count=await sql.surveySession.count();assert.equal(count,0,'Use banco de teste vazio')})
after(async()=>{ if(ids.length) await sql.$transaction(async tx=>{
  await tx.surveyAnswer.deleteMany({where:{sessionId:{in:ids}}})
  await tx.surveySession.deleteMany({where:{id:{in:ids}}})
});await sql.$disconnect() })
test('atomic persistence, concurrent completion, immutable snapshot and dashboard privacy', async()=>{
  assert.equal((await dashboardSummary(sql,{})).status,'empty')
  const session=await startSession(sql,'research',profile);ids.push(session.sessionId)
  assert.equal(session.questions.length,14)
  assert.deepEqual(await getSession(sql,session.sessionId,session.accessToken), {sessionId:session.sessionId,mode:session.mode,completed:false,questions:session.questions})
  await assert.rejects(getSession(sql,session.sessionId,undefined), {statusCode:403})
  await assert.rejects(getResult(sql,session.sessionId,'x'.repeat(43)), {statusCode:403})
  const stored = await sql.surveySession.findUniqueOrThrow({where:{id:session.sessionId}})
  assert.notEqual(stored.accessTokenHash,session.accessToken)
  assert.equal(stored.accessTokenHash?.length,64)
  const answers=session.questions.map(q=>({questionId:q.id,optionId:'A'}))
  await assert.rejects(submitSession(sql,session.sessionId,answers,undefined), {statusCode:403})
  assert.ok(!JSON.stringify(session).includes('score'))
  const questionId=session.questions[0]!.id
  // Database protection remains effective even when API validation is bypassed.
  await assert.rejects(sql.surveyAnswer.create({data:{sessionId:session.sessionId,questionId,optionId:'FOREIGN',score:0}}))
  await assert.rejects(sql.$transaction(async tx=>{
    const data={sessionId:session.sessionId,questionId,optionId:'A',score:2}
    await tx.surveyAnswer.create({data})
    await tx.surveyAnswer.create({data})
  }))
  assert.equal(await sql.surveyAnswer.count({where:{sessionId:session.sessionId}}),0)
  assert.equal((await getSession(sql,session.sessionId,session.accessToken)).completed,false)
  await assert.rejects(sql.surveySession.update({where:{id:session.sessionId},data:{status:'COMPLETED'}}))
  await assert.rejects(sql.surveySession.update({where:{id:session.sessionId},data:{status:'COMPLETED',completedAt:new Date()}}))

  await assert.rejects(submitSession(sql,session.sessionId,answers.slice(1),session.accessToken))
  const outside = (await sql.question.findMany({select:{id:true}})).find(q => !session.questions.some(s => s.id === q.id))!
  for (const invalid of [
    [{questionId:outside.id,optionId:'A'},...answers.slice(1)],
    [{questionId,optionId:'FOREIGN'},...answers.slice(1)],
    [answers[1]!,...answers.slice(1)]
  ]) await assert.rejects(submitSession(sql,session.sessionId,invalid,session.accessToken), {statusCode:400})
  const zero=await sql.surveyAnswer.count({where:{sessionId:session.sessionId}});assert.equal(zero,0)
  const settled=await Promise.allSettled([submitSession(sql,session.sessionId,answers,session.accessToken),submitSession(sql,session.sessionId,answers,session.accessToken)])
  assert.equal(settled.filter(r=>r.status==='fulfilled').length,1, JSON.stringify(settled.map(r=>r.status==='rejected'?String(r.reason):'ok')))
  const result=await getResult(sql,session.sessionId,session.accessToken)
  await assert.rejects(submitSession(sql,session.sessionId,answers,session.accessToken), {statusCode:409})
  assert.equal(result.overallPercentage,100);assert.equal(result.competencies.length,7)
  assert.equal((await dashboardSummary(sql,{})).status,'insufficient')
  // Editing the bank cannot change an existing session's presentation or scores.
  const first=session.questions[0]!
  try {
    await sql.questionOption.update({where:{questionId_id:{questionId:first.id,id:'A'}},data:{score:0}})
    assert.equal((await getResult(sql,session.sessionId,session.accessToken)).overallPercentage,100)
  } finally {await sql.questionOption.update({where:{questionId_id:{questionId:first.id,id:'A'}},data:{score:2}})}
  const fair=await startSession(sql,'fair');ids.push(fair.sessionId)
  assert.equal(fair.questions.length,5);assert.equal(new Set(fair.questions.map(q=>q.competency)).size,5)
  await submitSession(sql,fair.sessionId,fair.questions.map(q=>({questionId:q.id,optionId:'B'})),fair.accessToken)
  assert.equal((await getResult(sql,fair.sessionId,fair.accessToken)).overallPercentage,null)
  for(let i=0;i<9;i++) {
    const s=await startSession(sql,'research',{...profile,course:i<4?'computacao':'outro'});ids.push(s.sessionId)
    await submitSession(sql,s.sessionId,s.questions.map(q=>({questionId:q.id,optionId:i<4?'A':'B'})),s.accessToken)
  }
  const all=await dashboardSummary(sql,{})
  assert.equal(all.status,'ready');assert.equal(all.segment?.count,10);assert.equal(all.segment?.average,75)
  const filtered=await dashboardSummary(sql,{course:'computacao'})
  assert.equal(filtered.segment?.count,5);assert.equal(filtered.segment?.average,100);assert.equal(filtered.overall?.average,75)
  assert.equal((await dashboardSummary(sql,{device:'celular'})).status,'insufficient')
  // An eight-person course with a five-person subsegment leaves three people.
  // Comparing only against the whole sample would miss this disclosure.
  for(let i=0;i<3;i++) {
    const s=await startSession(sql,'research',{...profile,semester:'2'});ids.push(s.sessionId)
    await submitSession(sql,s.sessionId,s.questions.map(q=>({questionId:q.id,optionId:'A'})),s.accessToken)
  }
  assert.equal((await dashboardSummary(sql,{course:'computacao',semester:'1'})).status,'insufficient')
})
