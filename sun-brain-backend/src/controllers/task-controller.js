import TaskService from "../services/task-service.js";
import { successResponse, errorResponse } from "../utils/ApiError.js";

class TaskController {
  static async checkAnswer(req, res) {
    try {
      const userId = req.userId;
      const { taskId } = req.params;
      const { answer } = req.body;

      const result = await TaskService.checkTaskAnswer({
        userId,
        taskId,
        answer,
      });

      return res.status(200).json(successResponse(result));
    } catch (error) {
      console.error(error);

      let status = 500;
      let message = "Failed to check answer";

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

  static async getTask(req, res) {
    try {
      const { taskId } = req.params;

      const task = await TaskService.getTask(taskId);

      return res.status(200).json(successResponse(task));
    } catch (error) {
      console.log(error);

      let status = 500;
      let message = "Failed to get TestTask";

      if (error.message === "User is not authenticated") {
        status = 401;
        message = "User is not authenticated";
      } else if (error.message === "Answer is required") {
        status = 400;
        message = "TestTask id is required";
      } else if (error.message === "TestTask not found") {
        status = 404;
        message = "TestTask not found";
      }

      return res.status(status).json(errorResponse(message));
    }
  }

  static async getTaskList(req, res) {
    try {
      const { themeId } = req.params;

      const { cursor = '0', limit = '12' } = req.query;
      const isInteger = (value) => typeof value === 'string' && /^(0|[1-9]\d*)$/.test(value)
        && Number.isSafeInteger(Number(value)) && Number(value) <= 2147483647;
      if (!isInteger(themeId) || Number(themeId) === 0 || !isInteger(cursor)
        || !isInteger(limit) || Number(limit) < 1 || Number(limit) > 50) {
        return res.status(400).json(errorResponse("Некорректные параметры каталога"));
      }

      const tasks = await TaskService.getTasksByTopicId(Number(themeId), {
        cursor: Number(cursor), limit: Number(limit),
      });

      return res.status(200).json(successResponse(tasks));
    } catch (error) {
      console.log(error);

      let status = 500;
      let message = "Failed to get Tasks";

      if (error.message === "Tasks not found") {
        status = 404;
        message = "TestTask not found";
      }

      return res.status(status).json(errorResponse(message));
    }
  }
}

export default TaskController;
