import HomeworkService from "../services/homework-service.js";
import TaskService from "../services/task-service.js";
import { errorResponse, successResponse } from "../utils/ApiError.js";
import pool from '../../db.js';

class HomeworkController {
  static async createHomework(req, res) {
    const { title, subjectCode, topicId, count, deadline } = req.body;
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 255 ||
      !['emath', 'omath', 'ephysic', 'ophysic'].includes(subjectCode) ||
      !Number.isInteger(topicId) || !Number.isInteger(count) || count < 5 || count > 30 ||
      typeof deadline !== 'string' || !Number.isFinite(Date.parse(deadline)) || Date.parse(deadline) <= Date.now()) {
      return res.status(400).json(errorResponse('Проверьте заполнение формы.'));
    }
    try {
      const result = await pool.query(`
        WITH selected AS MATERIALIZED (
          SELECT t.id FROM tasks t JOIN topics tp ON tp.id = t.topic_id
          JOIN subjects s ON s.code = tp.subject_code
          WHERE tp.id = $1 AND s.code = $2 AND t.exam_type = $3
          ORDER BY t.id LIMIT $4
        ), homework AS (
          INSERT INTO homeworks (title, subject_id, topic_id, deadline)
          SELECT $5, s.id, $1, $6::timestamptz AT TIME ZONE 'UTC'
          FROM subjects s JOIN catalog_topics c ON c.subject_code = s.code AND c.topic_id = $1
          WHERE s.code = $2 AND (SELECT count(*) FROM selected) = $4
          RETURNING id
        ), assignment AS (
          INSERT INTO homework_assignments (homework_id, user_id)
          SELECT id, $7 FROM homework RETURNING homework_id
        ), homework_items AS (
          INSERT INTO homework_tasks (homework_id, task_id, order_index)
          SELECT homework.id, selected.id, row_number() OVER (ORDER BY selected.id)
          FROM homework CROSS JOIN selected RETURNING homework_id
        )
        SELECT id FROM homework`, [topicId, subjectCode, subjectCode.startsWith('e') ? 'ege' : 'oge', count, title.trim(), deadline, req.userId]);
      if (!result.rows.length) return res.status(400).json(errorResponse('Недостаточно заданий по выбранной теме или тема недоступна.'));
      return res.status(201).json(successResponse(result.rows[0]));
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorResponse('Не удалось создать домашнее задание.'));
    }
  }
  static async checkTaskAnswer(req, res) {
    try {
      const userId = req.userId;
      const { taskId } = req.params;
      const { answer } = req.body;

      if (typeof answer !== "string" || !answer.trim()) {
        return res.status(400).json(errorResponse("Answer is required"));
      }

      const result = await TaskService.checkTaskAnswer({
        userId,
        taskId,
        answer,
      });

      return res.status(200).json(successResponse(result));
    } catch (error) {
      console.error(error);

      let status = 500;
      let message = "Failed to check homework answer";

      if (error.message === "User is not authenticated") {
        status = 401;
        message = "User is not authenticated";
      } else if (error.message === "Answer is required") {
        status = 400;
        message = "Answer is required";
      } else if (error.message === "TestTask not found") {
        status = 404;
        message = "TestTask not found";
      }

      return res.status(status).json(errorResponse(message));
    }
  }

  static async getMyHomeworks(req, res) {
    try {
      const userId = req.userId;
      const data = await HomeworkService.getMyHomeworks(userId);

      return res.status(200).json(successResponse(data));
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json(errorResponse("Failed to get user homeworks"));
    }
  }

  static async getHomework(req, res) {
    try {
      const userId = req.userId;
      const homeworkId = Number(req.params.id);
      const data = await HomeworkService.getHomework(homeworkId, userId);

      return res.status(200).json(successResponse(data));
    } catch (error) {
      console.error(error);
      const status = error.message === "Homework not found" ? 404 : 500;
      const message =
        error.message === "Homework not found"
          ? "Homework not found"
          : "Failed to get homework";

      return res.status(status).json(errorResponse(message));
    }
  }
}

export default HomeworkController;
