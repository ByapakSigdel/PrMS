export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  userType: 'normal' | 'enterprise';
  subscriptionTier: 'free' | 'paid' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface Widget {
  id: string;
  type: 'stats' | 'calendar' | 'placeholder';
  title: string;
  position: number;
  isEnabled: boolean;
  isPremium: boolean;
  data?: any;
}

export interface DashboardLayout {
  userId: string;
  widgets: Widget[];
  lastModified: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
}

export interface UserSettings {
  userId: string;
  theme: string;
  notifications: boolean;
  language: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  maxFeatures: number;
  isPopular?: boolean;
}
