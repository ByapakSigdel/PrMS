import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CalendarEvent {
  title: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

interface CalendarWidgetProps {
  data: {
    events: CalendarEvent[];
  };
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ data }) => {
  const { theme } = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    eventsList: {
      gap: 12,
    },
    eventItem: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    eventContent: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    eventDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    priorityIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 12,
    },
    emptyState: {
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Upcoming Deadlines</Text>
      {data.events.length > 0 ? (
        <View style={styles.eventsList}>
          {data.events.map((event, index) => (
            <View key={index} style={styles.eventItem}>
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
              </View>
              <View
                style={[
                  styles.priorityIndicator,
                  { backgroundColor: getPriorityColor(event.priority) },
                ]}
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No upcoming deadlines</Text>
        </View>
      )}
    </View>
  );
};
