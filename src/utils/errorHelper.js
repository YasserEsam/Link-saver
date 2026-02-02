export const getFriendlyErrorMessage = (errorCode, t) => {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return t('err_invalid_login');
    case 'auth/user-not-found':
      return t('err_user_not_found');
    case 'auth/email-already-in-use':
      return t('err_email_exists');
    case 'auth/weak-password':
      return t('err_weak_pass');
    case 'auth/invalid-email':
      return t('err_invalid_login');
    default:
      return t('err_generic');
  }
};
