import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/api/services/UserService.ts';
import { userSlice } from '@/app/store/reducers/UserSlice.ts';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux.ts';
import { resolveAssetUrl } from '@shared/utils/resolveAssetUrl.ts';
import type { ProfileData } from './types.ts';

export const useAvatar = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.userReducer.user);
  const { setUser } = userSlice.actions;

  return useMutation({
    mutationFn: (file: File) => UserService.uploadAvatar(file),
    onSuccess: (data) => {
      const avatarUrl = resolveAssetUrl(data.avatarUrl);

      if (currentUser) {
        dispatch(setUser({ ...currentUser, avatarUrl }));
      }

      queryClient.setQueryData<ProfileData | undefined>(['userInfo'], (cachedData) => {
        if (!cachedData?.user) {
          return cachedData;
        }

        return {
          ...cachedData,
          user: {
            ...cachedData.user,
            avatarUrl,
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });
};
