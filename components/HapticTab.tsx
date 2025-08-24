import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        try {
          // soft tap feedback on press in
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        } catch (e) {
          // ignore haptics errors
        }
        props.onPressIn?.(ev);
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
        props.onPress?.(ev);
      }}
    />
  );
}
