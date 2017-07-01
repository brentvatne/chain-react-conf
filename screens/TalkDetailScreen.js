import React from 'react';
import {
  Animated,
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
} from 'react-native';
import FadeIn from 'react-native-fade-in-image';

import BackButton from '../components/BackButton';
import SocialMediaButton from '../components/SocialMediaButton';
import TalkFooter from '../components/TalkFooter';
import StatusBarUnderlay from '../components/StatusBarUnderlay';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export default class TalkDetailScreen extends React.PureComponent {
  state = {
    scrollY: new Animated.Value(0),
  };

  render() {
    const { details } = this.props.navigation.state.params;

    let underlayOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true }
          )}>
          <View style={styles.container}>
            <BackButton style={styles.backButton} />

            <View style={styles.cardShadow1} />
            <View style={styles.cardShadow2} />
            {this._renderAvatar()}
            <View style={styles.card}>
              <Text style={styles.sectionHeading}>TALK</Text>
              <Text style={styles.heading}>
                {details.title}
              </Text>
              <Text style={styles.description}>
                {details.description}
              </Text>
              <Text style={styles.sectionHeading}>ABOUT</Text>
              {this._renderSpeakers()}
            </View>

            <TalkFooter details={details} />
          </View>
        </Animated.ScrollView>

        <StatusBarUnderlay animatedOpacity={underlayOpacity} />
      </View>
    );
  }

  _renderAvatar() {
    const { details } = this.props.navigation.state.params;

    const image = (
      <Image style={styles.avatar} source={{ uri: details.avatarURL }} />
    );
    if (Platform.OS === 'ios') {
      return (
        <FadeIn style={styles.avatarFadeContainer}>
          {image}
        </FadeIn>
      );
    } else {
      return image;
    }
  }

  _renderSpeakers = () => {
    const { details } = this.props.navigation.state.params;
    const { speakerInfo } = details;

    return speakerInfo.map(this._renderSpeaker);
  };

  _renderSpeaker = (speaker, index) => {
    return (
      <View key={index}>
        <Text style={styles.heading}>
          {speaker.name}
        </Text>
        <Text style={styles.description}>
          {speaker.bio}
        </Text>
        <View style={styles.social}>
          {speaker.twitter &&
            <SocialMediaButton
              network="twitter"
              spacing="right"
              username={speaker.twitter}
            />}
          {speaker.github &&
            <SocialMediaButton
              network="github"
              spacing="right"
              username={speaker.github}
            />}
        </View>
      </View>
    );
  };

  _goBack = () => {
    this.props.navigation.goBack();
  };
}

const styles = StyleSheet.create({
  container: {
    marginTop: 101,
    marginBottom: Layout.doubleBaseMargin,
    marginHorizontal: Layout.doubleBaseMargin,
  },
  backButton: {
    position: 'absolute',
    top: -65,
    left: -5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardShadow1: {
    flex: 1,
    height: 5,
    marginHorizontal: 10,
    backgroundColor: Colors.purpleShadow1,
    borderTopLeftRadius: Layout.cardRadius,
    borderTopRightRadius: Layout.cardRadius,
  },
  cardShadow2: {
    flex: 1,
    height: 6,
    marginHorizontal: 5,
    backgroundColor: Colors.purpleShadow2,
    borderTopLeftRadius: Layout.cardRadius,
    borderTopRightRadius: Layout.cardRadius,
  },
  card: {
    paddingTop: 48,
    paddingHorizontal: 30,
    borderTopLeftRadius: Layout.cardRadius,
    borderTopRightRadius: Layout.cardRadius,
    backgroundColor: Colors.snow,
  },
  avatarFadeContainer: {
    zIndex: 4,
  },
  avatar: {
    position: 'absolute',
    zIndex: 4,
    top: -43,
    left: (Layout.screenWidth - Layout.doubleBaseMargin * 2) / 2 - 53,
    height: 106,
    width: 106,
    borderRadius: 53,
    borderColor: Colors.snow,
    borderWidth: 1,
  },
  sectionHeading: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    fontFamily: 'Montserrat-Light',
    fontSize: 11,
    letterSpacing: 3,
    color: Colors.lightText,
  },
  heading: {
    marginBottom: 5,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 17,
    letterSpacing: 0,
    color: Colors.darkPurple,
  },
  description: {
    marginBottom: 30,
    fontFamily: 'Montserrat-Light',
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
    color: Colors.lightText,
  },
  social: {
    flexDirection: 'row',
    marginBottom: 30,
  },
});
