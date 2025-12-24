import { registerUserHandlers } from './users';
import { registerSpaceHandlers } from './spaces';

export function registerIpcHandlers() {
  registerUserHandlers();
  registerSpaceHandlers();
}
