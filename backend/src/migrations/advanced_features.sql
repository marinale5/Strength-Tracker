-- Seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Seasonal Stats
CREATE TABLE IF NOT EXISTS user_seasonal_stats (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  rank INTEGER,
  PRIMARY KEY (user_id, season_id)
);

-- Groups (Private Communities)
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  invite_code VARCHAR(20) UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group Members
CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- owner, admin, member
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (group_id, user_id)
);

-- Kudos (Reactions)
CREATE TABLE IF NOT EXISTS kudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) DEFAULT '🔥',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workout_id, user_id, emoji)
);

-- Community Goals (Boss Battles)
CREATE TABLE IF NOT EXISTS community_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_value DECIMAL(15, 2) NOT NULL,
  current_value DECIMAL(15, 2) DEFAULT 0,
  metric VARCHAR(50) NOT NULL, -- lbs_lifted, workouts_completed, total_points
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout Templates (Routines)
CREATE TABLE IF NOT EXISTS workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Template Exercises
CREATE TABLE IF NOT EXISTS template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_name VARCHAR(255) NOT NULL,
  suggested_sets INTEGER,
  suggested_reps INTEGER,
  order_index INTEGER NOT NULL
);

-- Update users table for new preferences
ALTER TABLE users ADD COLUMN IF NOT EXISTS body_weight DECIMAL(6, 2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS weight_unit VARCHAR(10) DEFAULT 'lbs';
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme_preference VARCHAR(20) DEFAULT 'light';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_kudos_workout_id ON kudos(workout_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON workout_templates(user_id);
