import { getPreferences, getAlerts, saveAlerts } from '../storage/index.js';

export function isWithinNotificationHours() {
  const prefs = getPreferences();
  if (!prefs?.notifications?.schedule) return true;
  
  const now = new Date();
  const hour = now.getHours();
  const { startHour, endHour } = prefs.notifications.schedule;
  
  return hour >= startHour && hour < endHour;
}

export function shouldNotify(prefs) {
  if (!prefs?.notifications?.enabled) return false;
  return isWithinNotificationHours();
}

export function formatAlert(alert) {
  const emoji = alert.type === 'price_drop' ? '💰' :
                alert.type === 'discount_increase' ? '🔥' :
                alert.type === 'discount_alert' ? '🔥' :
                alert.type === 'size_available' ? '✅' :
                alert.type === 'new_trending' ? '🆕' : '📦';
  
  return {
    text: `${emoji} ${alert.productName}\n${alert.message}\nLink: ${alert.productUrl}`,
    html: `<div style="padding:10px;border-left:4px solid #667eea;margin:10px 0;">
      <strong>${emoji} ${alert.productName}</strong><br>
      ${alert.message}<br>
      <a href="${alert.productUrl}">View Deal</a>
    </div>`
  };
}

export async function sendNotification(alert, channel = 'console') {
  if (!isWithinNotificationHours()) {
    console.log('Outside notification hours, skipping');
    return false;
  }

  const formatted = formatAlert(alert);
  
  switch (channel) {
    case 'console':
      console.log('\n--- Deal Alert ---');
      console.log(formatted.text);
      console.log('------------------\n');
      return true;

    case 'telegram':
      console.log('Telegram: Would send:', formatted.text);
      return true;

    case 'email':
      console.log('Email: Would send:', formatted.html);
      return true;

    default:
      console.log(`Unknown channel: ${channel}`);
      return false;
  }
}

export async function sendBatchNotifications(alerts, channel = 'console') {
  const results = [];
  for (const alert of alerts) {
    const sent = await sendNotification(alert, channel);
    results.push({ alert, sent });
  }
  return results;
}

export function getRecentAlerts(limit = 20) {
  const alerts = getAlerts();
  return alerts.slice(-limit).reverse();
}

export function clearOldAlerts(daysToKeep = 7) {
  const alerts = getAlerts();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);
  
  const filtered = alerts.filter(a => new Date(a.timestamp) > cutoff);
  saveAlerts(filtered);
  return filtered;
}

export function getAlertsByProduct(productId) {
  return getAlerts().filter(a => a.productId === productId);
}
