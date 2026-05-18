import io from 'socket.io-client';
import toast from 'react-hot-toast';

let socket = null;
let notificationHandlers = [];

class NotificationManager {
  constructor() {
    this.isConnected = false;
    this.userId = null;
    this.isPageVisible = true;
  }

  /**
   * Initialize socket connection and set up listeners
   */
  initSocket(userId, isPageVisible) {
    this.userId = userId;
    this.isPageVisible = isPageVisible;

    if (!socket) {
      socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      socket.on('connect', () => {
        console.log('Socket connected');
        this.isConnected = true;
        socket.emit('userOnline', userId);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.isConnected = false;
      });

      // Listen for task notifications
      socket.on('newTaskNotification', (data) => {
        this.handleNotification(data, 'task-assigned');
      });

      socket.on('taskStatusChanged', (data) => {
        this.handleNotification(data, 'task-updated');
      });

      socket.on('taskCompleted', (data) => {
        this.handleNotification(data, 'task-completed');
      });

      // Listen for general notifications
      socket.on('notification', (data) => {
        this.handleNotification(data, 'general');
      });
    }
  }

  /**
   * Handle notification and show based on visibility
   */
  handleNotification(data, type) {
    console.log('Notification received:', { data, type, pageVisible: this.isPageVisible });

    if (this.isPageVisible) {
      // Show toast if page is visible
      toast.success(data.message || data.title, {
        duration: 5000,
        position: 'top-right',
      });
    } else {
      // Already handled by service worker for push notifications
      console.log('Page not visible, notification will be handled by service worker');
    }

    // Call registered handlers
    notificationHandlers.forEach((handler) => {
      try {
        handler(data, type);
      } catch (error) {
        console.error('Error in notification handler:', error);
      }
    });
  }

  /**
   * Register a callback to handle notifications
   */
  onNotification(callback) {
    notificationHandlers.push(callback);
    return () => {
      notificationHandlers = notificationHandlers.filter((h) => h !== callback);
    };
  }

  /**
   * Update page visibility state
   */
  updatePageVisibility(isVisible) {
    this.isPageVisible = isVisible;
    
    // Notify socket about visibility change
    if (socket && this.isConnected) {
      socket.emit('userVisibility', { isVisible });
    }
  }

  /**
   * Send a notification event (for testing or internal use)
   */
  sendNotification(event, data) {
    if (socket && this.isConnected) {
      socket.emit(event, data);
    }
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      pageVisible: this.isPageVisible,
      userId: this.userId,
    };
  }
}

export default new NotificationManager();
