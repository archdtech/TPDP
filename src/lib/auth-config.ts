/**
 * Authentication Configuration
 * 
 * This file contains the configuration for password protection
 * and other authentication-related settings.
 */

export const AUTH_CONFIG = {
  // Password for accessing the dashboard
  // Change this to your desired password
  PASSWORD: process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "venture2024",
  
  // Session timeout in milliseconds (default: 24 hours)
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
  
  // Enable/disable password protection
  // Set to false to disable password protection (not recommended for production)
  ENABLED: false,
  
  // Custom authentication message
  LOGIN_MESSAGE: "Enter your password to access the Venture Studio Dashboard",
  
  // Custom logout message
  LOGOUT_MESSAGE: "You have been successfully logged out",
  
  // Remember me functionality
  REMEMBER_ME_ENABLED: true,
  
  // Maximum login attempts
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Lockout duration in milliseconds (default: 15 minutes)
  LOCKOUT_DURATION: 15 * 60 * 1000,
  
  // Password requirements
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false
  }
};

// Helper function to validate password against requirements
export function validatePassword(password: string): boolean {
  const { minLength } = AUTH_CONFIG.PASSWORD_REQUIREMENTS;
  
  if (!password || password.length < minLength) {
    return false;
  }
  
  return true;
}

// Helper function to check if password protection is enabled
export function isPasswordProtectionEnabled(): boolean {
  return AUTH_CONFIG.ENABLED;
}

// Helper function to get the current password
export function getCurrentPassword(): string {
  return AUTH_CONFIG.PASSWORD;
}