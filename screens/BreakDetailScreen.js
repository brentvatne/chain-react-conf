import React from 'react';
import { Animated, StyleSheet, View, Text, Image } from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import { format, addMinutes } from 'date-fns';

import StatusBarUnderlay from '../components/StatusBarUnderlay';
import BackButton from '../components/BackButton';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import Layout from '../constants/Layout';

export default class BreakDetailScreen extends React.PureComponent {
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
            <View style={styles.card} onLayout={this.onCardLayout}>
              {this._renderMainImage()}
              <View style={styles.content}>
                <Text style={styles.heading}>
                  {details.type === 'lunch' ? 'Lunch' : 'Refreshment'} Options
                </Text>
                <View style={styles.descriptionContainer}>
                  {this._renderOptions(details.options)}
                </View>
                {this._renderVeganOptions(details.veganOptions)}
              </View>
            </View>
          </View>
        </Animated.ScrollView>

        <StatusBarUnderlay animatedOpacity={underlayOpacity} />
      </View>
    );
  }

  _renderMainImage = () => {
    const { details } = this.props.navigation.state.params;

    const mainImage = Images[`${details.type}Big`] || Images.lunchBig;
    const eventDuration = Number(details.duration);
    const prettyStartTime = format(details.eventStart, 'h:mm');
    const endTime = addMinutes(details.eventStart, eventDuration);
    const prettyEndTime = format(endTime, 'h:mm');
    const meridiem = format(endTime, 'A');

    return (
      <View style={styles.mainImageContainer}>
        <FadeIn
          placeholderStyle={{ backgroundColor: Colors.purple }}
          style={StyleSheet.absoluteFill}>
          <Image
            source={mainImage}
            style={[styles.mainImage, { width: null, height: null }]}
          />
        </FadeIn>

        <View style={styles.mainHeadingContainer}>
          <Text style={styles.breakHeading}>
            {details.title}
          </Text>
          <Text style={styles.breakDuration}>
            <Text>
              {prettyStartTime} - {prettyEndTime}
            </Text>
            <Text style={styles.meridiem}>
              {meridiem}
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  _renderOptions = options => {
    return (
      <View style={styles.descriptionContainer}>
        {options.map(this._renderOption)}
      </View>
    );
  };

  _renderOption = (option, index) => {
    return (
      <Text key={index} style={styles.description}>{`\u2022  ${option}`}</Text>
    );
  };

  _renderVeganOptions = options => {
    if (options.length > 0) {
      return (
        <View>
          <Text style={styles.heading}>Vegan Options</Text>
          <View style={styles.descriptionContainer}>
            {this._renderOptions(options)}
          </View>
        </View>
      );
    }
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
    paddingTop: 20,
    paddingHorizontal: 10,
    borderRadius: Layout.cardRadius,
    backgroundColor: Colors.snow,
  },
  mainImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: Colors.transparent,
  },
  mainImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  mainHeadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakHeading: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 23,
    letterSpacing: -0.2,
    lineHeight: 27,
    color: Colors.snow,
  },
  breakDuration: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    letterSpacing: -0.19,
    color: Colors.snow,
  },
  meridiem: {
    fontSize: 11,
    color: Colors.snow,
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 10,
  },
  heading: {
    marginBottom: 5,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 17,
    letterSpacing: 0,
    color: Colors.darkPurple,
  },
  descriptionContainer: {
    marginBottom: 15,
    paddingLeft: 5,
  },
  description: {
    fontFamily: 'Montserrat-Light',
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
    color: Colors.lightText,
  },
});
