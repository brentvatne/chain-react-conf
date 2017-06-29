import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import SocialMediaButton from '../components/SocialMediaButton';

import TalkInfo from '../components/TalkInfo';
import PurpleGradient from '../components/PurpleGradient';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export default class TalkDetailScreen extends React.Component {
  static navigationOptions = {};

  render() {
    const { details } = this.props.navigation.state.params;

    return (
      <PurpleGradient style={styles.linearGradient}>
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={this._goBack}>
              <Image style={styles.backButtonIcon} source={Images.arrowIcon} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.cardShadow1} />
            <View style={styles.cardShadow2} />
            <Image style={styles.avatar} source={{ uri: details.avatarURL }} />
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
            <TalkInfo details={details} />
          </View>
        </ScrollView>
      </PurpleGradient>
    );
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
              onPress={this._handlePressTwitter}
            />}
          {speaker.github &&
            <SocialMediaButton
              network="github"
              spacing="right"
              onPress={this._handlePressGithub}
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
    top: -59,
    left: -10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    marginRight: 5,
  },
  backButtonText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 17,
    letterSpacing: 0,
    backgroundColor: Colors.transparent,
    color: 'rgba(255,255,255,0.80)',
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
  avatar: {
    position: 'absolute',
    top: -43,
    left: (Layout.screenWidth - Layout.doubleBaseMargin * 2) / 2 - 53,
    height: 106,
    width: 106,
    borderRadius: 53,
    borderColor: Colors.snow,
    borderWidth: 1,
    zIndex: 4,
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
