import React from 'react';
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';

export default props => {
  const gradient = [Colors.purple, Colors.darkPurple];
  return (
    <LinearGradient colors={gradient} style={props.style}>
      {props.children}
    </LinearGradient>
  );
};
