import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMainStore = defineStore('main', () => {
  const count = ref(0);
  const name = ref('Pinia Store');
  const token = ref(localStorage.getItem('token') || '');

  const increment = () => {
    count.value++;
  };

  const setName = (newName: string) => {
    name.value = newName;
  };

  const login = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    token.value = '';
    localStorage.removeItem('token');
  };

  const isLoggedIn = computed(() => !!token.value);

  const doubleCount = computed(() => count.value * 2);

  return {
    count,
    name,
    increment,
    setName,
    login,
    logout,
    isLoggedIn,
    doubleCount
  };
});