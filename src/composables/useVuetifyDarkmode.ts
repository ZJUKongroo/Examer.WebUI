import { watch } from 'vue';
import { useTheme } from 'vuetify';
import { useMainStore } from '~/store/mainStore';

export function useVuetifyDarkmode() {
  const theme = useTheme();
  const store = useMainStore();

  const setVuetifyDarkmode = (isDarkMode: boolean) => {
    theme.global.name.value = isDarkMode ? 'dark' : 'light';
  };

  setVuetifyDarkmode(store.isDarkMode);

  watch(
    () => store.isDarkMode,
    (isDarkMode) => {
      setVuetifyDarkmode(isDarkMode);
    }
  );
}