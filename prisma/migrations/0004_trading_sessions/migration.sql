-- Expand SessionType: Sydney, Tokyo (replaces Asian), London, New York
CREATE TYPE "SessionType_new" AS ENUM ('SYDNEY', 'TOKYO', 'LONDON', 'NEW_YORK');

ALTER TABLE "Trade"
  ALTER COLUMN "session" TYPE "SessionType_new"
  USING (
    CASE "session"::text
      WHEN 'ASIAN' THEN 'TOKYO'::"SessionType_new"
      WHEN 'LONDON' THEN 'LONDON'::"SessionType_new"
      WHEN 'NEW_YORK' THEN 'NEW_YORK'::"SessionType_new"
      ELSE 'LONDON'::"SessionType_new"
    END
  );

DROP TYPE "SessionType";
ALTER TYPE "SessionType_new" RENAME TO "SessionType";
