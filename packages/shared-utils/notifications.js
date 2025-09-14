// Electron-specific notification utilities
const { Notification } = require('electron');

class ElectronNotifications {
  show(title, body, options = {}) {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title,
        body,
        ...options
      });

      notification.show();
      return notification;
    } else {
      console.log('Notifications not supported on this platform');
      return null;
    }
  }

  showSuccess(title, body) {
    return this.show(title, body, {
      icon: path.join(__dirname, '../assets/success.png')
    });
  }

  showError(title, body) {
    return this.show(title, body, {
      icon: path.join(__dirname, '../assets/error.png')
    });
  }

  showInfo(title, body) {
    return this.show(title, body, {
      icon: path.join(__dirname, '../assets/info.png')
    });
  }

  showWarning(title, body) {
    return this.show(title, body, {
      icon: path.join(__dirname, '../assets/warning.png')
    });
  }
}

module.exports = { ElectronNotifications };