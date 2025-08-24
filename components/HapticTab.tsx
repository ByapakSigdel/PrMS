import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { onPressIn, onPress, style, ...rest } = props;

  // Keep incoming style as-is to avoid clipping labels; android_ripple with borderless:false
  // will contain the ripple within the pressable bounds on Android.
  const combinedStyle = style;

  return (
    <PlatformPressable
      {...rest}
  // Ensure Android ripple is contained to the view bounds (not borderless)
  android_ripple={{ color: 'rgba(0,0,0,0.12)', borderless: false }}
  style={combinedStyle}
      onPressIn={(ev) => {
        try {
          // soft tap feedback on press in
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        } catch (e) {
          // ignore haptics errors
        }
        onPressIn?.(ev);
      }}
      onPress={(ev) => {
        try {
          // stronger selection feedback when the tab is actually activated
          if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
          }
        } catch (e) {
          // ignore
        }
        onPress?.(ev);
      }}
    />
  );
}
