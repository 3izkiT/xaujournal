# Backup and Restore Checklist

## Daily

- Verify automated Postgres backup completed successfully.
- Verify object storage lifecycle/replication jobs completed.
- Record backup job IDs in operations log.

## Weekly

- Run checksum/integrity check on latest DB backup artifact.
- Validate that the latest backup includes `User` and `Trade` row growth.
- Confirm Vercel environment variables are documented and recoverable.

## Monthly Restore Drill

1. Create an isolated restore database.
2. Restore latest backup into isolated DB.
3. Run sanity queries:
   - User count
   - Trade count
   - Date distribution for trades
4. Start app with restored `DATABASE_URL` and validate:
   - Login works
   - Dashboard loads
   - Journal entry save works
5. Document restore duration (RTO) and data freshness gap (RPO).

## Incident Mode (Data Loss Suspected)

1. Freeze write traffic (temporary maintenance mode).
2. Snapshot current state before remediation.
3. Restore to point-in-time target.
4. Run post-restore verification checklist.
5. Re-open traffic and monitor error rates for 60 minutes.
