import { request } from '@shared/api';
import { api } from '@shared/api';

import type { Leaderboard } from '../model/types';

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
