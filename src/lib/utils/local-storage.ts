// Local Storage Utility for Resume Data Persistence
import { Resume } from '../types';

const STORAGE_KEYS = {
  RESUME_DATA: 'launch-cv-resume-data',
  USER_PREFERENCES: 'launch-cv-user-preferences',
  SESSION_DATA: 'launch-cv-session-data',
  DRAFT_RESUME: 'launch-cv-draft-resume',
  BACKUP_DATA: 'launch-cv-backup-data',
  LAST_SAVE: 'launch-cv-last-save',
} as const;

export interface UserPreferences {
  selectedTemplateId: string;
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  theme: 'light' | 'dark' | 'auto';
  showTips: boolean;
  soundEffects: boolean;
  animations: boolean;
  lastUsedSections: string[];
  preferredFileName: string;
}

export interface SessionData {
  currentStep: number;
  completedSections: string[];
  timeSpent: number; // in seconds
  lastActivity: string; // ISO date string
  formState: Record<string, any>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  selectedTemplateId: 'classic-professional',
  autoSave: true,
  autoSaveInterval: 30,
  theme: 'auto',
  showTips: true,
  soundEffects: false,
  animations: true,
  lastUsedSections: [],
  preferredFileName: '{resume_title}_{template_name}_{date}',
};

const DEFAULT_SESSION: SessionData = {
  currentStep: 0,
  completedSections: [],
  timeSpent: 0,
  lastActivity: new Date().toISOString(),
  formState: {},
};

