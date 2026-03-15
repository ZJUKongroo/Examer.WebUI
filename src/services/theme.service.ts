import { watch } from "vue";
import { useTheme } from "vuetify";
import { useMainStore } from "~/store/mainStore";

export function syncSystemTheme(): void {
  const store = useMainStore();
  const htmlNode = document.documentElement;

  const updateTheme = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      htmlNode.classList.add("dark");
      store.setDarkMode(true);
    } else {
      htmlNode.classList.remove("dark");
      store.setDarkMode(false);
    }
  };

  updateTheme();
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", updateTheme);
}

export function syncVuetifyTheme(): void {
  const theme = useTheme();
  const store = useMainStore();

  const setVuetifyTheme = (isDarkMode: boolean) => {
    theme.global.name.value = isDarkMode ? "dark" : "light";
  };

  setVuetifyTheme(store.isDarkMode);

  watch(
    () => store.isDarkMode,
    (isDarkMode) => {
      setVuetifyTheme(isDarkMode);
    }
  );
}

export const useDarkMode = syncSystemTheme;
export const useVuetifyDarkmode = syncVuetifyTheme;
