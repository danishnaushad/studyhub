export function getAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  
  switch (code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/missing-password':
      return 'Please enter your password.';
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    default:
      return error?.message || 'An unexpected authentication error occurred. Please try again.';
  }
}
