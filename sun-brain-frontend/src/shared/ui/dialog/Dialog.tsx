import { ReactNode, useEffect, useRef } from 'react';

import styles from './Dialog.module.scss';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  closeDisabled?: boolean;
}

export const Dialog = ({
  open,
  onClose,
  children,
  title,
  closeDisabled = false,
}: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        if (!closeDisabled) onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current && !closeDisabled) onClose();
      }}
    >
      {children}
    </dialog>
  );
};
