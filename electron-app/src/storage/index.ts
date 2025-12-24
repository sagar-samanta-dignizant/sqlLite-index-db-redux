import { userRepository } from './repositories/userRepository';
import { spaceRepository } from './repositories/spaceRepository';
import { isElectron } from './utils';

// Unified Storage API facade
export const storageAPI = {
  users: userRepository,
  spaces: spaceRepository,

  // Wrapper for backward compatibility or direct access if needed
  getUsers: userRepository.getAll,
  saveUsers: userRepository.save,
  clearUsers: userRepository.clear,

  getSpaces: spaceRepository.getAll,
  saveSpaces: spaceRepository.save,
  clearSpaces: spaceRepository.clear,
  
  isElectron
};
