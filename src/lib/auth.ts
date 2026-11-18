import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password,
  );

  await updateProfile(credential.user, {
    displayName: name.trim(),
  });

  return credential.user;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password,
  );

  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

/** Firebase sends the reset email; the reset page itself is hosted by Firebase. */
export async function requestPasswordReset(email: string) {
  auth.languageCode = "ar";
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}
