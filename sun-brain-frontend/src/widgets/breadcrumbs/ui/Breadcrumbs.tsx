import { getSubjectTitle } from '@entities/catalog';
import { useHomeworkTasks } from '@features/homework-tasks';
import { useTopics } from '@features/topics';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PATHS } from '@shared/routes';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import styles from './Breadcrumbs.module.scss';

export const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const { subjectId, themeId, homeworkId } = useParams();

  const { data: homework } = useHomeworkTasks(Number(homeworkId));
  const { data: topics } = useTopics(subjectId || (homework?.topic?.code ?? ''));

  const activeSubjectId = subjectId || homework?.topic.code;
  const crumbs = [];

  crumbs.push({ label: 'Личный кабинет', href: PATHS.STUDENT.ACCOUNT });

  if (pathname.includes('/catalog')) {
    crumbs.push({ label: 'Каталог задач', href: PATHS.STUDENT.CATALOG });
  }

  if (pathname.includes('/calendar')) {
    crumbs.push({ label: 'Календарь', href: PATHS.STUDENT.CALENDAR });
  }

  if (pathname.includes('/homework')) {
    crumbs.push({ label: 'Домашнее задание', href: PATHS.STUDENT.HOMEWORK });
  }

  if (activeSubjectId) {
    crumbs.push({
      label: getSubjectTitle(activeSubjectId),
      href: PATHS.STUDENT.SUBJECT(activeSubjectId),
    });
  }

  const currentTopic = topics?.find(
    (t) => String(t.number) === themeId || t.id === homework?.topic.id,
  );
  if (currentTopic) {
    crumbs.push({ label: currentTopic.name, href: pathname });
  }

  return (
    <section className={styles.breadcrumbs}>
      <nav className={styles.links}>
        {crumbs.map((link, index) => (
          <React.Fragment key={link.href}>
            <Link className={styles.link} to={link.href}>
              {link.label}
            </Link>

            {index < crumbs.length - 1 && (
              <ArrowForwardIcon className={styles.separator} />
            )}
          </React.Fragment>
        ))}
      </nav>
    </section>
  );
};
