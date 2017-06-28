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
    shouldRenderDayTwo: false,
  };

  _setActiveDay = activeDay => {
    let nextState = { activeDay };
    if (activeDay === 1 && !this.state.shouldRenderDayTwo) {
      nextState.shouldRenderDayTwo = true;
    }

    this.setState(nextState);
  };

  render() {
    const { isCurrentDay, activeDay } = this.state;

    return (
      <PurpleGradient style={styles.container}>
        <DayToggle activeDay={activeDay} onSelectDay={this._setActiveDay} />

        <View style={{ flex: 1 }}>
          {this._maybeRenderListForDay(0)}
          {this._maybeRenderListForDay(1)}
        </View>
      </PurpleGradient>
    );
  }

  _maybeRenderListForDay = day => {
    let { activeDay, shouldRenderDayTwo } = this.state;

    if (day === 1 && !shouldRenderDayTwo) {
      return null;
    }

    return (
      <View
        pointerEvents={activeDay === day ? 'auto' : 'none'}
        style={[
          StyleSheet.absoluteFill,
          { opacity: activeDay === day ? 1 : 0 },
        ]}>
        <ScheduleDay events={scheduleByDay[day]} />
      </View>
    );
  };
}

class ScheduleDay extends React.PureComponent {
  render() {
    return (
      <FlatList
        data={this.props.events}
        renderItem={this._renderItem}
        keyExtractor={(item, idx) => item.eventStart}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 20,
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
