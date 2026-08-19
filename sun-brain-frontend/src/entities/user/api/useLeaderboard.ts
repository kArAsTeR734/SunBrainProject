import { LeaderboardService } from '@shared/api/services/LeaderboardService.ts';
import { useQuery } from '@tanstack/react-query';

export const useLeaderboard = (userId: number) => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      try {
        const leaderboard = await LeaderboardService.getProfileLeaderboard(userId);

        if (!leaderboard) {
          return null;
        }

        return leaderboard;
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          return null;
        }
      }
    },
  });
};
