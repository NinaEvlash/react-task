export type PasswordStrength = {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

export const getPasswordStrength = (password: string): PasswordStrength => ({
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecial: /[^A-Za-z0-9]/.test(password),
});
