-- Add streak-related columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_workout_date DATE;

-- Personal Records table
CREATE TABLE IF NOT EXISTS personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_name VARCHAR(255) NOT NULL,
  best_weight DECIMAL(8, 2),
  best_rep_count INTEGER,
  best_rep_weight DECIMAL(8, 2), -- weight used for best_rep_count
  max_tonnage DECIMAL(12, 2),
  estimated_one_rep_max DECIMAL(8, 2),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exercise_name)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon_url VARCHAR(500),
  category VARCHAR(50), -- consistency, strength, social, secret
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Achievements join table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Seed initial achievements
INSERT INTO achievements (name, description, category, points_awarded) VALUES
('First Workout', 'Logged your first exercise!', 'consistency', 10),
('Early Bird', 'Completed a workout before 7 AM.', 'secret', 25),
('Night Owl', 'Completed a workout after 10 PM.', 'secret', 25),
('Week Warrior', 'Logged workouts 5 days in a week.', 'consistency', 50),
('Consistency King', 'Maintained a 7-day streak.', 'consistency', 100),
('Plate Power', 'Bench pressed over 225 lbs.', 'strength', 50),
('Volume King', 'Lifted over 10,000 lbs in a single workout.', 'strength', 100)
ON CONFLICT (name) DO NOTHING;
