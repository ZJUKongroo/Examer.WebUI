import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { UserRole } from '~/types';

export const useMainStore = defineStore('main', () => {
  const token = ref(localStorage.getItem('token') || '');
  const userRole = ref(localStorage.getItem('userRole') || '');
  const isDarkMode = ref(false); // Add isDarkMode state

  const login = (newToken: string, role: UserRole) => {
    token.value = newToken;
    userRole.value = role;
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    token.value = '';
    userRole.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value;
  };

  const isLoggedIn = computed(() => !!token.value);

  return {
    token,
    userRole,
    isDarkMode,
    login,
    logout,
    setDarkMode,
    isLoggedIn,
  };
});