import api from './api';

class PushService {
  constructor() {
    this.subscription = null;
    this.registration = null;
  }

  async init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');

      // Check for existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();

      if (this.subscription) {
        console.log('Existing subscription found');
        return true;
      }

      // Get VAPID public key
      const response = await api.get('/push/vapid-public-key');
      const vapidPublicKey = response.data.publicKey;

      // Convert base64 to Uint8Array
      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

      // Subscribe to push notifications
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      console.log('Push notification subscribed');
      return true;
    } catch (error) {
      console.error('Push notification init error:', error);
      return false;
    }
  }

  async sendSubscriptionToServer(subscription) {
    try {
      await api.post('/push/subscribe', { subscription });
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  }

  async unsubscribe() {
    if (!this.subscription) {
      return;
    }

    try {
      await this.subscription.unsubscribe();
      await api.post('/push/unsubscribe');
      this.subscription = null;
      console.log('Push notification unsubscribed');
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  getSubscription() {
    return this.subscription;
  }
}

const pushService = new PushService();

export default pushService;
