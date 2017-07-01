import React from 'react';
import {
  Animated,
  BackHandler,
  View,
  Platform,
  Text,
  StyleSheet,
  PanResponder,
  LayoutAnimation,
} from 'react-native';

import { Colors, Fonts, Images, Layout } from '../constants';
import NavigationEvents from '../utilities/NavigationEvents';
import StatusBarUnderlay from '../components/StatusBarUnderlay';
import NearbySitesGallery from '../components/NearbySitesGallery';
import VenueMap from '../components/VenueMap';
import VenueMapActions from '../components/VenueMapActions';
import PurpleGradient from '../components/PurpleGradient';

const MAP_TAP_THRESHOLD = 100;
const SCROLL_TARGET_FOR_MAP_FOCUS = Layout.screenHeight / 4.25;
const ACTIVE_MAP_HEIGHT = Layout.screenHeight - SCROLL_TARGET_FOR_MAP_FOCUS;

export default class LocationScreen extends React.Component {
  static navigationOptions = {
    title: 'Location',
  };

  state = {
    scrollY: new Animated.Value(0),
    mapTouchStart: '',
    mapIsFocused: false,
    mapActionsAreFocused: false,
  };

  _mostRecentScrollY = 0;

  componentWillMount() {
    this.state.scrollY.addListener(({ value }) => {
      this._mostRecentScrollY = value;
    });

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('backPress', this._handleBackButtonPress);

      // It feels better if we close the map and actions on Android when we
      // switch tabs, and also makes handling back button easier
      this._navigationEventListener = NavigationEvents.addListener(
        'change',
        () => {
          this._maybeCloseMap();
          this._maybeCloseMapActions();
        }
      );
    }

    this._tabPressedListener = NavigationEvents.addListener(
      'selectedTabPressed',
      route => {
        if (route.key === 'Location') {
          this._scrollToTop();
        }
      }
    );

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: e => {
        this.setState({ mapTouchStart: e.nativeEvent.timestamp });
      },
      onPanResponderRelease: this._checkMapTap,
    });
  }

  componentWillUnmount() {
    this._navigationEventListener && this._navigationEventListener.remove();
    this._tabPressedListener.remove();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this._handleBackButtonPress
    );
  }

  render() {
    let underlayOpacity = this.state.scrollY.interpolate({
      inputRange: [100, 250],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <PurpleGradient style={[styles.linearGradient, { flex: 1 }]}>
        <Animated.ScrollView
          ref={view => {
            this._scrollView = view;
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={1}
          scrollEnabled={!this.state.mapIsFocused}>
          <View style={styles.container}>
            {this._renderBackground()}
            {this._renderHeader()}
            {this._renderMap()}
            <VenueMapActions
              ref={view => {
                this._mapActions = view;
              }}
              onFocus={this._handleMapActionsFocus}
            />
            {this._renderNearbySites()}
          </View>
        </Animated.ScrollView>

        <StatusBarUnderlay animatedOpacity={underlayOpacity} />
      </PurpleGradient>
    );
  }

  _renderBackground = () => {
    const height = Layout.locationBackgroundHeight;
    const { scrollY } = this.state;

    return (
      <Animated.Image
        style={{
          position: 'absolute',
          width: '100%',
          height,
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [-height, 0, height],
                outputRange: [height, 0, 0],
              }),
            },
            {
              scale: scrollY.interpolate({
                inputRange: [-height, 0, height],
                outputRange: [0.9, 1, 1.5],
              }),
            },
          ],
        }}
        source={Images.theArmory}
        resizeMode="cover"
      />
    );
  };

  _renderHeader = () => {
    const height = Layout.locationBackgroundHeight - 24;
    const { scrollY } = this.state;

    return (
      <Animated.View
        style={{
          height,
          padding: 0,
          opacity: scrollY.interpolate({
            inputRange: [-height, 0, height * 0.4, height * 0.9],
            outputRange: [1, 1, 1, 0],
          }),
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [-height, 0, height * 0.45, height],
                outputRange: [0, 0, height * 0.45, height * 0.4],
              }),
            },
          ],
        }}>
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>The Armory</Text>
          <Text style={styles.address}>
            128 NW Eleventh Ave{'\n'}
            Portland, OR 97209
          </Text>
        </View>
      </Animated.View>
    );
  };

  _renderMap() {
    return (
      <View {...this._panResponder.panHandlers}>
        <VenueMap
          focused={this.state.mapIsFocused}
          onCloseMap={this._onCloseMap}
          style={[
            styles.map,
            this.state.mapIsFocused && { height: ACTIVE_MAP_HEIGHT },
          ]}
        />
      </View>
    );
  }

  _renderNearbySites() {
    return (
      <View>
        <View style={styles.nearby}>
          <Text style={styles.mainHeading}>Nearby</Text>
        </View>

        <NearbySitesGallery />
      </View>
    );
  }

  _scrollToTop = () => {
    this._maybeCloseMap();
    this._maybeCloseMapActions();
    this._scrollView && this._scrollView.getNode().scrollTo({ x: 0, y: 0 });
  };

  _handleMapActionsFocus = () => {
    if (this._mostRecentScrollY < 200) {
      this._scrollView.getNode().scrollTo({ x: 0, y: 250, animated: true });
    }
  };

  _checkMapTap = e => {
    if (
      e.nativeEvent.timestamp - this.state.mapTouchStart <
      MAP_TAP_THRESHOLD
    ) {
      this._focusMap();
    }
    this.setState({ mapTouchStart: '' });
  };

  _focusMap = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 250,
    });

    this._scrollView.getNode().scrollTo({
      y: SCROLL_TARGET_FOR_MAP_FOCUS,
      animated: true,
    });
    this.setState({ mapIsFocused: true });
  };

  _handleBackButtonPress = () => {
    return this._maybeCloseMap() || this._maybeCloseMapActions();
  };

  _maybeCloseMap = () => {
    if (this.state.mapIsFocused) {
      return this._onCloseMap();
    } else {
      return false;
    }
  };

  _maybeCloseMapActions = () => {
    return this._mapActions && this._mapActions.maybeClose();
  };

  _onCloseMap = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 150,
    });

    this._scrollView.getNode().scrollTo({
      y: 0,
      animated: true,
    });
    this.setState({ mapIsFocused: false });

    // For BackHandler to not propagate the event further
    return true;
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.transparent,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
    paddingTop: Layout.baseMargin,
    backgroundColor: Colors.transparent,
  },
  section: {
    margin: Layout.section,
    padding: Layout.baseMargin,
  },
  sectionHeader: {
    padding: Layout.baseMargin,
    backgroundColor: Colors.frost,
  },
  sectionText: {
    ...Fonts.style.normal,
    paddingVertical: Layout.doubleBaseMargin,
    color: Colors.snow,
    marginVertical: Layout.smallMargin,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.snow,
    padding: Layout.smallMargin,
    marginBottom: Layout.smallMargin,
    marginHorizontal: Layout.smallMargin,
  },
  titleText: {
    ...Fonts.style.h2,
    fontSize: 14,
    color: Colors.text,
  },
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  mainHeading: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 31,
    letterSpacing: 0.2,
    color: Colors.snow,
  },
  address: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    letterSpacing: 0.47,
    lineHeight: 23,
    textAlign: 'center',
    color: '#FDE5FF',
  },
  map: {
    width: '100%',
    height: 180,
    zIndex: 2,
  },
  nearby: {
    alignItems: 'center',
    paddingTop: 40,
  },
});
