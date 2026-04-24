import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/api/services/UserService.ts';
import { userSlice } from '@app/store/reducers/UserSlice.ts';
import { useAppDispatch } from '@shared/hooks/redux.ts';

export const useUserInfo = () => {
  const { setUser } = userSlice.actions;
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      try {
        const userData = await UserService.getUserInfo();
        if (userData?.user?.avatarUrl) {
          let avatarUrl = userData.user.avatarUrl;
          if (avatarUrl.startsWith('/uploads/')) {
            userData.user.avatarUrl = `http://localhost:5000${avatarUrl}`;
          }
        }
        const user = userData.user;
        dispatch(setUser(user));
        return {
          user,
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error('Ошибка получения информации о пользователе:', error);
          throw error;
        }
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!localStorage.getItem('access_token'),
    select: (data) => data?.user ?? null,
  });
};
