import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MapView } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Images, Layout, Colors } from '../constants';

const Venue = {
  title: 'The Armory',
  latitude: 45.524166,
  longitude: -122.681645,
};

const Region = {
  latitude: Venue.latitude,
  longitude: Venue.longitude,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default class VenueMap extends React.Component {
  render() {
    return (
      <View>
        <MapView
          scrollEnabled={this.props.focused}
          style={this.props.style}
          initialRegion={Region}
          onRegionChangeComplete={this._onRegionChange}
          showsUserLocation={true}>
          {this._renderMarker(Venue)}
        </MapView>

        {this._renderCloseButton()}
      </View>
    );
  }

  _renderMarker(location) {
    return (
      <MapView.Marker
        key={location.title}
        image={Images.markerIcon}
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}>
        <MapView.Callout style={{ flex: 1, position: 'relative' }}>
          <TouchableOpacity onPress={this._onPress}>
            <Text>
              {location.title}
            </Text>
          </TouchableOpacity>
        </MapView.Callout>
      </MapView.Marker>
    );
  }

  _renderCloseButton = () => {
    // Warning GROSS hack for Android render bug on maps
    const left = this.props.focused ? 0 : -100;

    return (
      <TouchableOpacity
        onPress={this.props.onCloseMap}
        hitSlop={{ top: 30, left: 30, right: 30, bottom: 30 }}
        style={[styles.mapCloseButton, { left }]}>
        <Icon
          name="times-circle"
          size={26}
          color={Colors.purple}
          style={[styles.mapCloseButton]}
        />
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  map: {
    // For Android :/
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapCloseButton: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    margin: Layout.smallMargin,
    position: 'absolute',
    left: 0,
    zIndex: 100,
  },
});
