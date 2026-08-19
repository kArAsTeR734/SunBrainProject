export function formatHomeworksDeadline(deadline: string): string {
  const date = new Date(deadline);
  const dateLabel = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  return dateLabel;
}

export function formatCalendarDeadline(deadline: string): string {
  const date = new Date(deadline);

  const dateLabel = date
    .toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    })
    .replace('.', '');

  return dateLabel;
}
