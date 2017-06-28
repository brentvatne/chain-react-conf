import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default class LocationScreen extends React.Component {
  static navigationOptions = {
    title: 'Location',
  };

  render() {
    return (
      <ScrollView style={styles.container}>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
