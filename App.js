import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { AppLoading, Constants, KeepAwake } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import Sentry from 'sentry-expo';

import Images from './constants/Images';
import RootNavigation from './navigation/RootNavigation';
import Colors from './constants/Colors';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import NavigationEvents from './utilities/NavigationEvents';

Sentry.config(
  'https://23d7bdfb2fa44757a31487fe1769487a@sentry.io/185875'
).install();

console.disableYellowBox = true;
Text.defaultProps.allowFontScaling = false;

export default class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: Images.forLocalCache,
        fonts: [
          FontAwesome.font,
          { 'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf') },
          {
            'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
          },
          {
            'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
          },
          {
            'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
          },
          {
            'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
          },
        ],
      });
    } catch (e) {
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <View style={styles.container}>
          <RootNavigation
            onNavigationStateChange={(prevState, currentState) => {
              NavigationEvents.emit('change', { prevState, currentState });
            }}
          />

          <KeepAwake />
          <StatusBar barStyle="light-content" backgroundColor={Colors.purple} />
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
