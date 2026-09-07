import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  cartCount: 0,

  // Login action
  login: (userData, token) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("token", token); // Fallback key
    localStorage.setItem("user", JSON.stringify(userData));

    set({
      user: userData,
      isLoggedIn: true,
    });
  },

  // Increase cart counter
  incrementCart: (count = 1) => {
    const currentCount = get().cartCount || 0;
    set({ cartCount: currentCount + count });
  },

  // Set cart counter directly
  setCartCount: (count) => {
    set({ cartCount: Number(count) || 0 });
  },

  // Logout action
  logout: () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      set({
        user: null,
        isLoggedIn: false,
        cartCount: 0,
      });
    }
  },

  // Restore login session after refresh
  initializeAuth: () => {
    const token =
      localStorage.getItem("userToken") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        set({
          isLoggedIn: true,
          user: parsedUser,
        });
      } catch {
        // If storedUser is just a plain string (e.g. email)
        set({
          isLoggedIn: true,
          user: storedUser,
        });
      }
    }
  },
}));

export default useAuthStore;