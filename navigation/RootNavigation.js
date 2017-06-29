import { Platform, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Colors from '../constants/Colors';
import MainTabNavigator from './MainTabNavigator';
import TalkDetailScreen from '../screens/TalkDetailScreen';
import BreakDetailScreen from '../screens/BreakDetailScreen';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.darkPurple,
    ...Platform.select({
      // Removes the white overlay when swiping back
      ios: {
        opacity: 1,
      },
    }),
  },
});

const RootNavigation = StackNavigator(
  {
    MainTabs: { screen: MainTabNavigator },
    TalkDetail: { screen: TalkDetailScreen },
    BreakDetail: { screen: BreakDetailScreen },
  },
  {
    headerMode: 'none',
    initialRouteName: 'MainTabs',
    cardStyle: styles.card,
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

export default RootNavigation;
