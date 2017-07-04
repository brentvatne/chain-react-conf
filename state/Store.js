import { compose, applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import * as ReduxPersistConstants from 'redux-persist/constants';
import { AsyncStorage } from 'react-native';

const reducer = (state, action) => {
  const { type } = action;

  if (type === ReduxPersistConstants.REHYDRATE) {
    return action.payload;
  } else if (type === 'SET_REMINDER') {
    return { reminders: [{ time: 'today', id: '1' }] };
  } else if (type === 'REMOVE_REMINDER') {
    return { reminders: [] };
  } else {
    return state;
  }
};

const Store = createStore(
  reducer,
  {},
  compose(applyMiddleware(), autoRehydrate({ log: true }))
);

Store.rehydrateAsync = () => {
  return new Promise(resolve => {
    persistStore(Store, { storage: AsyncStorage }, () => {
      resolve();
    });
  });
};

export default Store;
