import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export default class ScheduleScreen extends React.Component {
  static navigationOptions = {
    title: 'Schedule',
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
