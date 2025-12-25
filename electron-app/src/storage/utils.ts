export const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
};

export const createPlatformRepository = <T>(electronImpl: T, webImpl: T): T => {
  return isElectron() ? electronImpl : webImpl;
};
