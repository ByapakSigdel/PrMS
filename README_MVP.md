# PrMS - Project Management System MVP

A React Native mobile application built with Expo for project management with a focus on user experience and customizable dashboards.

## 🚀 MVP Features

### ✅ Implemented Features

#### 1. Authentication System
- **Sign In/Sign Up** with email and password
- **User Type Selection** (Normal/Personal vs Enterprise)
- **Forgot Password** functionality
- **JWT/Session-based authentication** (mock implementation)
- **Secure token storage** using Expo SecureStore

#### 2. Dashboard System
- **Customizable Widget Layout** with drag-and-drop functionality
- **Live Widgets:**
  - 📊 **Stats Overview** - Display key metrics and KPIs
  - 📅 **Calendar Widget** - Show upcoming deadlines and events
- **Placeholder Widgets** for future features:
  - Analytics Dashboard (Premium)
  - Report Generator (Premium)
  - Notifications Center
  - Task Management (Premium)
- **Edit Mode** for rearranging widgets
- **Feature Toggle** - Enable/disable widgets based on subscription

#### 3. Theme System
- **3 Built-in Themes:**
  - Light Theme
  - Dark Theme
  - Ocean Blue Theme
- **Global Theme Application** - Changes apply across the entire app
- **Theme Persistence** - Selected theme saved locally

#### 4. User Management & Subscription Tiers
- **Free Tier:** Access to 4 chosen features
- **Paid Tier:** Unlock more features (simulated)
- **Enterprise:** Unlimited access + custom features
- **Subscription Management** in settings
- **Feature Limitation Enforcement**

#### 5. Settings Screen
- **Profile Management** - View and edit user information
- **Theme Selector** - Choose from available themes
- **Notification Toggle**
- **Subscription Status Display**
- **Sign Out Functionality**

### 🏗️ Architecture

```
app/
├── (auth)/                     # Authentication screens
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   ├── forgot-password.tsx
│   └── _layout.tsx
├── (authenticated)/            # Protected screens
│   ├── (tabs)/
│   │   ├── dashboard.tsx       # Main dashboard
│   │   ├── settings.tsx        # Settings screen
│   │   └── _layout.tsx
│   └── _layout.tsx
├── _layout.tsx                 # Root layout with providers
└── index.tsx                   # Entry point redirect

components/
├── widgets/                    # Dashboard widgets
│   ├── StatsWidget.tsx
│   ├── CalendarWidget.tsx
│   └── PlaceholderWidget.tsx
├── auth/                       # Auth components
└── ui/                         # Reusable UI components

contexts/                       # React Context providers
├── AuthContext.tsx             # Authentication state
├── ThemeContext.tsx            # Theme management
└── DashboardContext.tsx        # Dashboard state

constants/
├── Colors.ts                   # Original color constants
└── Themes.ts                   # Theme definitions

types/
└── index.ts                    # TypeScript type definitions
```

### 🛠️ Technology Stack

- **Frontend:** React Native with Expo
- **Navigation:** Expo Router (file-based routing)
- **State Management:** React Context + Hooks
- **Storage:** 
  - AsyncStorage (user preferences, dashboard layout)
  - Expo SecureStore (authentication tokens)
- **UI Components:** Custom components with theme support
- **Gestures:** React Native Reanimated + Gesture Handler
- **Drag & Drop:** react-native-draggable-flatlist

### 📱 User Experience Flow

1. **First Launch** → Sign In/Sign Up screen
2. **Authentication** → Choose account type (Personal/Enterprise)
3. **Dashboard** → View customizable widget layout
4. **Edit Mode** → Long press to enter edit mode, drag to reorder
5. **Feature Management** → Toggle widgets on/off (respecting tier limits)
6. **Settings** → Customize theme, manage profile, view subscription
7. **Premium Features** → Upgrade prompts for locked features

### 🎯 MVP Deliverables Status

- ✅ **Authentication System** - Complete with user types
- ✅ **Dashboard with 2 Live Widgets** - Stats + Calendar implemented
- ✅ **4 Placeholder Widgets** - Ready for future development
- ✅ **Drag & Drop Layout** - Fully functional with persistence
- ✅ **Settings Page** - Profile, themes, subscription management
- ✅ **Theme System** - 3 themes with global application
- ✅ **Tier System** - Free (4 features), Paid, Enterprise
- ✅ **Upgrade Prompts** - For premium features

### 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm start
   ```

3. **Run on Device:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### 🔐 Demo Credentials

For testing, you can use any email and password combination. The authentication is currently mocked for MVP purposes.

**Test User Types:**
- **Normal User:** Any email, creates free tier account
- **Enterprise User:** Select enterprise during signup

### 🔄 Development Roadmap

#### Phase 2 - Enhanced Features
- [ ] Real backend integration
- [ ] Payment processing (Stripe/PayPal/ESewa)
- [ ] Push notifications
- [ ] Real-time data updates
- [ ] Advanced analytics widgets

#### Phase 3 - Enterprise Features
- [ ] Admin panel
- [ ] Custom widget development
- [ ] Team management
- [ ] Advanced reporting
- [ ] API integrations

### 🤝 Contributing

This is an MVP implementation. For production deployment, consider:

1. **Backend Integration:** Replace mock authentication with real API
2. **Payment Processing:** Implement actual subscription handling
3. **Security:** Add proper JWT validation and refresh tokens
4. **Performance:** Optimize for larger datasets
5. **Testing:** Add comprehensive test suite

### 📄 License

This project is part of a learning/development exercise. Please check with the project owner before commercial use.
