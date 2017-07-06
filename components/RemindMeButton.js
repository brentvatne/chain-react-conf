import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { find } from 'lodash';

import { Colors, Fonts, Layout } from '../constants';
import Reminders from '../utilities/Reminders';

@connect((data, props) => RemindMeButton.getDataProps(data, props))
export default class RemindMeButton extends React.PureComponent {
  static getDataProps(data, props) {
    let reminder = find(
      data.reminders,
      reminder => reminder.time === props.time
    );

    return {
      notificationId: reminder && reminder.notificationId,
    };
  }

  render() {
    const { notificationId } = this.props;
    const label = notificationId ? 'Turn off' : 'Remind me';

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        hitSlop={{ top: 30, left: 30, right: 30, bottom: 30 }}
        style={[styles.button, notificationId && styles.activeButton]}
        onPress={this._toggleRemindMeAsync}>
        <View style={styles.buttonContainer}>
          {this._renderIcon()}
          <Text style={[styles.text, notificationId && styles.activeText]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderIcon() {
    const { notificationId } = this.props;
    let iconName;
    let iconColor;

    if (notificationId) {
      iconColor = Colors.snow;
      iconName =
        Platform.OS === 'ios'
          ? 'ios-notifications-off'
          : 'md-notifications-off';
    } else {
      iconColor = Colors.red;
      iconName =
        Platform.OS === 'ios'
          ? 'ios-notifications-outline'
          : 'md-notifications-outline';
    }

    return (
      <Ionicons
        name={iconName}
        size={15}
        style={[{ color: iconColor }, styles.icon]}
      />
    );
  }

  _toggleRemindMeAsync = async () => {
    if (this.props.notificationId) {
      await Reminders.cancelAsync(this.props.notificationId);
    } else {
      try {
        await Reminders.scheduleAsync(this.props.time, this.props.title);
      } catch (e) {
        alert('Oops, you need to enable notifications for the app!');
      }
    }
  };
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 34 / 2,
    backgroundColor: Colors.clear,
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.isSmallDevice ? 30 : 34,
    marginLeft: Layout.isSmallDevice ? 20 : 0,
    marginRight: Layout.isSmallDevice ? -5 : 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  activeButton: {
    backgroundColor: Colors.red,
  },
  icon: {
    marginRight: 7,
  },
  text: {
    fontFamily: Fonts.type.medium,
    fontSize: Layout.isSmallDevice ? 9 : 11,
    color: Colors.red,
  },
  activeText: {
    color: Colors.snow,
  },
});