class LocalStorageManager {
  private static instance: LocalStorageManager;
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  private checkAvailability(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const testKey = 'launch-cv-test';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('Local storage not available:', error);
      return false;
    }
  }

  private setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable) return false;

    try {
      const serializedValue = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: '1.0',
      });
      
      window.localStorage.setItem(key, serializedValue);
      this.updateLastSave();
      return true;
    } catch (error) {
      console.error('Failed to save to local storage:', error);
      return false;
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable) return defaultValue;

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      
      // Check if data has version and is not too old (30 days)
      if (parsed.timestamp && Date.now() - parsed.timestamp > 30 * 24 * 60 * 60 * 1000) {
        this.removeItem(key);
        return defaultValue;
      }

      return parsed.data || defaultValue;
    } catch (error) {
      console.error('Failed to read from local storage:', error);
      return defaultValue;
    }
  }

  private removeItem(key: string): void {
    if (!this.isAvailable) return;
    
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from local storage:', error);
    }
  }

  private updateLastSave(): void {
    if (this.isAvailable) {
      window.localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
    }
  }

  // Resume Data Methods
  saveResumeData(resume: Resume): boolean {
    const success = this.setItem(STORAGE_KEYS.RESUME_DATA, resume);
    if (success) {
      // Also save as backup with timestamp
      this.setItem(`${STORAGE_KEYS.BACKUP_DATA}-${Date.now()}`, resume);
      this.cleanupOldBackups();
    }
    return success;
  }

  getResumeData(): Resume | null {
    return this.getItem<Resume | null>(STORAGE_KEYS.RESUME_DATA, null);
  }

  saveDraftResume(resume: Partial<Resume>): boolean {
    return this.setItem(STORAGE_KEYS.DRAFT_RESUME, resume);
  }

  getDraftResume(): Partial<Resume> | null {
    return this.getItem<Partial<Resume> | null>(STORAGE_KEYS.DRAFT_RESUME, null);
  }

  clearResumeData(): void {
    this.removeItem(STORAGE_KEYS.RESUME_DATA);
    this.removeItem(STORAGE_KEYS.DRAFT_RESUME);
  }

  // User Preferences Methods
  saveUserPreferences(preferences: Partial<UserPreferences>): boolean {
    const currentPrefs = this.getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
  }

  getUserPreferences(): UserPreferences {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_PREFERENCES);
  }

  resetUserPreferences(): boolean {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_PREFERENCES);
  }

  // Session Data Methods
  saveSessionData(sessionData: Partial<SessionData>): boolean {
    const currentSession = this.getSessionData();
    const updatedSession = { 
      ...currentSession, 
      ...sessionData,
      lastActivity: new Date().toISOString(),
    };
    return this.setItem(STORAGE_KEYS.SESSION_DATA, updatedSession);
  }

  getSessionData(): SessionData {
    return this.getItem(STORAGE_KEYS.SESSION_DATA, DEFAULT_SESSION);
  }

  clearSessionData(): void {
    this.removeItem(STORAGE_KEYS.SESSION_DATA);
  }

  updateTimeSpent(additionalSeconds: number): void {
    const session = this.getSessionData();
    this.saveSessionData({ 
      timeSpent: session.timeSpent + additionalSeconds 
    });
  }

  // Backup and Recovery Methods
  createFullBackup(): string | null {
    if (!this.isAvailable) return null;

    try {
      const backup = {
        resumeData: this.getResumeData(),
        draftResume: this.getDraftResume(),
        userPreferences: this.getUserPreferences(),
        sessionData: this.getSessionData(),
        timestamp: new Date().toISOString(),
        version: '1.0',
      };

      return JSON.stringify(backup);
    } catch (error) {
      console.error('Failed to create backup:', error);
      return null;
    }
  }

  restoreFromBackup(backupString: string): boolean {
    try {
      const backup = JSON.parse(backupString);
      
      if (backup.resumeData) {
        this.saveResumeData(backup.resumeData);
      }
      
      if (backup.draftResume) {
        this.saveDraftResume(backup.draftResume);
      }
      
      if (backup.userPreferences) {
        this.saveUserPreferences(backup.userPreferences);
      }
      
      if (backup.sessionData) {
        this.saveSessionData(backup.sessionData);
      }

      return true;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return false;
    }
  }

  private cleanupOldBackups(): void {
    if (!this.isAvailable) return;

    try {
      const keys = Object.keys(window.localStorage).filter(key => 
        key.startsWith(`${STORAGE_KEYS.BACKUP_DATA}-`)
      );

      // Keep only the last 5 backups
      if (keys.length > 5) {
        const sortedKeys = keys.sort();
        const keysToRemove = sortedKeys.slice(0, keys.length - 5);
        keysToRemove.forEach(key => this.removeItem(key));
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }

  // Storage Info Methods
  getStorageInfo(): {
    available: boolean;
    usage: number;
    quota: number;
    lastSave: string | null;
    itemCount: number;
  } {
    const info = {
      available: this.isAvailable,
      usage: 0,
      quota: 0,
      lastSave: null as string | null,
      itemCount: 0,
    };

    if (!this.isAvailable) return info;

    try {
      // Estimate storage usage
      let totalSize = 0;
      let itemCount = 0;
      
      for (const key in window.localStorage) {
        if (key.startsWith('launch-cv-')) {
          totalSize += window.localStorage[key].length;
          itemCount++;
        }
      }

      info.usage = totalSize;
      info.itemCount = itemCount;
      info.lastSave = window.localStorage.getItem(STORAGE_KEYS.LAST_SAVE);

      // Try to get quota if available
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          info.quota = estimate.quota || 0;
        });
      }
    } catch (error) {
      console.error('Failed to get storage info:', error);
    }

    return info;
  }

  // Clear all LaunchCV data
  clearAllData(): void {
    if (!this.isAvailable) return;

    try {
      const keys = Object.keys(window.localStorage).filter(key => 
        key.startsWith('launch-cv-')
      );
      
      keys.forEach(key => this.removeItem(key));
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }

  // Auto-save functionality
  startAutoSave(callback: () => void): () => void {
    const preferences = this.getUserPreferences();
    
    if (!preferences.autoSave) {
      return () => {}; // Return empty cleanup function
    }

    const intervalId = setInterval(callback, preferences.autoSaveInterval * 1000);
    
    return () => clearInterval(intervalId);
  }
}

// Export singleton instance
export const localStorage = LocalStorageManager.getInstance();

// Export utility functions
export const createStorageBackup = (): string | null => {
  return localStorage.createFullBackup();
};

export const restoreStorageBackup = (backup: string): boolean => {
  return localStorage.restoreFromBackup(backup);
};

export const isStorageAvailable = (): boolean => {
  return localStorage.getStorageInfo().available;
};

export const getStorageUsage = () => {
  const info = localStorage.getStorageInfo();
  return {
    ...info,
    usageKB: Math.round(info.usage / 1024),
    quotaKB: Math.round(info.quota / 1024),
    usagePercent: info.quota > 0 ? Math.round((info.usage / info.quota) * 100) : 0,
  };
};