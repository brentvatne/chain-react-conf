import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

const RootNavigation = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

export default RootNavigation;
