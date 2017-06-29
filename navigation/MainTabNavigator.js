import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import { Colors, Images, Layout } from '../constants';
import ScheduleScreen from '../screens/ScheduleScreen';
import LocationScreen from '../screens/LocationScreen';
import GeneralInfoScreen from '../screens/GeneralInfoScreen';

const styles = StyleSheet.create({
  tabBar: {
    height: Layout.tabBarHeight,
    paddingTop: 5,
    paddingBottom: 1,
    paddingHorizontal: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    backgroundColor: Colors.darkPurple,
  },
  tabBarLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 9,
    letterSpacing: 0,
    color: Colors.snow,
  },
});

const MainTabNavigator = TabNavigator(
  {
    Schedule: {
      screen: ScheduleScreen,
    },
    Location: {
      screen: LocationScreen,
    },
    GeneralInfo: {
      screen: GeneralInfoScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      header: null,
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconImage;
        switch (routeName) {
          case 'Schedule':
            iconImage = focused
              ? Images.activeScheduleIcon
              : Images.inactiveScheduleIcon;
            break;
          case 'Location':
            iconImage = focused
              ? Images.activeLocationIcon
              : Images.inactiveLocationIcon;
            break;
          case 'GeneralInfo':
            iconImage = focused
              ? Images.activeInfoIcon
              : Images.inactiveInfoIcon;
        }

        return <Image source={iconImage} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    headerMode: 'none',
    animationEnabled: false,
    swipeEnabled: false,
    lazy: true,
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'white',
      style: styles.tabBar,
      labelStyle: styles.tabBarLabel,
    },
  }
);

export default MainTabNavigator;
