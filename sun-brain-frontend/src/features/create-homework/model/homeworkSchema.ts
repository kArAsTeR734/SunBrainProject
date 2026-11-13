import { z } from 'zod';

export const homeworkSchema = z
  .object({
    title: z.string().trim().min(1, 'Введите название').max(255, 'Не более 255 символов'),
    exam: z.string().refine((v) => v === 'e' || v === 'o', 'Выберите формат экзамена'),
    subject: z.string().refine((v) => v === 'math' || v === 'physic', 'Выберите предмет'),
    topic: z.string().regex(/^[1-9]\d*$/, 'Выберите тему'),
    count: z
      .string()
      .regex(/^\d+$/, 'Введите целое число')
      .refine((v) => Number(v) >= 5 && Number(v) <= 30, 'Укажите от 5 до 30 задач'),
    date: z.string().min(1, 'Укажите дату'),
    time: z.string().min(1, 'Укажите время'),
  })
  .refine(
    ({ date, time }) => {
      if (!date || !time) return true;
      const deadline = new Date(`${date}T${time}`).getTime();
      return Number.isFinite(deadline) && deadline > Date.now();
    },
    { path: ['date'], message: 'Укажите будущий дедлайн' },
  );

export type HomeworkFormValues = z.infer<typeof homeworkSchema>;

export type HomeworkFormInput = z.input<typeof homeworkSchema>;
