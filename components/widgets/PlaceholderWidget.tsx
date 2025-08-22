import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PlaceholderWidgetProps {
  title: string;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export const PlaceholderWidget: React.FC<PlaceholderWidgetProps> = ({
  title,
  isPremium,
  onUpgrade,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      opacity: isPremium ? 0.6 : 1,
    },
    lockedContainer: {
      borderColor: theme.colors.warning,
      borderWidth: 2,
      borderStyle: 'dashed',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 120,
    },
    icon: {
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    upgradeButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
    },
    upgradeButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    comingSoonBadge: {
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    comingSoonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
  });

  return (
    <View style={[styles.container, isPremium && styles.lockedContainer]}>
      <View style={styles.content}>
        <View style={styles.icon}>
          <Ionicons
            name={isPremium ? 'lock-closed' : 'construct'}
            size={32}
            color={isPremium ? theme.colors.warning : theme.colors.textSecondary}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          {isPremium ? 'Premium feature' : 'Coming soon'}
        </Text>
        {isPremium && onUpgrade ? (
          <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>In Development</Text>
          </View>
        )}
      </View>
    </View>
  );
};
