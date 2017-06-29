import { ActionSheetIOS, Platform, Linking } from 'react-native';

function getAppleMapsDirectionsURL(address) {
  return `http://maps.apple.com/?daddr=${address}&dirflg=d`;
}

function getGoogleMapsDirectionsURL(address) {
  return `http://maps.google.com/?daddr=${address}`;
}

export default function(address) {
  if (Platform.OS === 'android') {
    Linking.openURL(getGoogleMapsDirectionsURL(address));
    return;
  }

  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['Open in Apple Maps', 'Open in Google Maps', 'Cancel'],
      cancelButtonIndex: 2,
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        Linking.openURL(getAppleMapsDirectionsURL(address));
      } else if (buttonIndex === 1) {
        Linking.openURL(getGoogleMapsDirectionsURL(address));
      }
    }
  );
}
