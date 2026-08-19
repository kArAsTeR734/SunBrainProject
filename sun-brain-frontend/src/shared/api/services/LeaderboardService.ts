import type { Leaderboard } from '@entities/leaderboard';
import { request } from '@shared/api';
import { api } from '@shared/api/config/api.config.ts';

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
