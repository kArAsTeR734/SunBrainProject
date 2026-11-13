import { useTopics } from '@entities/topic';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@shared/ui';
import axios from 'axios';
import { useId } from 'react';
import { useForm } from 'react-hook-form';

import {
  type HomeworkFormInput,
  type HomeworkFormValues,
  homeworkSchema,
} from '../model/homeworkSchema';
import { useCreateHomework } from '../model/mutations/useCreateHomework';
import styles from './CreateHomework.module.scss';

interface Props {
  onClose: () => void;
  onPendingChange: (pending: boolean) => void;
}

export const HomeworkForm = ({ onClose, onPendingChange }: Props) => {
  const id = useId();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<HomeworkFormInput, unknown, HomeworkFormValues>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      title: '',
      exam: '',
      subject: '',
      topic: '',
      count: '5',
      date: '',
      time: '',
    },
  });
  const [exam, subject] = watch(['exam', 'subject']);
  const code = exam && subject ? `${exam}${subject}` : '';
  const topics = useTopics(code);
  const mutation = useCreateHomework({ onClose, onPendingChange });
  const serverError = axios.isAxiosError(mutation.error)
    ? mutation.error.response?.data?.message
    : undefined;
  const examField = register('exam');
  const subjectField = register('subject');
  const dateField = register('date');
  const timeField = register('time');
  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <header className={styles.header}>
        <h2>Новое домашнее задание</h2>
        <p>Выберите тему и запланируйте практику.</p>
      </header>
      <Input
        id={`${id}-title`}
        label="Название"
        autoFocus
        maxLength={255}
        placeholder="Например, подготовка к контрольной"
        {...register('title')}
        error={errors.title?.message}
        className={styles.inputField}
      />
      <label>
        Формат экзамена
        <select
          {...examField}
          onChange={(e) => {
            void examField.onChange(e);
            setValue('topic', '');
            void trigger('exam');
          }}
          aria-invalid={!!errors.exam}
          aria-describedby={errors.exam ? `${id}-exam-error` : undefined}
        >
          <option value="">Выберите формат</option>
          <option value="e">ЕГЭ</option>
          <option value="o">ОГЭ</option>
        </select>
        {errors.exam && (
          <span id={`${id}-exam-error`} role="alert">
            {errors.exam.message}
          </span>
        )}
      </label>
      <label>
        Предмет
        <select
          {...subjectField}
          onChange={(e) => {
            void subjectField.onChange(e);
            setValue('topic', '');
            void trigger('subject');
          }}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? `${id}-subject-error` : undefined}
        >
          <option value="">Выберите предмет</option>
          <option value="math">Математика</option>
          <option value="physic">Физика</option>
        </select>
        {errors.subject && (
          <span id={`${id}-subject-error`} role="alert">
            {errors.subject.message}
          </span>
        )}
      </label>
      {code && topics.isLoading && <p role="status">Загружаем темы...</p>}
      {code && topics.isError && (
        <p role="alert">
          Не удалось загрузить темы.{' '}
          <Button type="button" onClick={() => void topics.refetch()}>
            Повторить
          </Button>
        </p>
      )}
      {code && !topics.isLoading && !topics.isError && !topics.data?.length && (
        <p>Темы пока отсутствуют.</p>
      )}
      <label>
        Тема
        <select
          {...register('topic')}
          onFocus={() => {
            if (!code) void trigger(['exam', 'subject']);
          }}
          aria-invalid={!!errors.topic}
          aria-describedby={
            [!code && `${id}-topic-hint`, errors.topic && `${id}-topic-error`]
              .filter(Boolean)
              .join(' ') || undefined
          }
        >
          <option value="">
            {code ? 'Выберите тему' : 'Сначала выберите формат и предмет'}
          </option>
          {topics.data?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.number}. {item.name}
            </option>
          ))}
        </select>
        {!code && (
          <span id={`${id}-topic-hint`} className={styles.fieldHint}>
            Темы появятся после выбора формата экзамена и предмета.
          </span>
        )}
        {errors.topic && (
          <span id={`${id}-topic-error`} role="alert">
            {errors.topic.message}
          </span>
        )}
      </label>
      <div className={styles.row}>
        <Input
          id={`${id}-count`}
          label="Количество задач"
          type="number"
          min="5"
          max="30"
          step="1"
          {...register('count')}
          error={errors.count?.message}
          className={styles.inputField}
        />
        <p className={styles.hint}>От 5 до 30 задач из выбранной темы.</p>
      </div>
      <div className={styles.row}>
        <Input
          id={`${id}-date`}
          label="Дата дедлайна"
          type="date"
          {...dateField}
          onChange={async (event) => {
            await dateField.onChange(event);
            await trigger(['date', 'time']);
          }}
          error={errors.date?.message}
          className={styles.inputField}
        />
        <Input
          id={`${id}-time`}
          label="Время дедлайна"
          type="time"
          {...timeField}
          onChange={async (event) => {
            await timeField.onChange(event);
            await trigger(['date', 'time']);
          }}
          error={errors.time?.message}
          className={styles.inputField}
        />
      </div>
      {mutation.isError && (
        <p role="alert">{serverError || 'Не удалось создать домашнее задание.'}</p>
      )}
      <div className={styles.actions}>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Создаём…' : 'Создать домашнее задание'}
        </Button>
        <Button
          type="button"
          variant="haveAccount"
          disabled={mutation.isPending}
          onClick={onClose}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
};
