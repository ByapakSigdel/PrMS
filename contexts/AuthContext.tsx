import { AuthState, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    name: string,
    userType: "normal" | "enterprise"
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUser: (patch: Partial<User>) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const userData = await AsyncStorage.getItem("user_data");

      if (token && userData) {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          token,
        });
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateUser = async (patch: Partial<User>): Promise<User | null> => {
    try {
      const token = authState.token;
      if (!token) return null;
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok && data) {
        await AsyncStorage.setItem("user_data", JSON.stringify(data));
        setAuthState((prev) => ({ ...(prev as any), user: data }));
        return data;
      } else {
        console.error(
          "updateUser error:",
          data.message || "Failed to update user"
        );
        return null;
      }
    } catch (error) {
      console.error("updateUser error:", error);
      return null;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    userType: "normal" | "enterprise"
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, userType }),
        }
      );
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        await SecureStore.setItemAsync("auth_token", data.token);
        await AsyncStorage.setItem("user_data", JSON.stringify(data.user));
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          token: data.token,
        });
        return true;
      } else {
        console.error(
          "Sign up error:",
          data.message || "Failed to create account"
        );
        return false;
      }
    } catch (error) {
      console.error("Sign up error:", error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        try {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        } catch {}
      }
      await SecureStore.deleteItemAsync("auth_token");
      await AsyncStorage.removeItem("user_data");
      await AsyncStorage.removeItem("dashboard_layout");
      await AsyncStorage.removeItem("user_settings");

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call - replace with actual password reset
      console.log("Password reset requested for:", email);
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      return false;
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Your sign-in logic here
    return false; // placeholder, replace with real logic
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        updateUser,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
