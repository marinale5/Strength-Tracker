-- Insert common exercises for the app
INSERT INTO exercises (name, muscle_group, equipment, description) VALUES
-- Chest
('Bench Press', 'Chest', 'Barbell', 'Classic chest exercise'),
('Dumbbell Press', 'Chest', 'Dumbbells', 'Chest press with dumbbells'),
('Incline Press', 'Chest', 'Barbell', 'Incline chest press'),
('Push Ups', 'Chest', 'Bodyweight', 'Classic push ups'),
('Cable Fly', 'Chest', 'Cable Machine', 'Chest fly on cable machine'),

-- Back
('Deadlift', 'Back', 'Barbell', 'Compound back exercise'),
('Barbell Row', 'Back', 'Barbell', 'Bent over row'),
('Pull Ups', 'Back', 'Pull Up Bar', 'Pull ups'),
('Lat Pulldown', 'Back', 'Cable Machine', 'Lat pulldown'),

-- Legs
('Squat', 'Legs', 'Barbell', 'Compound leg exercise'),
('Leg Press', 'Legs', 'Machine', 'Leg press machine'),
('Leg Curl', 'Legs', 'Machine', 'Hamstring curl'),
('Leg Extension', 'Legs', 'Machine', 'Quadriceps extension'),

-- Shoulders
('Shoulder Press', 'Shoulders', 'Barbell', 'Overhead press'),
('Lateral Raise', 'Shoulders', 'Dumbbells', 'Lateral shoulder raise'),
('Face Pull', 'Shoulders', 'Cable Machine', 'Rear delt face pull'),

-- Arms
('Barbell Curl', 'Arms', 'Barbell', 'Bicep curl'),
('Tricep Dips', 'Arms', 'Dip Station', 'Tricep dips'),
('Preacher Curl', 'Arms', 'Barbell', 'Preacher curl'),

-- Core
('Plank', 'Core', 'Bodyweight', 'Core plank'),
('Ab Wheel', 'Core', 'Ab Wheel', 'Ab wheel rollouts')
ON CONFLICT DO NOTHING;
