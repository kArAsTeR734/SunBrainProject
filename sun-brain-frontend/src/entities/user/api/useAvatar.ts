import { UserService } from '@shared/api/services/UserService.ts';
import { resolveAssetUrl } from '@shared/lib';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ProfileData } from '../model/types.ts';
import { userActions } from '../model/userSlice.ts';

export const useAvatar = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.userReducer.user);
  const { setUser } = userActions;

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
