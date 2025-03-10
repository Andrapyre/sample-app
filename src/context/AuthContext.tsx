import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthState, UserProfile } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (user: Partial<UserProfile>) => void;
  updateNotificationSettings: (
    settings: Partial<UserProfile["notifications"]>,
  ) => void;
}

const defaultUser: UserProfile = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  notifications: {
    userRegistered: true,
    tenantRegistered: true,
    cameraEvents: true,
  },
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => false,
  logout: () => {},
  updateUserProfile: () => {},
  updateNotificationSettings: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(savedUser),
          loading: false,
        });
      } else {
        setAuthState({
          ...initialState,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    try {
      // For demo purposes, always succeed with default user
      setAuthState({
        isAuthenticated: true,
        user: defaultUser,
        loading: false,
      });
      localStorage.setItem("user", JSON.stringify(defaultUser));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    localStorage.removeItem("user");
  };

  const updateUserProfile = (userData: Partial<UserProfile>) => {
    if (!authState.user) return;

    const updatedUser = {
      ...authState.user,
      ...userData,
    };

    setAuthState({
      ...authState,
      user: updatedUser,
    });

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateNotificationSettings = (
    settings: Partial<UserProfile["notifications"]>,
  ) => {
    if (!authState.user) return;

    const updatedUser = {
      ...authState.user,
      notifications: {
        ...authState.user.notifications,
        ...settings,
      },
    };

    setAuthState({
      ...authState,
      user: updatedUser,
    });

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateUserProfile,
        updateNotificationSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
