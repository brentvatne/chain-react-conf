import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import Images from '../constants/Images';

const SocialMediaButton = props => {
  const { network, style, spacing, onPress } = props;
  const imageSource =
    network === 'twitter' ? Images.twitterIcon : Images.githubIcon;
  const spacingShim = spacing === 'right' ? 'right' : 'left';

  return (
    <TouchableOpacity
      style={[styles[spacingShim], style]}
      onPress={onPress}
      hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
      <Image source={imageSource} />
    </TouchableOpacity>
  );
};

export default SocialMediaButton;

const styles = StyleSheet.create({
  left: { marginLeft: 30 },
  right: { marginRight: 30 },
});
