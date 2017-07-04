import React from 'react';
import { Button } from 'react-native';
import { connect } from 'react-redux';

import Reminders from '../utilities/Reminders';

@connect((data, props) => RemindMeButton.getDataProps(data, props))
export default class RemindMeButton extends React.Component {
  static getDataProps(data, props) {
    // data.reminders where props.time is same as reminder.time

    return {
      notificationId: null,
    };
  }

  _toggleRemindMe = async () => {
    if (this.props.notificationId) {
      Reminders.cancelAsync(this.props.notificationId);
    } else {
      Reminders.scheduleAsync(this.props.time, this.props.title);
    }
  };

  render() {
    return (
      <Button
        title={this.props.notificationId ? 'Turn off' : 'Remind me'}
        onPress={this._toggleRemindMe}
      />
    );
  }
}
