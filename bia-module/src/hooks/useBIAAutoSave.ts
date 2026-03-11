import { useEffect, useRef, useState, useCallback } from 'react';
import { biaService } from '@/services/biaService';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseBIAAutoSaveOptions {
  biaId: number | null;
  formData: any;
  enabled?: boolean;
  autoSaveInterval?: number; // milliseconds
  onSaveSuccess?: (biaId: number) => void;
  onSaveError?: (error: Error) => void;
}

interface UseBIAAutoSaveReturn {
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  saveNow: () => Promise<void>;
  error: Error | null;
}

/**
 * Custom hook for auto-saving BIA wizard progress
 * 
 * Features:
 * - Auto-saves every N seconds (default: 30s)
 * - Saves on form data changes (debounced)
 * - Manual save trigger
 * - Save status tracking
 * - Error handling
 */
export function useBIAAutoSave({
  biaId,
  formData,
  enabled = true,
  autoSaveInterval = 30000, // 30 seconds
  onSaveSuccess,
  onSaveError
}: UseBIAAutoSaveOptions): UseBIAAutoSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  /**
   * Save BIA data to backend
   */
  const saveBIA = useCallback(async () => {
    if (!biaId || isSavingRef.current || !enabled) {
      return;
    }

    // Check if data has changed
    const currentDataStr = JSON.stringify(formData);
    if (currentDataStr === lastSavedDataRef.current) {
      return; // No changes, skip save
    }

    try {
      isSavingRef.current = true;
      setSaveStatus('saving');
      setError(null);

      // Update BIA record
      await biaService.update(biaId, {
        ...formData,
        status: 'DRAFT' // Ensure it stays as draft
      });

      lastSavedDataRef.current = currentDataStr;
      setSaveStatus('saved');
      setLastSavedAt(new Date());
      
      if (onSaveSuccess) {
        onSaveSuccess(biaId);
      }

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save BIA');
      setError(error);
      setSaveStatus('error');
      
      if (onSaveError) {
        onSaveError(error);
      }

      console.error('Auto-save error:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [biaId, formData, enabled, onSaveSuccess, onSaveError]);

  /**
   * Manual save trigger
   */
  const saveNow = useCallback(async () => {
    await saveBIA();
  }, [saveBIA]);

  /**
   * Auto-save on interval
   */
  useEffect(() => {
    if (!enabled || !biaId) {
      return;
    }

    const intervalId = setInterval(() => {
      saveBIA();
    }, autoSaveInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, biaId, autoSaveInterval, saveBIA]);

  /**
   * Debounced save on form data changes
   */
  useEffect(() => {
    if (!enabled || !biaId) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save (5 seconds after last change)
    saveTimeoutRef.current = setTimeout(() => {
      saveBIA();
    }, 5000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, enabled, biaId, saveBIA]);

  /**
   * Save before page unload
   */
  useEffect(() => {
    if (!enabled || !biaId) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const currentDataStr = JSON.stringify(formData);
      if (currentDataStr !== lastSavedDataRef.current) {
        // Trigger synchronous save
        saveBIA();
        
        // Show browser warning
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, biaId, formData, saveBIA]);

  return {
    saveStatus,
    lastSavedAt,
    saveNow,
    error
  };
}

