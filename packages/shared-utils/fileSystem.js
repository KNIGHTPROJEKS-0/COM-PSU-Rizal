// Electron-specific file system utilities
const fs = require('fs').promises;
const path = require('path');
const { dialog } = require('electron');

class ElectronFileSystem {
  async readFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }

  async writeFile(filePath, content) {
    try {
      await fs.writeFile(filePath, content, 'utf8');
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  }

  async selectDirectory() {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    return result.filePaths[0];
  }

  async selectFile(filters = []) {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters
    });
    return result.filePaths[0];
  }

  async saveFile(content, defaultPath = '', filters = []) {
    const result = await dialog.showSaveDialog({
      defaultPath,
      filters
    });

    if (!result.canceled) {
      await this.writeFile(result.filePath, content);
      return result.filePath;
    }
    return null;
  }
}

module.exports = { ElectronFileSystem };