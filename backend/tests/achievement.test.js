const Achievement = require('../src/models/Achievement');
const pool = require('../src/config/database');

jest.mock('../src/config/database');

describe('Achievement Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAndAward', () => {
    it('should award First Workout achievement', async () => {
      const userId = 'user-1';
      const workout = { exercise_name: 'Squat', weight: 100, sets: 3, reps: 10 };
      const stats = { workout_count: 1, current_streak: 1 };

      pool.query.mockResolvedValueOnce({ rows: [{ id: 'ach-1', name: 'First Workout', points_awarded: 10 }] }); // SELECT achievement
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'ua-1' }] }); // INSERT user_achievement
      pool.query.mockResolvedValueOnce({ rows: [] }); // UPDATE users points

      const achievements = await Achievement.checkAndAward(userId, workout, stats);

      expect(achievements).toHaveLength(1);
      expect(achievements[0].name).toBe('First Workout');
    });

    it('should award Plate Power for heavy bench press', async () => {
      const userId = 'user-1';
      const workout = { exercise_name: 'Bench Press', weight: 225, sets: 1, reps: 1 };
      const stats = { workout_count: 5, current_streak: 1 };

      pool.query.mockResolvedValueOnce({ rows: [{ id: 'ach-2', name: 'Plate Power', points_awarded: 50 }] }); // SELECT achievement
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'ua-2' }] }); // INSERT user_achievement
      pool.query.mockResolvedValueOnce({ rows: [] }); // UPDATE users points

      const achievements = await Achievement.checkAndAward(userId, workout, stats);

      expect(achievements).toContainEqual(expect.objectContaining({ name: 'Plate Power' }));
    });
  });
});
