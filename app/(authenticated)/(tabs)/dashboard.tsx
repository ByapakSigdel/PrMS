import { CalendarWidget } from '@/components/widgets/CalendarWidget';
import { PlaceholderWidget } from '@/components/widgets/PlaceholderWidget';
import { StatsWidget } from '@/components/widgets/StatsWidget';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Widget } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from 'react-native-draggable-flatlist';

export default function DashboardScreen() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme } = useTheme();
  const { widgets, updateWidgetLayout, toggleWidget, getAvailableFeatures } = useDashboard();
  const { user } = useAuth();

  const enabledWidgets = widgets.filter(widget => widget.isEnabled);
  const availableFeatures = getAvailableFeatures();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Unlock all features and get unlimited access to widgets.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => console.log('Navigate to upgrade') },
      ]
    );
  };

  const handleDragEnd = ({ data }: { data: Widget[] }) => {
    const updatedWidgets = data.map((widget, index) => ({
      ...widget,
      position: index,
    }));
    updateWidgetLayout(updatedWidgets);
  };

  const renderWidget = ({ item, drag, isActive }: RenderItemParams<Widget>) => {
    const canUpgrade = user?.subscriptionTier === 'free' && item.isPremium;

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={!isEditMode || isActive}
          style={[styles.widgetContainer, isActive && styles.activeWidget]}
        >
          {isEditMode && (
            <View style={styles.editControls}>
              <TouchableOpacity
                style={styles.dragHandle}
                onPressIn={drag}
              >
                <Ionicons name="menu" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => {
                  try {
                    toggleWidget(item.id, !item.isEnabled);
                  } catch (error) {
                    Alert.alert('Error', (error as Error).message);
                  }
                }}
              >
                <Ionicons
                  name={item.isEnabled ? 'eye' : 'eye-off'}
                  size={20}
                  color={item.isEnabled ? theme.colors.success : theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}

          {item.type === 'stats' && item.data && (
            <StatsWidget data={item.data} />
          )}
          {item.type === 'calendar' && item.data && (
            <CalendarWidget data={item.data} />
          )}
          {item.type === 'placeholder' && (
            <PlaceholderWidget
              title={item.title}
              isPremium={item.isPremium}
              onUpgrade={canUpgrade ? handleUpgrade : undefined}
            />
          )}
        </TouchableOpacity>
      </ScaleDecorator>
    );
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
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    editButton: {
      backgroundColor: isEditMode ? theme.colors.error : theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    editButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    featureLimitInfo: {
      backgroundColor: theme.colors.warning + '20',
      padding: 12,
      marginTop: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    featureLimitText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    content: {
      flex: 1,
    },
    widgetContainer: {
      position: 'relative',
    },
    activeWidget: {
      opacity: 0.8,
      transform: [{ scale: 0.95 }],
    },
    editControls: {
      position: 'absolute',
      top: 8,
      right: 8,
      flexDirection: 'row',
      gap: 8,
      zIndex: 10,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 4,
    },
    dragHandle: {
      padding: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 6,
    },
    toggleButton: {
      padding: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 6,
    },
    scrollContent: {
      padding: 16,
    },
  });

  if (isEditMode) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Edit Dashboard</Text>
              <Text style={styles.subtitle}>Drag to reorder, tap eye to toggle</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditMode(false)}
            >
              <Ionicons name="checkmark" size={16} color="white" />
              <Text style={styles.editButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          {availableFeatures !== -1 && (
            <View style={styles.featureLimitInfo}>
              <Text style={styles.featureLimitText}>
                {enabledWidgets.length} of {availableFeatures} features enabled
              </Text>
            </View>
          )}
        </View>

        <DraggableFlatList
          data={widgets}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id}
          renderItem={renderWidget}
          contentContainerStyle={styles.scrollContent}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
            <Text style={styles.subtitle}>Welcome to your dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditMode(true)}
          >
            <Ionicons name="create" size={16} color="white" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {user?.subscriptionTier === 'free' && (
          <View style={styles.featureLimitInfo}>
            <Text style={styles.featureLimitText}>
              Free Plan: {enabledWidgets.length}/4 features enabled
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {enabledWidgets.map((widget) => (
          <View key={widget.id} style={styles.widgetContainer}>
            {widget.type === 'stats' && widget.data && (
              <StatsWidget data={widget.data} />
            )}
            {widget.type === 'calendar' && widget.data && (
              <CalendarWidget data={widget.data} />
            )}
            {widget.type === 'placeholder' && (
              <PlaceholderWidget
                title={widget.title}
                isPremium={widget.isPremium}
                onUpgrade={user?.subscriptionTier === 'free' && widget.isPremium ? handleUpgrade : undefined}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
