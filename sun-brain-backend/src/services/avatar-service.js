import UserModel from '../models/user-model.js';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class AvatarService {
  static AVATAR_DIR = 'uploads/avatars';
  static ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  static MAX_SIZE = 5 * 1024 * 1024;

  static initUploadDir() {
    if (!fs.existsSync(this.AVATAR_DIR)) {
      fs.mkdirSync(this.AVATAR_DIR, { recursive: true });
    }
  }

  static validateFile(file) {
    if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
      throw new Error(`Неподдерживаемый тип файла. Допустимые: ${this.ALLOWED_TYPES.join(', ')}`);
    }

    if (file.size > this.MAX_SIZE) {
      throw new Error(`Файл слишком большой. Максимальный размер: ${this.MAX_SIZE / 1024 / 1024}MB`);
    }

    return true;
  }

  static generateFileName(originalName) {
    const ext = path.extname(originalName);
    const filename = `${uuidv4()}${ext}`;
    return filename;
  }

  static async saveFile(file) {
    this.initUploadDir();
    this.validateFile(file);

    const filename = this.generateFileName(file.originalname);
    const filepath = path.join(this.AVATAR_DIR, filename);

    if (file.path) {
      await this.moveFile(file.path, filepath);
    } else if (file.buffer) {
      await fs.promises.writeFile(filepath, file.buffer);
    } else {
      throw new Error('Р¤Р°Р№Р» РЅРµ СЃРѕРґРµСЂР¶РёС‚ РґР°РЅРЅС‹С… РґР»СЏ СЃРѕС…СЂР°РЅРµРЅРёСЏ');
    }

    const avatarUrl = `/uploads/avatars/${filename}`;

    return {
      filename,
      filepath,
      avatarUrl,
      mimetype: file.mimetype,
      size: file.size
    };
  }

  static async moveFile(source, target) {
    try {
      await fs.promises.rename(source, target);
    } catch (error) {
      if (error.code !== 'EXDEV') {
        throw error;
      }

      await fs.promises.copyFile(source, target);
      await fs.promises.unlink(source);
    }
  }

  static async deleteFile(filepath) {
    try {
      if (fs.existsSync(filepath)) {
        await fs.promises.unlink(filepath);
      }
    } catch (error) {
      console.error('РћС€РёР±РєР° РїСЂРё СѓРґР°Р»РµРЅРёРё С„Р°Р№Р»Р° Р°РІР°С‚Р°СЂРєРё:', error);
    }
  }

  static getAvatarFilename(avatarUrl) {
    if (!avatarUrl) {
      return null;
    }

    try {
      const parsedUrl = new URL(avatarUrl, 'http://localhost');

      if (!parsedUrl.pathname.startsWith('/uploads/avatars/')) {
        return null;
      }

      return path.basename(parsedUrl.pathname);
    } catch {
      return null;
    }
  }

  static async deleteOldAvatar(avatarUrl) {
    const filename = this.getAvatarFilename(avatarUrl);

    if (!filename) {
      return;
    }

    const filepath = path.join(this.AVATAR_DIR, filename);

    try {
      if (fs.existsSync(filepath)) {
        await fs.promises.unlink(filepath);
        console.log(`Удалён старый файл аватарки: ${filename}`);
      }
    } catch (error) {
      console.error('Ошибка при удалении старого файла аватарки:', error);
    }
  }

  static async uploadAvatar(userId, file) {
    const user = await UserModel.findById(userId);
    const fileInfo = await this.saveFile(file);

    let updatedUser;
    try {
      updatedUser = await UserModel.updateAvatar(userId, fileInfo.avatarUrl);
    } catch (error) {
      await this.deleteFile(fileInfo.filepath);
      throw error;
    }

    if (user?.avatar_url && user.avatar_url !== fileInfo.avatarUrl) {
      await this.deleteOldAvatar(user.avatar_url);
    }

    return {
      user: updatedUser,
      fileInfo
    };
  }

  static async getAvatar(userId) {
    const user = await UserModel.findById(userId);

    if (!user?.avatar_url) {
      return null;
    }

    const filename = path.basename(user.avatar_url);
    const filepath = path.join(this.AVATAR_DIR, filename);

    return {
      avatarUrl: user.avatar_url,
      filepath
    };
  }
}

export default AvatarService;
