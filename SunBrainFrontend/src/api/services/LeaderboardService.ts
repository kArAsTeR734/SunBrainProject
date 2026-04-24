import { request } from '@shared/api/api-client.ts';
import { api } from '@/api/config/api.config.ts';
import { Leaderboard } from '@entities/Leaderboard/types.ts';

export class LeaderboardService {
  public static async getProfileLeaderboard(
    userId: number,
  ): Promise<Leaderboard> {
    return request(
      api.get(`/api/leaderboard/profile-leaderboard`, {
        data: {
          userId,
        },
      }),
    );
  }
}
