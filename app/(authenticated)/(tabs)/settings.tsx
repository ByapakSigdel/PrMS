import { themes } from "@/constants/Themes";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  const { user, signOut, updateUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [imageUri, setImageUri] = useState<string | undefined>(
    user?.profilePicture
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setImageUri(user?.profilePicture);
  }, [user]);

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
      alignItems: "center",
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    profileImageText: {
      fontSize: 32,
      fontWeight: "bold",
      color: "white",
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
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
      color: "white",
      fontSize: 12,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.colors.surface,
      marginTop: 16,
      marginHorizontal: 16,
      borderRadius: 12,
      overflow: "hidden",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      padding: 16,
      paddingBottom: 8,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
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
      fontWeight: "600",
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
      fontWeight: "600",
    },
    themeOptions: {
      flexDirection: "row",
      gap: 12,
      padding: 16,
    },
    themeOption: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
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
      fontWeight: "600",
      color: theme.colors.text,
    },
    upgradeButton: {
      backgroundColor: theme.colors.primary,
      margin: 16,
      marginTop: 8,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    upgradeButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    signOutButton: {
      backgroundColor: theme.colors.error,
      margin: 16,
      marginTop: 8,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    signOutButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    notificationButton: {
      backgroundColor: theme.colors.primary,
      margin: 16,
      marginTop: 8,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    notificationButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  // Handlers and helpers
  const handleSignOut = async () => {
    await signOut();
  };

  const handleUpgrade = () => {
    // Placeholder for upgrade logic
    alert("Upgrade to premium coming soon!");
  };

  const handleSendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification!",
      },
      trigger: null,
    });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateUser({
        name: editName,
        email: editEmail,
        profilePicture: imageUri,
      });
      setShowEditModal(false);
    } catch (e) {
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.header}>
          <View style={styles.profileImage}>
            {/* Avatar or initials */}
            <Text style={styles.profileImageText}>
              {user?.name ? user.name[0].toUpperCase() : "?"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.userType && (
            <View style={styles.userType}>
              <Text style={styles.userTypeText}>{user.userType}</Text>
            </View>
          )}
          <View style={{ height: 12 }} />
          <TouchableOpacity onPress={() => setShowEditModal(true)}>
            <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <Modal visible={showEditModal} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: "#0008",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: theme.colors.surface,
                padding: 24,
                borderRadius: 16,
                width: "85%",
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}
              >
                Edit Profile
              </Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="Name"
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
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: theme.colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: theme.colors.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: theme.colors.primary,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {isSaving ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
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
            <View style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>
                Receive push notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor="white"
            />
          </View>
          <TouchableOpacity
            style={[styles.settingItem, styles.settingItemLast]}
            onPress={handleSendNotification}
          >
            <View style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Send Test Notification</Text>
              <Text style={styles.settingSubtitle}>
                Send a test notification to your device
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Subscription */}
        {user?.subscriptionTier === "free" && (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleUpgrade}
          >
            <Text style={styles.upgradeButtonText}>⭐ Upgrade to Premium</Text>
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
