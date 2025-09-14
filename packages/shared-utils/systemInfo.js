// Electron-specific system information utilities
const os = require('os');
const { app } = require('electron');

class SystemInfo {
  getPlatform() {
    return process.platform;
  }

  getArch() {
    return process.arch;
  }

  getVersion() {
    return app.getVersion();
  }

  getSystemInfo() {
    return {
      platform: this.getPlatform(),
      arch: this.getArch(),
      version: this.getVersion(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
      userInfo: os.userInfo()
    };
  }

  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  isProduction() {
    return !this.isDevelopment();
  }

  getAppDataPath() {
    return app.getPath('appData');
  }

  getUserDataPath() {
    return app.getPath('userData');
  }

  getDocumentsPath() {
    return app.getPath('documents');
  }

  getDownloadsPath() {
    return app.getPath('downloads');
  }
}

module.exports = { SystemInfo };