import { Constants, Permissions, Notifications } from 'expo';
import { format } from 'date-fns';
import Store from '../state/Store';

const DEBUG_REMINDERS = false;
const TIME_BEFORE_REMINDER = 10 * 60 * 1000;

async function _maybeRequestPermissionsAsync() {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  if (Constants.isDevice) {
    return status === 'granted';
  } else {
    return status === 'granted' || status === 'undetermined';
  }
}

async function scheduleAsync(timeString, title) {
  if (!await _maybeRequestPermissionsAsync()) {
    throw new Error('No permissions for notifications');
  }

  const message = `${title} begins at ${format(timeString, 'h:mmA')}.`;
  const time = DEBUG_REMINDERS
    ? new Date().getTime() + 5000
    : new Date(timeString).getTime() - TIME_BEFORE_REMINDER;

  const notificationId = await Notifications.scheduleLocalNotificationAsync(
    {
      title: 'Reminder!',
      body: message,
      data: { title, timeString },
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

  Store.dispatch({
    type: 'SET_REMINDER',
    data: { time: timeString, notificationId },
  });
}

async function cancelAsync(notificationId) {
  Store.dispatch({ type: 'REMOVE_REMINDER', data: { notificationId } });
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export default {
  scheduleAsync,
  cancelAsync,
};
