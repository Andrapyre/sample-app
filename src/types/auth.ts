export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  notifications: {
    userRegistered: boolean;
    tenantRegistered: boolean;
    cameraEvents: boolean;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
}
