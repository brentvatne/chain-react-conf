import { compose, applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import * as ReduxPersistConstants from 'redux-persist/constants';
import { AsyncStorage } from 'react-native';
import { find, without } from 'lodash';

const reducer = (state, action) => {
  const { type } = action;

  if (type === ReduxPersistConstants.REHYDRATE) {
    if (persistedStateIsInvalid(action.payload)) {
      return getInitialState();
    } else {
      return action.payload;
    }
  } else if (type === 'SET_REMINDER') {
    return addReminder(state, action.data);
  } else if (type === 'REMOVE_REMINDER') {
    return removeReminder(state, action.data.notificationId);
  } else {
    return state;
  }
};

const getInitialState = () => {
  return {
    reminders: [],
  };
};

function addReminder(state, { time, notificationId }) {
  return {
    ...state,
    reminders: [...state.reminders, { time, notificationId }],
  };
}

function removeReminder(state, notificationId) {
  let reminder = find(
    state.reminders,
    reminder => reminder.notificationId === notificationId
  );

  return {
    ...state,
    reminders: without(state.reminders, reminder),
  };
}

function persistedStateIsInvalid(state) {
  return Object.keys(state).length === 0;
}

const Store = createStore(
  reducer,
  getInitialState(),
  compose(applyMiddleware(), autoRehydrate())
);

Store.rehydrateAsync = () => {
  return new Promise(resolve => {
    persistStore(Store, { storage: AsyncStorage }, () => {
      resolve();
    });
  });
};

export default Store;
