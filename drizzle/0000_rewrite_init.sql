CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "stats" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "level" integer NOT NULL DEFAULT 1,
  "xp" integer NOT NULL DEFAULT 0,
  "hp" integer NOT NULL DEFAULT 100,
  "strength" integer NOT NULL DEFAULT 10,
  "endurance" integer NOT NULL DEFAULT 10,
  "intelligence" integer NOT NULL DEFAULT 10,
  "wisdom" integer NOT NULL DEFAULT 10,
  "charisma" integer NOT NULL DEFAULT 10,
  "willpower" integer NOT NULL DEFAULT 10,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "quests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" varchar(255) NOT NULL,
  "description" text,
  "type" varchar(20) NOT NULL DEFAULT 'daily',
  "difficulty" varchar(20),
  "xp_reward" integer NOT NULL DEFAULT 0,
  "stats_affected" varchar(120),
  "hp_affected" integer,
  "completed" boolean NOT NULL DEFAULT false,
  "due_date" timestamptz,
  "completed_at" timestamptz,
  "xp_rewarded_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "habits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" varchar(255) NOT NULL,
  "description" text,
  "type" varchar(20) NOT NULL DEFAULT 'good',
  "xp_reward" integer NOT NULL DEFAULT 10,
  "stats_affected" varchar(120),
  "hp_affected" integer,
  "streak" integer NOT NULL DEFAULT 0,
  "last_completed_at" date,
  "xp_rewarded_on" date,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "achievements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" varchar(255) NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "condition" varchar(255) NOT NULL,
  "reward" varchar(255) NOT NULL DEFAULT '',
  "unlocked" boolean NOT NULL DEFAULT false,
  "unlocked_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("user_id", "name")
);

CREATE TABLE IF NOT EXISTS "status_effects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" varchar(255) NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "cause" varchar(255) NOT NULL DEFAULT '',
  "duration" varchar(40) NOT NULL DEFAULT '',
  "penalty" varchar(120) NOT NULL DEFAULT '',
  "is_active" boolean NOT NULL DEFAULT true,
  "applied_at" timestamptz NOT NULL DEFAULT now(),
  "expires_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "daily_check_ins" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "check_in_date" date NOT NULL,
  "daily_intention" varchar(255) NOT NULL,
  "if_then_plan" varchar(255),
  "craving_intensity" integer,
  "trigger_notes" text,
  "reflection" text,
  "slip_happened" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("user_id", "check_in_date")
);
