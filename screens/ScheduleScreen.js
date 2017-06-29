import React from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';

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
    daysToRender: [0],
  };

  _setActiveDay = activeDay => {
    let nextState = { activeDay };
    if (!this.state.daysToRender.includes(activeDay)) {
      let daysToRender = [...this.state.daysToRender, activeDay];
      nextState.daysToRender = daysToRender;
    }

    this.setState(nextState);
  };

  render() {
    const { activeDay } = this.state;

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
    let { activeDay, daysToRender } = this.state;

    if (!daysToRender.includes(day)) {
      return null;
    }

    return (
      <View
        pointerEvents={activeDay === day ? 'auto' : 'none'}
        style={[
          StyleSheet.absoluteFill,
          { opacity: activeDay === day ? 1 : 0 },
        ]}>
        <ScheduleDay events={scheduleByDay[day]} fadeInOnRender={day === 1} />
      </View>
    );
  };
}

class ScheduleDay extends React.PureComponent {
  constructor(props) {
    super();

    this.state = {
      visible: new Animated.Value(props.fadeInOnRender ? 0 : 1),
      waitingToRender: !!props.fadeInOnRender,
    };
  }

  componentWillMount() {
    if (this.props.fadeInOnRender) {
      requestAnimationFrame(() => {
        this.setState({ waitingToRender: false }, () => {
          Animated.timing(this.state.visible, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      });
    }
  }

  render() {
    if (this.state.waitingToRender) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#fff" />
        </View>
      );
    }

    return (
      <Animated.View style={{ flex: 1, opacity: this.state.visible }}>
        <FlatList
          data={this.props.events}
          renderItem={this._renderItem}
          keyExtractor={item => item.eventStart}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
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
