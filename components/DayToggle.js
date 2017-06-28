import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const buttonHitSlop = {
  top: 30,
  left: 30,
  right: 30,
  bottom: 30,
};

export default class DayToggle extends React.Component {
  render() {
    const { activeDay, onSelectDay } = this.props;
    const dayStyle = day =>
      activeDay === day ? styles.activeDay : styles.inactiveDay;

    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0.0, 0.38, 1.0]}
        colors={['#46114E', '#521655', '#571757']}
        style={styles.headerGradient}>
        <View style={styles.dayToggle}>
          <TouchableOpacity
            onPress={() => onSelectDay(0)}
            hitSlop={buttonHitSlop}>
            <Text style={dayStyle(0)}>Monday</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSelectDay(1)}
            hitSlop={buttonHitSlop}>
            <Text style={dayStyle(1)}>Tuesday</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  headerGradient: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 20,
    backgroundColor: 'black',
  },
  dayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: Layout.doubleBaseMargin,
    height: 85,
    backgroundColor: Colors.clear,
  },
  inactiveDay: {
    backgroundColor: Colors.clear,
    fontFamily: 'Montserrat-Light',
    fontSize: 20,
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 0,
  },
  activeDay: {
    backgroundColor: Colors.clear,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    color: Colors.snow,
    letterSpacing: 0,
  },
});
