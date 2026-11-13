import { FC, PropsWithChildren } from 'react';

import styles from './TaskList.module.scss';

export const TaskList: FC<PropsWithChildren> = ({ children }) => {
  return <section className={styles.taskList}>{children}</section>;
};
