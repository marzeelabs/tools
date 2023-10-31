export {
  changePassword,
  confirmNewPasswordAfterForgotPassword,
  confirmSignUp,
  confirmUserEmail,
  deleteUser,
  deleteUserAttributes,
  forgotPassword,
  signIn,
  signOut,
  signUp,
  updateUserAttributes,
  type UserAttributes
} from './lib/functions';
export { getServerAuth } from './lib/next';
export * from './react/provider';
export type { AmplifyAuthConfig } from './types/amplify';
