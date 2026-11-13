import { Button, Dialog } from '@shared/ui';
import { useState } from 'react';

import styles from './CreateHomework.module.scss';
import { HomeworkForm } from './HomeworkForm';

export const CreateHomework = () => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const close = () => {
    setOpen(false);
  };

  return (
    <>
      <Button className={styles.trigger} type="button" onClick={() => setOpen(true)}>
        Создать домашнее задание
      </Button>
      <Dialog
        open={open}
        onClose={close}
        title="Создать домашнее задание"
        closeDisabled={pending}
      >
        {open && <HomeworkForm onClose={close} onPendingChange={setPending} />}
      </Dialog>
    </>
  );
};
