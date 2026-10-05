-- Run AFTER the schedules migration and deployment.
-- Enable pg_cron and pg_net in Supabase Database > Extensions first.
-- In Supabase Vault create these named secrets (do not commit their values):
-- telegram_scheduler_url = https://YOUR-PRODUCTION-DOMAIN/api/cron/telegram-kontent
-- telegram_scheduler_secret = the SAME value as Vercel's CRON_SECRET
-- Re-running this script updates the named cron job instead of duplicating it.
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM pg_extension WHERE extname='pg_cron')
    OR NOT EXISTS(SELECT 1 FROM pg_extension WHERE extname='pg_net') THEN
    RAISE EXCEPTION 'Enable pg_cron and pg_net in Supabase first';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM vault.decrypted_secrets WHERE name='telegram_scheduler_url'
    AND decrypted_secret ~ '^https://[^/]+/api/cron/telegram-kontent$')
    OR NOT EXISTS(SELECT 1 FROM vault.decrypted_secrets WHERE name='telegram_scheduler_secret' AND length(decrypted_secret)>=16) THEN
    RAISE EXCEPTION 'Create telegram_scheduler_url and telegram_scheduler_secret in Vault first';
  END IF;
END $$;

SELECT cron.schedule('urosfera-telegram-scheduler', '* * * * *', $job$
  SELECT net.http_get(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='telegram_scheduler_url'),
    headers := jsonb_build_object('Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='telegram_scheduler_secret')),
    timeout_milliseconds := 180000
  );
$job$);
