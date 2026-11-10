import { resolveAssetUrl } from '@shared/lib';
import { useAppDispatch } from '@shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ProfileData } from '../model/types.ts';
import { userActions } from '../model/userSlice.ts';
import { useUserState } from '../model/useUserState';
import { UserService } from './UserService';

export const useAvatar = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const currentUser = useUserState().user;
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
