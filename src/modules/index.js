import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import authReducer from './reducers/auth';
import foodReducer from './reducers/food';
import profileReducer from './reducers/profile';

const peresistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: null,
  whitelist: ['auth', 'food', 'profile'],
  blacklist: [],
};

const rootReducer = combineReducers({
  auth: authReducer,
  food: foodReducer,
  profile: profileReducer
});

const persistedReducer = persistReducer(peresistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));

let persistor = persistStore(store);

export { store, persistor };
