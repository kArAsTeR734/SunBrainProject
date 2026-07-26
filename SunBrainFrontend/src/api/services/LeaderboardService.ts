import { request } from '@shared/api';
import { api } from '@/api/config/api.config.ts';
import type { Leaderboard } from '@entities/Leaderboard';

export class LeaderboardService {
  public static async getProfileLeaderboard(userId: number): Promise<Leaderboard> {
    return request(
      api.get(`/api/leaderboard/profile-leaderboard`, {
        data: {
          userId,
        },
      }),
    );
  }
}
