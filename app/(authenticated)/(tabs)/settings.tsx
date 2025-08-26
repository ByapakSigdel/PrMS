import { themes } from '@/constants/Themes';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function SettingsScreen() {
  const { theme, themeId, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { updateUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [imageUri, setImageUri] = useState<string | undefined>(user?.profilePicture);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setImageUri(user?.profilePicture);
  }, [user]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } },
        { text: 'Sign Out', style: 'destructive', onPress: async () => {
            if (Platform.OS !== 'web') await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await signOut();
          } },
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
    setShowEditModal(true);
  };

  const pickImage = async () => {
    try {
      if (!ImagePicker || typeof ImagePicker.launchImageLibraryAsync !== 'function') {
        Alert.alert(
          'Image Picker not available',
          'expo-image-picker is not available at runtime. Run `npx expo install expo-image-picker` and restart the app.'
        );
        return;
      }
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Permission to access photos is required to choose a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      // Newer expo-image-picker returns { canceled: boolean, assets: [{ uri }] }
      if (!result.canceled) {
        const uri = result.assets && result.assets[0]?.uri;
        if (uri) setImageUri(uri);
      }
    } catch (error) {
      console.error('Image pick error:', error);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const patched: any = { name: editName, email: editEmail };
      if (imageUri) patched.profilePicture = imageUri;
      const updated = await updateUser(patched);
      if (updated) {
        setShowEditModal(false);
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(()=>{});
      } else {
        Alert.alert('Save failed', 'Could not update profile locally.');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Error', 'An error occurred while saving your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required', 
          'You need to enable notifications in your device settings to receive notifications.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Schedule a local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification 📱",
          body: "This is a test notification from PrMS app!",
          data: { testData: 'some data' },
        },
        trigger: null, // Show immediately
      });

      // Show success feedback
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      console.error('Notification error:', error);
      Alert.alert('Error', 'Failed to send notification. Please try again.');
    }
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
    notificationButton: {
      backgroundColor: theme.colors.primary,
      margin: 16,
      marginTop: 8,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    notificationButtonText: {
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
          {user?.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={{ width: 80, height: 80, borderRadius: 40 }} />
          ) : (
            <Text style={styles.profileImageText}>{getInitials(user?.name || 'User')}</Text>
          )}
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

        <Modal visible={showEditModal} animationType="slide" onRequestClose={() => setShowEditModal(false)}>
          <View style={[styles.container, { padding: 20 }]}> 
            <Text style={[styles.sectionTitle, { paddingTop: 0 }]}>Edit Profile</Text>
            <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginVertical: 12 }}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={{ width: 120, height: 120, borderRadius: 60 }} />
              ) : (
                <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 36 }}>{getInitials(editName || 'U')}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Full name"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
                color: theme.colors.text,
              }}
              placeholderTextColor={theme.colors.textSecondary}
            />

            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
                color: theme.colors.text,
              }}
              placeholderTextColor={theme.colors.textSecondary}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable onPress={() => setShowEditModal(false)} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: theme.colors.border, alignItems: 'center' }}>
                <Text style={{ color: theme.colors.text }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSaveProfile} disabled={isSaving} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: theme.colors.primary, alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>{isSaving ? 'Saving...' : 'Save'}</Text>
              </Pressable>
            </View>

          </View>
        </Modal>

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
          <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]} onPress={handleSendNotification}>
            <Ionicons
              name="send-outline"
              size={24}
              color={theme.colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Send Test Notification</Text>
              <Text style={styles.settingSubtitle}>Send a test notification to your device</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
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
