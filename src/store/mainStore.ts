import { defineStore } from 'pinia';
import { ref, computed} from 'vue';
import type { Exam, UserRole } from '~/types';

export const useMainStore = defineStore('main', () => {
  const token = ref<string>(localStorage.getItem('token') || '');
  const userRole = ref<UserRole|"">(localStorage.getItem('userRole') as UserRole || '');
  const isDarkMode = ref<boolean>(false); // Add isDarkMode state
  const examData = ref<Exam[]>([]); // Add examData state

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
  const addExamData = (data: Exam) => {
    examData.value.push(data);
  };
  const deleteExamData = (index: number) => {
    examData.value.splice(index, 1);
  }

  const isLoggedIn = computed(() => !!token.value);

  return {
    token,
    userRole,
    isDarkMode,
    login,
    logout,
    setDarkMode,
    isLoggedIn,
    examData,
    addExamData,
    deleteExamData
  };
});