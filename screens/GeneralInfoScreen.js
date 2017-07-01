import React from 'react';
import {
  Animated,
  LayoutAnimation,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, Fonts, Layout } from '../constants';
import { SlackBanner, TwitterBanner } from '../components/InfoBanners';
import RoundedButton from '../components/RoundedButton';
import PurpleGradient from '../components/PurpleGradient';
import StatusBarUnderlay from '../components/StatusBarUnderlay';
import Sponsors from '../components/Sponsors';
import NavigationEvents from '../utilities/NavigationEvents';

// import ConferenceAnnouncements from '../Components/ConferenceAnnouncements'

export default class GeneralInfoScreen extends React.Component {
  static navigationOptions = {
    title: 'General Info',
  };

  state = {
    activeTab: 'liveHelp',
    scrollY: new Animated.Value(0),
  };

  componentWillMount() {
    this._tabPressedListener = NavigationEvents.addListener(
      'selectedTabPressed',
      route => {
        if (route.key === 'GeneralInfo') {
          this._scrollToTop();
        }
      }
    );
  }

  componentWillUnmount() {
    this._tabPressedListener.remove();
  }

  render() {
    let underlayOpacity = this.state.scrollY.interpolate({
      inputRange: [30, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <PurpleGradient style={{ flex: 1 }}>
        <Animated.ScrollView
          ref={view => {
            this._scrollView = view;
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={1}
          bounces={false}>
          <View style={styles.container}>
            <SlackBanner />
            <TwitterBanner />

            {this._renderTabs()}
          </View>
        </Animated.ScrollView>

        <StatusBarUnderlay animatedOpacity={underlayOpacity} />
      </PurpleGradient>
    );
  }

  _scrollToTop = () => {
    this._scrollView.getNode().scrollTo({ x: 0, y: 0 });
  };

  _setActiveTab = tab => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 250,
    });
    this.setState({ activeTab: tab });
  };

  _renderTabs = () => {
    const { activeTab } = this.state;
    const liveHelpStyles = [
      styles.tab,
      activeTab === 'liveHelp' && styles.activeTab,
    ];
    const sponsorStyles = [
      styles.tab,
      activeTab === 'sponsors' && styles.activeTab,
    ];
    const liveHelpTextStyles = [
      styles.tabText,
      activeTab === 'liveHelp' && styles.activeTabText,
    ];
    const sponsorTextStyles = [
      styles.tabText,
      activeTab === 'sponsors' && styles.activeTabText,
    ];

    return (
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={liveHelpStyles}
            onPress={() => this._setActiveTab('liveHelp')}>
            <Text style={liveHelpTextStyles}>Live Help</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sponsorStyles}
            onPress={() => this._setActiveTab('sponsors')}>
            <Text style={sponsorTextStyles}>Sponsors</Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'liveHelp'
          ? this._renderLiveHelp()
          : this._renderSponsors()}
      </View>
    );
  };

  _renderLiveHelp() {
    return (
      <View style={styles.liveHelp}>
        <Text style={styles.liveHelpPhone}>(360) 562-0450</Text>
        <Text style={styles.liveHelpText}>
          Text or call us at anytime for directions, suspicious activity,
          violations of our Code of Conduct, or any other concern.
        </Text>
        <RoundedButton
          text="Send Text Message (SMS)"
          onPress={() => Linking.openURL('sms:3605620450')}
          style={styles.liveHelpButton}
        />
        <RoundedButton
          text="Give Us A Call"
          onPress={() => Linking.openURL('tel:3605620450')}
          style={styles.liveHelpButton}
        />
      </View>
    );
  }

  _renderSponsors() {
    return <Sponsors />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    marginTop: 14,
    fontFamily: Fonts.type.bold,
    fontSize: 31,
    letterSpacing: 0.2,
    backgroundColor: Colors.transparent,
    color: Colors.snow,
  },
  description: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    color: '#FDE5FF',
    letterSpacing: 0.47,
    lineHeight: 23,
  },
  tabsContainer: {
    flex: 1,
    backgroundColor: Colors.transparent,
    marginVertical: Layout.doubleBaseMargin,
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253,229,255,0.5)',
    padding: Layout.baseMargin,
  },
  activeTab: {
    borderBottomColor: Colors.snow,
  },
  tabText: {
    fontFamily: Fonts.type.base,
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: 0.47,
    color: 'rgba(253,229,255,0.5)',
  },
  activeTabText: {
    fontWeight: '600',
    color: Colors.snow,
  },
  liveHelp: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: Layout.doubleBaseMargin,
  },
  liveHelpPhone: {
    color: Colors.snow,
    fontFamily: Fonts.type.bold,
    fontSize: 31,
    fontWeight: '900',
  },
  liveHelpText: {
    margin: 5,
    color: Colors.snow,
    opacity: 0.9,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Fonts.type.base,
    lineHeight: 23,
    textAlign: 'center',
  },
  liveHelpButton: {
    marginTop: 25,
    width: 200,
  },
});
