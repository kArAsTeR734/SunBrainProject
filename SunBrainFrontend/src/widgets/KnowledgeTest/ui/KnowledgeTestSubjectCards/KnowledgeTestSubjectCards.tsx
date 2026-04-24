import { Card } from '@shared/ui';
import { KNOWLEDGE_TEST_SUBJECTS } from '@features/Test/models/knowledgeTestConfig.ts';
import { PATHS } from '@app/providers/routes/config.tsx';
import './KnowledgeTestSubjectCards.scss';

export const KnowledgeTestSubjectCards = () => {
  return (
    <section className="knowledge-test-subjects">
      <h1 className="knowledge-test-subjects__title">
        Выберите предмет для тестирования
      </h1>
      <p className="knowledge-test-subjects__subtitle">
        Для каждого номера экзамена будут доступны 3 задания разного уровня
        сложности.
      </p>

      <div className="knowledge-test-subjects__grid">
        {KNOWLEDGE_TEST_SUBJECTS.map((subject) => (
          <div className="knowledge-test-subjects__item" key={subject.id}>
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
