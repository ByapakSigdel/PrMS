import { themes } from '@/constants/Themes';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function SettingsScreen() {
  const { theme, themeId, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade Account',
      'Choose your subscription plan to unlock premium features.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Plans', onPress: () => console.log('Navigate to subscription') },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing will be available soon!');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      alignItems: 'center',
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    profileImageText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'white',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    userType: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    userTypeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.colors.surface,
      marginTop: 16,
      marginHorizontal: 16,
      borderRadius: 12,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      padding: 16,
      paddingBottom: 8,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: 12,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    settingValue: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    themeOptions: {
      flexDirection: 'row',
      gap: 12,
      padding: 16,
    },
    themeOption: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    themeOptionSelected: {
      borderColor: theme.colors.primary,
    },
    themePreview: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginBottom: 8,
    },
    themeOptionText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    upgradeButton: {
      backgroundColor: theme.colors.primary,
      margin: 16,
      marginTop: 8,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    upgradeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    signOutButton: {
      backgroundColor: theme.colors.error,
      margin: 16,
      marginTop: 8,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    signOutButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileImage} onPress={handleEditProfile}>
          <Text style={styles.profileImageText}>
            {getInitials(user?.name || 'User')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.userType}>
          <Text style={styles.userTypeText}>
            {user?.userType} - {user?.subscriptionTier}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
            <Ionicons
              name="person-outline"
              size={24}
              color={theme.colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Edit Profile</Text>
              <Text style={styles.settingSubtitle}>Update your personal information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.themeOptions}>
            {themes.map((themeOption) => (
              <TouchableOpacity
                key={themeOption.id}
                style={[
                  styles.themeOption,
                  themeId === themeOption.id && styles.themeOptionSelected,
                ]}
                onPress={() => setTheme(themeOption.id)}
              >
                <View
                  style={[
                    styles.themePreview,
                    { backgroundColor: themeOption.colors.primary },
                  ]}
                />
                <Text style={styles.themeOptionText}>{themeOption.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingItem}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive push notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Subscription */}
        {user?.subscriptionTier === 'free' && (
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>
              ⭐ Upgrade to Premium
            </Text>
          </TouchableOpacity>
        )}

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
