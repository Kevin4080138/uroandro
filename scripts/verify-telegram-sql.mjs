// Isolated PostgreSQL audit; no application credentials, network calls or live DB writes.
// node scripts/verify-telegram-sql.mjs <path-to-pglite/dist/index.js>
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
const { PGlite } = await import(pathToFileURL(process.argv[2]).href)
const db = new PGlite()
let checks = 0
async function check(name, action) { await action(); checks++; console.log(`OK ${name}`) }
const query = (sql, args = []) => db.query(sql, args)
const scalar = async (sql, args = []) => Object.values((await query(sql, args)).rows[0])[0]
async function post() { return scalar("insert into telegram_posts(title,topic,body,status) values('Audit','Audit','Content','approved') returning id") }
const at = () => new Date(Date.now() + 7200000).toISOString()
try {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key);
    create function public.is_admin() returns boolean language sql as 'select true';`)
  for (const file of [
    '20261005000000_telegram_content_foundation.sql', '20261005010000_telegram_posts_delivery.sql',
    '20261005020000_telegram_quizzes.sql', '20261005030000_telegram_schedules.sql',
    '20261005040000_telegram_schedule_delivery_guards.sql',
  ]) await check(`migration ${file}`, async () => db.exec(await readFile(new URL(`../supabase/migrations/${file}`, import.meta.url), 'utf8')))
  const dest = await scalar("insert into telegram_destinations(name,chat_id,chat_type) values('Audit','-100123','group') returning id")
  const plan = (id, kind = 'post') => scalar('select create_telegram_schedule($1,$2,$3,1,$4)', [kind, id, dest, at()])
  const first = await post(), planned = await plan(first)
  await check('duplicate schedule rejected', () => assert.rejects(plan(first)))
  await check('past date rejected', () => assert.rejects(query('select create_telegram_schedule($1,$2,$3,1,$4)', ['post', first, dest, '2000-01-01'])))
  await check('pending content cannot change', () => assert.rejects(query("update telegram_posts set body='Changed',revision=2 where id=$1", [first])))
  await check('recipient cannot change', () => assert.rejects(query("update telegram_destinations set chat_id='-100999' where id=$1", [dest])))
  const manualJob = () => query("insert into telegram_delivery_jobs(post_id,destination_id,revision,payload) values($1,$2,1,'{}')", [first, dest])
  await check('pending manual delivery blocked', () => assert.rejects(manualJob()))
  await check('reschedule updates time', async () => {
    const next = new Date(Date.now() + 10800000).toISOString()
    await query('select change_telegram_schedule($1,$2)', [planned, next])
    assert.equal(new Date(await scalar('select scheduled_at from telegram_schedules where id=$1', [planned])).toISOString(), next)
  })
  await query("update telegram_schedules set scheduled_at=now()-interval '1 minute' where id=$1", [planned])
  await check('due plan claimed exactly once', async () => {
    assert.equal((await scalar('select claim_due_telegram_schedule()')).id, planned)
    assert.equal(await scalar('select claim_due_telegram_schedule()'), null)
  })
  await check('sending manual delivery blocked', () => assert.rejects(manualJob()))
  await check('sending cancellation blocked', () => assert.rejects(query('select change_telegram_schedule($1)', [planned])))
  await check('worker claims immutable post snapshot', async () => {
    const job = await scalar('select claim_scheduled_telegram_post($1)', [planned])
    assert.equal(job.payload.body, 'Content'); assert.equal(job.payload.destination.chat_id, '-100123')
    assert.equal(job.status, 'sending')
  })
  await check('worker duplicate blocked', () => assert.rejects(query('select claim_scheduled_telegram_post($1)', [planned])))
  await check('transaction-local worker permission does not leak', async () => {
    assert.ok(!await scalar("select current_setting('app.telegram_schedule_id',true)"))
  })
  await query("update telegram_posts set status='sent',telegram_message_ids='[123]' where id=$1", [first])
  await query("select finish_telegram_schedule($1,'sent',null)", [planned])
  await check('completion preserves sent content', async () => assert.equal(await scalar('select status from telegram_schedules where id=$1', [planned]), 'sent'))
  const second = await post(), cancel = await plan(second)
  await query('select change_telegram_schedule($1)', [cancel])
  await check('cancelled plan releases content for editing', async () => {
    await query("update telegram_posts set body='Changed',revision=2 where id=$1", [second])
    assert.equal(await scalar('select status from telegram_schedules where id=$1', [cancel]), 'cancelled')
  })
  const quiz = await scalar("insert into telegram_quizzes(title,topic,status) values('Audit quiz','Audit','approved') returning id")
  await query(`insert into telegram_quiz_questions(quiz_id,position,question,options,correct_option,explanation)
    values($1,0,'Question','["A","B","C","D"]',1,'Explanation')`, [quiz])
  const qp = await plan(quiz, 'quiz')
  await query("update telegram_schedules set scheduled_at=now()-interval '1 minute' where id=$1", [qp])
  await query("update telegram_scheduler_state set lease_until=now()-interval '1 minute'")
  await scalar('select claim_due_telegram_schedule()')
  await check('manual quiz claim blocked while scheduled worker owns it', () => assert.rejects(query('select claim_telegram_quiz_delivery($1,$2,1)', [quiz, dest])))
  await check('scheduled quiz claim retains correct answer snapshot', async () => {
    const job = await scalar('select claim_scheduled_telegram_quiz($1)', [qp])
    assert.equal(job.payload.quiz.questions[0].correct_option, 1)
  })
  await query("update telegram_schedules set started_at=now()-interval '6 minutes' where id=$1", [qp])
  await query("update telegram_scheduler_state set lease_until=now()-interval '1 minute'")
  await check('crashed worker becomes uncertain instead of being retried', async () => {
    assert.equal(await scalar('select claim_due_telegram_schedule()'), null)
    assert.equal(await scalar('select status from telegram_schedules where id=$1', [qp]), 'uncertain')
  })
  await check('unprivileged role cannot invoke worker RPC', async () => {
    await db.exec('set role authenticated')
    await assert.rejects(query('select claim_due_telegram_schedule()'))
    await db.exec('reset role')
  })
  console.log(`PASS: ${checks} PostgreSQL migration and workflow checks`)
} finally { await db.close() }
