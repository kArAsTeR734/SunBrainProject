import { FC, PropsWithChildren } from 'react';

export const TaskList: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <section className="task-list">
        <div className="container">{children}</div>
      </section>
    </>
  );
};
