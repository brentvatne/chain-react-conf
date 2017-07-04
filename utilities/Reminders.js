import { Permissions, Notifications } from 'expo';
import { format } from 'date-fns';
import Store from '../state/Store';

const DEBUG_REMINDERS = false;
const TIME_BEFORE_REMINDER = 10 * 60 * 1000;

async function _maybeRequestPermissionsAsync() {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  return status === 'granted';
}

async function scheduleAsync(timeString, title) {
  // throw an error or something if it doesn't work
  await _maybeRequestPermissionsAsync();
  const message = `${title} begins at ${format(timeString, 'h:mmA')}.`;
  const time = DEBUG_REMINDERS
    ? new Date().getTime() + 5000
    : new Date(timeString).getTime() - TIME_BEFORE_REMINDER;

  const notificationId = Notifications.scheduleLocalNotificationAsync(
    {
      title: 'Reminder!',
      body: message,
      ios: {
        sound: true,
      },
      android: {
        sound: true,
      },
    },
    {
      time,
    }
  );

  Store.dispatch({ type: 'SET_REMINDER', data: { notificationId } });
}

async function cancelAsync(notificationId) {
  Store.dispatch({ type: 'REMOVE_REMINDER', data: { notificationId } });
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export default {
  scheduleAsync,
  cancelAsync,
};
