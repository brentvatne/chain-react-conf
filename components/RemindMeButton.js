import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { find } from 'lodash';

import { Colors, Fonts, Images } from '../constants';
import Reminders from '../utilities/Reminders';

@connect((data, props) => RemindMeButton.getDataProps(data, props))
export default class RemindMeButton extends React.Component {
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
    const icon = notificationId
      ? Images.activeNotificationIcon
      : Images.inactiveNotificationIcon;
    const label = notificationId ? 'Turn off' : 'Remind me';

    return (
      <TouchableOpacity
        style={[styles.button, notificationId && styles.activeButton]}
        onPress={this._toggleRemindMeAsync}>
        <View style={styles.buttonContainer}>
          <Image source={icon} style={styles.icon} />
          <Text style={[styles.text, notificationId && styles.activeText]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
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
    borderRadius: 100,
    backgroundColor: Colors.clear,
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
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
    fontSize: 11,
    color: Colors.red,
  },
  activeText: {
    color: Colors.snow,
  },
});
