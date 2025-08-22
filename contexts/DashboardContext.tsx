import { DashboardLayout, Widget } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface DashboardContextType {
  widgets: Widget[];
  isLoading: boolean;
  updateWidgetLayout: (widgets: Widget[]) => Promise<void>;
  toggleWidget: (widgetId: string, enabled: boolean) => Promise<void>;
  getAvailableFeatures: () => number;
  isFeatureLimitReached: () => boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

const defaultWidgets: Widget[] = [
  {
    id: 'stats',
    type: 'stats',
    title: 'Stats Overview',
    position: 0,
    isEnabled: true,
    isPremium: false,
    data: {
      totalUsers: 1248,
      activeToday: 89,
      revenue: '$12,450',
      growth: '+15%',
    },
  },
  {
    id: 'calendar',
    type: 'calendar',
    title: 'Upcoming Deadlines',
    position: 1,
    isEnabled: true,
    isPremium: false,
    data: {
      events: [
        { title: 'Project Deadline', date: '2025-08-25', priority: 'high' },
        { title: 'Team Meeting', date: '2025-08-26', priority: 'medium' },
        { title: 'Client Review', date: '2025-08-28', priority: 'high' },
      ],
    },
  },
  {
    id: 'analytics',
    type: 'placeholder',
    title: 'Analytics Dashboard',
    position: 2,
    isEnabled: false,
    isPremium: true,
  },
  {
    id: 'reports',
    type: 'placeholder',
    title: 'Report Generator',
    position: 3,
    isEnabled: false,
    isPremium: true,
  },
  {
    id: 'notifications',
    type: 'placeholder',
    title: 'Notifications Center',
    position: 4,
    isEnabled: false,
    isPremium: false,
  },
  {
    id: 'tasks',
    type: 'placeholder',
    title: 'Task Management',
    position: 5,
    isEnabled: false,
    isPremium: true,
  },
];

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadDashboardLayout();
    }
  }, [user]);

  const loadDashboardLayout = async () => {
    try {
      const layoutData = await AsyncStorage.getItem('dashboard_layout');
      if (layoutData) {
        const layout: DashboardLayout = JSON.parse(layoutData);
        if (layout.userId === user?.id) {
          setWidgets(layout.widgets.sort((a, b) => a.position - b.position));
        }
      }
    } catch (error) {
      console.error('Error loading dashboard layout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWidgetLayout = async (newWidgets: Widget[]) => {
    try {
      if (!user) return;

      const layout: DashboardLayout = {
        userId: user.id,
        widgets: newWidgets,
        lastModified: new Date().toISOString(),
      };

      await AsyncStorage.setItem('dashboard_layout', JSON.stringify(layout));
      setWidgets(newWidgets);
    } catch (error) {
      console.error('Error updating widget layout:', error);
    }
  };

  const toggleWidget = async (widgetId: string, enabled: boolean) => {
    try {
      const updatedWidgets = widgets.map(widget =>
        widget.id === widgetId ? { ...widget, isEnabled: enabled } : widget
      );

      // Check feature limit for free tier
      if (enabled && user?.subscriptionTier === 'free') {
        const enabledCount = updatedWidgets.filter(w => w.isEnabled).length;
        if (enabledCount > 4) {
          throw new Error('Feature limit reached. Upgrade to enable more features.');
        }
      }

      await updateWidgetLayout(updatedWidgets);
    } catch (error) {
      console.error('Error toggling widget:', error);
      throw error;
    }
  };

  const getAvailableFeatures = (): number => {
    if (!user) return 0;
    
    switch (user.subscriptionTier) {
      case 'free':
        return 4;
      case 'paid':
        return 10;
      case 'enterprise':
        return -1; // Unlimited
      default:
        return 4;
    }
  };

  const isFeatureLimitReached = (): boolean => {
    const maxFeatures = getAvailableFeatures();
    if (maxFeatures === -1) return false; // Unlimited
    
    const enabledCount = widgets.filter(w => w.isEnabled).length;
    return enabledCount >= maxFeatures;
  };

  return (
    <DashboardContext.Provider
      value={{
        widgets,
        isLoading,
        updateWidgetLayout,
        toggleWidget,
        getAvailableFeatures,
        isFeatureLimitReached,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
