import { defineStore } from 'pinia';
import { ref, computed} from 'vue';
import { UserRole } from '~/enums';
import type { Exam, LoginCredientialDto } from '~/types';
import { useRouter } from 'vue-router';
import { getSecureItem, setSecureItem } from '~/ts/encrypt';
import { getExamList } from '~/api';
import { handleApiError } from '~/api/error';

export const useMainStore = defineStore('main', () => {
  const token = ref<string>(getSecureItem('token') || '');
  const userRole = ref<UserRole|null>(getSecureItem('userRole')?Number(getSecureItem('userRole')) as UserRole:null);
  const userId = ref<string>(getSecureItem('userId') || '');
  const expirationTime = ref<Date>(new Date(getSecureItem('expirationTime') || '1970-01-01'));
  const isDarkMode = ref<boolean>(false); // Add isDarkMode state
  const examData = ref<Exam[]>([]); // Add examData state
  const router = useRouter();
  const loading = ref(true);

  

  const login = (data: LoginCredientialDto) => {
    token.value = data.token;
    userRole.value = data.role;
    expirationTime.value = new Date(data.expirationTime);
    userId.value = data.userId;
    setSecureItem('token', data.token);
    setSecureItem('userRole', data.role.toString());
    setSecureItem('expirationTime', data.expirationTime);
    setSecureItem('userId', data.userId);
  };

  const logout = () => {
    token.value = '';
    userRole.value = UserRole.User;
    expirationTime.value = new Date();
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('expirationTime');
    router.push('/login')
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

  const refreshExamData = async () => {
    // Fetch exam data from the server
    if(isLoggedIn.value) {
      loading.value = true;
      try {
        const response = await getExamList();
        examData.value = response.data;
      } catch (error) {
        handleApiError(error, { fallbackMessage: "获取考试数据失败" });
      }finally{
        loading.value = false;
      }
    }
  }

  return {
    loading,
    token,
    userRole,
    userId,
    expirationTime,
    isDarkMode,
    login,
    logout,
    setDarkMode,
    isLoggedIn,
    examData,
    addExamData,
    deleteExamData,
    refreshExamData
  };
});