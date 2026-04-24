import { userSlice } from '@app/store/reducers/UserSlice.ts';
import { useAppDispatch } from '@shared/hooks/redux.ts';
import { useQuery } from '@tanstack/react-query';
import { LeaderboardService } from '@/api/services/LeaderboardService.ts';

export const useLeaderboard = (userId: number) => {
  const { setLeaderboard } = userSlice.actions;
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      try {
        const leaderboard =
          await LeaderboardService.getProfileLeaderboard(userId);

        if (!leaderboard) {
          return null;
        }

        dispatch(setLeaderboard(leaderboard));

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
