import HomeworkList from '@widgets/StudentHomework/ui/HomeworkList';

export const StudentHomework = () => {
  return (
    <>
      <section className="homework" aria-label="homework">
        <div className="container">
          <HomeworkList />
        </div>
      </section>
    </>
  );
};
