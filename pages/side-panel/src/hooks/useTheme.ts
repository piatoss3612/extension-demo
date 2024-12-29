import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';

export const useTheme = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  return { isLight, toggle: exampleThemeStorage.toggle };
};
