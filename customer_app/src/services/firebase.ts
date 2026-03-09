/**
 * firebase.ts
 *
 * Uses @react-native-firebase/auth (v22+ modular API) for phone authentication.
 * The native SDK uses SafetyNet / Play Integrity for app verification — 
 * no Recaptcha verifier needed, real SMS OTPs are sent to real numbers.
 */
import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  signInWithPhoneNumber as _signInWithPhoneNumber,
} from '@react-native-firebase/auth';

// Get the default Firebase app and auth instance using the new modular API
const app = getApp();
const auth = getAuth(app);

// Wrapper to keep usage simple in AuthContext
const signInWithPhoneNumber = (phoneNumber: string) =>
  _signInWithPhoneNumber(auth, phoneNumber);

// ConfirmationResult type from the native SDK
type ConfirmationResult = Awaited<ReturnType<typeof signInWithPhoneNumber>>;

export { auth, signInWithPhoneNumber };
export type { ConfirmationResult };