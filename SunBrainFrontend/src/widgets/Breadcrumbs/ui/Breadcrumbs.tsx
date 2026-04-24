import { useHomeworkTasks } from '@features/HomeworkTasks/model/useHomeworkTasks.ts';
import { useLocation, useParams } from 'react-router-dom';
import getSubjectTitle from '@shared/utils/getSubjectTitle.ts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React from 'react';
import './Breadcrumbs.scss';
import { PATHS } from '@app/providers/routes/config.tsx';
import { useTopics } from '@features/Topics/models/hooks/useTopics.ts';
import { Link } from 'react-router-dom';

export const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const { subjectId, themeId, homeworkId } = useParams();

  const { data: homework } = useHomeworkTasks(Number(homeworkId));
  const { data: topics } = useTopics(
    subjectId || (homework?.topic?.code ?? ''),
  );

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
    <section className="breadcrumbs">
      <nav className="breadcrumbs__links">
        {crumbs.map((link, index) => (
          <React.Fragment key={link.href}>
            <Link className="breadcrumbs__link" to={link.href}>
              {link.label}
            </Link>

            {index < crumbs.length - 1 && (
              <ArrowForwardIcon className="breadcrumbs__separator" />
            )}
          </React.Fragment>
        ))}
      </nav>
    </section>
  );
};
