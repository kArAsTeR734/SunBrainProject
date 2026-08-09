import { userActions } from '@entities/User';
import { useAppDispatch } from '@shared/lib';
import { resolveAssetUrl } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';

import { UserService } from '@/api/services/UserService.ts';

export const useUserInfo = () => {
  const { setUser } = userActions;
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      try {
        const userData = await UserService.getUserInfo();
        if (userData?.user?.avatarUrl) {
          userData.user.avatarUrl = resolveAssetUrl(userData.user.avatarUrl);
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
