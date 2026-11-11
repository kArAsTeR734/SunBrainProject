import { useId, useState } from 'react';

import { ProfileDropdown } from '../profile-dropdown/ProfileDropdown';
import { ProfileTrigger } from '../profile-trigger/ProfileTrigger';

export const Profile = () => {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const menuId = useId();
  const triggerId = useId();

  return (
    <>
      <ProfileTrigger
        id={triggerId}
        menuId={menuId}
        isOpen={Boolean(anchor)}
        onClick={(event) => setAnchor(event.currentTarget)}
      />
      <ProfileDropdown
        anchor={anchor}
        id={menuId}
        triggerId={triggerId}
        onClose={() => setAnchor(null)}
      />
    </>
  );
};
