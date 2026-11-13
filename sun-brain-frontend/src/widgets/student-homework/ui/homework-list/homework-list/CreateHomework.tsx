import { useTopics } from '@features/topics';
import { api, request } from '@shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FormEvent, useEffect, useRef, useState } from 'react';

import styles from './CreateHomework.module.scss';

export const CreateHomework = () => {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [exam, setExam] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [count, setCount] = useState('5');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const code = exam && subject ? `${exam}${subject}` : '';
  const topics = useTopics(code);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => request(api.post('/api/homework', { title, subjectCode: code, topicId: Number(topic), count: Number(count), deadline: new Date(`${date}T${time}`).toISOString() })),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['homeworks'] });
      dialog.current?.close();
      setTitle(''); setExam(''); setSubject(''); setTopic(''); setCount('5'); setDate(''); setTime(''); setError('');
    },
    onError: (err) => setError(axios.isAxiosError(err) ? err.response?.data?.message || 'Не удалось создать домашнее задание.' : 'Не удалось создать домашнее задание.'),
  });
  useEffect(() => {
    const element = dialog.current;
    const onClose = () => trigger.current?.focus();
    element?.addEventListener('close', onClose);
    return () => element?.removeEventListener('close', onClose);
  }, []);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !code || !topic || !date || !time || new Date(`${date}T${time}`).getTime() <= Date.now() || !Number.isInteger(Number(count)) || Number(count) < 5 || Number(count) > 30) {
      setError('Проверьте поля: укажите тему, название, от 5 до 30 задач и будущий дедлайн.'); return;
    }
    setError(''); mutation.mutate();
  };
  return <>
    <button ref={trigger} type="button" onClick={() => dialog.current?.showModal()}>Создать домашнее задание</button>
    <dialog ref={dialog} className={styles.dialog} onClick={(event) => { if (event.target === dialog.current && !mutation.isPending) dialog.current?.close(); }} onCancel={(event) => { if (mutation.isPending) event.preventDefault(); }}>
      <form onSubmit={submit} className={styles.form}>
        <h2>Создать домашнее задание</h2>
        <label>Название<input autoFocus maxLength={255} required value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Формат экзамена<select required value={exam} onChange={(e) => { setExam(e.target.value); setTopic(''); }}><option value="">Выберите формат</option><option value="e">ЕГЭ</option><option value="o">ОГЭ</option></select></label>
        <label>Предмет<select required value={subject} onChange={(e) => { setSubject(e.target.value); setTopic(''); }}><option value="">Выберите предмет</option><option value="math">Математика</option><option value="physic">Физика</option></select></label>
        {code && topics.isLoading && <p role="status">Загружаем темы...</p>}
        {code && topics.isError && <p role="alert">Не удалось загрузить темы. <button type="button" onClick={() => void topics.refetch()}>Повторить</button></p>}
        {code && !topics.isLoading && !topics.isError && !topics.data?.length && <p>Темы пока отсутствуют.</p>}
        <label>Тема<select required value={topic} disabled={!topics.data?.length} onChange={(e) => setTopic(e.target.value)}><option value="">Выберите тему</option>{topics.data?.map((item) => <option key={item.id} value={item.id}>{item.number}. {item.name}</option>)}</select></label>
        <label>Количество задач<input type="number" required min="5" max="30" step="1" value={count} onChange={(e) => setCount(e.target.value)} /></label>
        <label>Дата дедлайна<input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label>Время дедлайна<input type="time" required value={time} onChange={(e) => setTime(e.target.value)} /></label>
        {error && <p role="alert">{error}</p>}
        <div><button type="submit" disabled={mutation.isPending}>Создать</button> <button type="button" disabled={mutation.isPending} onClick={() => dialog.current?.close()}>Отмена</button></div>
      </form>
    </dialog>
  </>;
};
