import AvatarService from "../services/avatar-service.js";
import fs from 'fs';

export class AvatarController {
  static async uploadAvatar(req, res, next) {
    try {
      const userId = req.userId
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'Файл не загружен' });
      }
      const result = await AvatarService.uploadAvatar(userId, file);

      res.json({
        status: 'success',
        data: {
          avatarUrl: result.fileInfo.avatarUrl
        }
      });
    } catch (e) {
      if (req.file?.path) {
        await fs.promises.unlink(req.file.path).catch(() => {});
      }

      next(e);
    }
  }
}
