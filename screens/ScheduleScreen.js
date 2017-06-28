import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import scheduleByDay from '../data/scheduleByDay.json';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import PurpleGradient from '../components/PurpleGradient';
import DayToggle from '../components/DayToggle';
import TalkCard from '../components/TalkCard';
import BreakCard from '../components/BreakCard';

export default class ScheduleScreen extends React.Component {
  static navigationOptions = {
    title: 'Schedule',
  };

  state = {
    activeDay: 0,
  };

  _setActiveDay = activeDay => {
    this.setState({ activeDay });
  };

  render() {
    const { isCurrentDay, activeDay } = this.state;
    const data = scheduleByDay[activeDay];

    return (
      <View style={styles.container}>
        <PurpleGradient style={styles.linearGradient}>
          <DayToggle activeDay={activeDay} onSelectDay={this._setActiveDay} />
          {isCurrentDay && <View style={styles.timeline} />}

          {/* todo(brentvatne): this should not swap data but instead just hide/show, like tabs */}
          <FlatList
            ref={view => {
              this._scheduleList = view;
            }}
            data={data}
            renderItem={this._renderItem}
            keyExtractor={(item, idx) => item.eventStart}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </PurpleGradient>
      </View>
    );
  }

  _renderItem = ({ item }) => {
    if (item.type === 'talk') {
      return <TalkCard details={item} />;
    } else {
      return <BreakCard details={item} />;
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginVertical: Layout.smallMargin,
  },
  boldLabel: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  label: {
    color: Colors.text,
  },
  listContent: {
    paddingTop: Layout.baseMargin,
    paddingBottom: Layout.baseMargin * 10,
  },
  timeline: {
    width: 2,
    backgroundColor: '#6E3C7B',
    position: 'absolute',
    top: 85,
    bottom: 0,
    right: 11,
  },
});
