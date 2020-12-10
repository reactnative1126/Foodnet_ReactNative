import React, { useState } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@modules';
import AppContainer from '@navigations';
import { Splash } from '@components';

import i18n from '@utils/i18n';

i18n.setI18nConfig();
LogBox.ignoreAllLogs(true);

global.internet = true;

export default App = () => {
  const [splash, setSplash] = useState(true);

  setTimeout(() => setSplash(false), 1000);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {splash ? <Splash /> : <AppContainer />}
      </PersistGate>
    </Provider>
  );
}