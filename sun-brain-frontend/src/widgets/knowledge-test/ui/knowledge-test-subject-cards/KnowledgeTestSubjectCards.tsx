import { KNOWLEDGE_TEST_SUBJECTS } from '@features/test';
import { PATHS } from '@shared/routes';
import { Card } from '@shared/ui';

import styles from './KnowledgeTestSubjectCards.module.scss';

export const KnowledgeTestSubjectCards = () => {
  return (
    <section className={styles.knowledgeTestSubjects}>
      <h1 className={styles.title}>
        Выберите предмет для тестирования
      </h1>
      <p className={styles.subtitle}>
        Для каждого номера экзамена будут доступны 3 задания разного уровня сложности.
      </p>

      <div className={styles.grid}>
        {KNOWLEDGE_TEST_SUBJECTS.map((subject) => (
          <div className={styles.item} key={subject.id}>
            <Card
              id={subject.id}
              fullPath={PATHS.TEST_SUBJECT(subject.id)}
              title={subject.title}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
