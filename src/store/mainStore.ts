import axios from '~/ts/request';
import { defineStore } from 'pinia';
import { ref, computed} from 'vue';
import { UserRole } from '~/enums';
import type { Exam } from '~/types';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export const useMainStore = defineStore('main', () => {
  const token = ref<string>(localStorage.getItem('token') || '');
  const userRole = ref<UserRole|null>(localStorage.getItem('userRole')?Number(localStorage.getItem('userRole')) as UserRole:null);
  const userId = ref<string>(localStorage.getItem('userId') || '');
  const expirationTime = ref<Date>(new Date(localStorage.getItem('expirationTime') || ''));
  const isDarkMode = ref<boolean>(false); // Add isDarkMode state
  const examData = ref<Exam[]>([]); // Add examData state
  const router = useRouter();
  const loading = ref(true);

  const login = (data:{
    token: string,
    expirationTime: string,
    role: UserRole,
    userId:string
  }) => {
    token.value = data.token;
    userRole.value = data.role;
    expirationTime.value = new Date(data.expirationTime);
    userId.value = data.userId;
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.role.toString());
    localStorage.setItem('expirationTime', data.expirationTime);
    localStorage.setItem('userId', data.userId);
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
    loading.value = true;
    // Fetch exam data from the server
    try {
      const response = await axios.get<Exam[]>('/Exam');
      examData.value = response.data;
      loading.value = false;
    }catch(err){
      ElMessage.error('Failed to fetch exam data')
    };
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