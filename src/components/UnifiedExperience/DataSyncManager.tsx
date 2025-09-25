"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sync, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Database,
  Cloud,
  Server,
  Smartphone,
  Monitor,
  Activity,
  Clock,
  Zap,
  Shield,
  Info,
  X
} from 'lucide-react';

interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  entityId: string;
  data: any;
  timestamp: string;
  source: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  error?: string;
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: string;
  pendingEvents: number;
  syncInProgress: boolean;
  syncError: string | null;
  syncSpeed: number; // events per second
}

interface DataSyncContextType {
  syncStatus: SyncStatus;
  syncEvents: SyncEvent[];
  addSyncEvent: (event: Omit<SyncEvent, 'id' | 'timestamp' | 'status'>) => void;
  syncNow: () => Promise<void>;
  clearFailedEvents: () => void;
  retryFailedEvents: () => Promise<void>;
  getEntityData: (entity: string, entityId: string) => any;
  subscribeToEntity: (entity: string, entityId: string, callback: (data: any) => void) => () => void;
}

const DataSyncContext = createContext<DataSyncContextType | null>(null);

export const useDataSync = () => {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSync must be used within DataSyncProvider');
  }
  return context;
};

interface DataSyncProviderProps {
  children: ReactNode;
  userId: string;
}

interface EntityCache {
  [entity: string]: {
    [entityId: string]: {
      data: any;
      lastUpdated: string;
      subscribers: Set<(data: any) => void>;
    };
  };
}

export function DataSyncProvider({ children, userId }: DataSyncProviderProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: new Date().toISOString(),
    pendingEvents: 0,
    syncInProgress: false,
    syncError: null,
    syncSpeed: 0
  });

  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([]);
  const [entityCache, setEntityCache] = useState<EntityCache>({});
  const [showSyncStatus, setShowSyncStatus] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      // Auto-sync when coming back online
      syncNow();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync pending events
  useEffect(() => {
    const interval = setInterval(() => {
      if (syncStatus.isOnline && syncEvents.filter(e => e.status === 'pending').length > 0) {
        syncNow();
      }
    }, 30000); // Try to sync every 30 seconds

    return () => clearInterval(interval);
  }, [syncStatus.isOnline, syncEvents]);

  const addSyncEvent = useCallback((event: Omit<SyncEvent, 'id' | 'timestamp' | 'status'>) => {
    const newEvent: SyncEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setSyncEvents(prev => [...prev, newEvent]);
    setSyncStatus(prev => ({ ...prev, pendingEvents: prev.pendingEvents + 1 }));

    // Update local cache immediately
    updateEntityCache(event.entity, event.entityId, event.data);

    // Try to sync immediately if online
    if (syncStatus.isOnline && !syncStatus.syncInProgress) {
      syncNow();
    }
  }, [syncStatus.isOnline, syncStatus.syncInProgress]);

  const syncNow = useCallback(async () => {
    if (syncStatus.syncInProgress) return;

    const pendingEvents = syncEvents.filter(e => e.status === 'pending');
    if (pendingEvents.length === 0) return;

    setSyncStatus(prev => ({ ...prev, syncInProgress: true, syncError: null }));

    try {
      const startTime = Date.now();
      let syncedCount = 0;

      // Process events in batches
      for (const event of pendingEvents) {
        // Update event status to syncing
        setSyncEvents(prev => 
          prev.map(e => e.id === event.id ? { ...e, status: 'syncing' } : e)
        );

        try {
          // Simulate API call - in real implementation, this would be actual API calls
          await simulateApiCall(event);
          
          // Update event status to completed
          setSyncEvents(prev => 
            prev.map(e => e.id === event.id ? { ...e, status: 'completed' } : e)
          );
          
          syncedCount++;
        } catch (error) {
          // Update event status to failed
          setSyncEvents(prev => 
            prev.map(e => e.id === event.id ? { 
              ...e, 
              status: 'failed', 
              error: error instanceof Error ? error.message : 'Unknown error' 
            } : e)
          );
        }
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const syncSpeed = Math.round(syncedCount / duration);

      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        lastSync: new Date().toISOString(),
        pendingEvents: syncEvents.filter(e => e.status === 'pending').length,
        syncSpeed
      }));

      // Clean up completed events older than 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      setSyncEvents(prev => 
        prev.filter(e => !(e.status === 'completed' && e.timestamp < oneHourAgo))
      );

    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        syncError: error instanceof Error ? error.message : 'Sync failed'
      }));
    }
  }, [syncEvents, syncStatus.syncInProgress]);

  const clearFailedEvents = useCallback(() => {
    setSyncEvents(prev => prev.filter(e => e.status !== 'failed'));
    setSyncStatus(prev => ({ ...prev, pendingEvents: prev.filter(e => e.status === 'pending').length }));
  }, []);

  const retryFailedEvents = useCallback(async () => {
    const failedEvents = syncEvents.filter(e => e.status === 'failed');
    
    // Reset failed events to pending
    setSyncEvents(prev => 
      prev.map(e => e.status === 'failed' ? { ...e, status: 'pending', error: undefined } : e)
    );

    // Trigger sync
    await syncNow();
  }, [syncEvents, syncNow]);

  const updateEntityCache = useCallback((entity: string, entityId: string, data: any) => {
    setEntityCache(prev => {
      const existing = prev[entity]?.[entityId];
      
      return {
        ...prev,
        [entity]: {
          ...prev[entity],
          [entityId]: {
            data: { ...existing?.data, ...data },
            lastUpdated: new Date().toISOString(),
            subscribers: existing?.subscribers || new Set()
          }
        }
      };
    });

    // Notify subscribers
    const subscribers = entityCache[entity]?.[entityId]?.subscribers;
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }, [entityCache]);

  const getEntityData = useCallback((entity: string, entityId: string) => {
    return entityCache[entity]?.[entityId]?.data;
  }, [entityCache]);

  const subscribeToEntity = useCallback((entity: string, entityId: string, callback: (data: any) => void) => {
    setEntityCache(prev => {
      const existing = prev[entity]?.[entityId];
      
      return {
        ...prev,
        [entity]: {
          ...prev[entity],
          [entityId]: {
            data: existing?.data || {},
            lastUpdated: existing?.lastUpdated || new Date().toISOString(),
            subscribers: new Set([...(existing?.subscribers || []), callback])
          }
        }
      };
    });

    // Return unsubscribe function
    return () => {
      setEntityCache(prev => {
        const existing = prev[entity]?.[entityId];
        if (!existing) return prev;

        const newSubscribers = new Set(existing.subscribers);
        newSubscribers.delete(callback);

        return {
          ...prev,
          [entity]: {
            ...prev[entity],
            [entityId]: {
              ...existing,
              subscribers: newSubscribers
            }
          }
        };
      });
    };
  }, []);

  // Simulate API call
  const simulateApiCall = (event: SyncEvent): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Network error'));
        }
      }, 100 + Math.random() * 400); // Random delay between 100-500ms
    });
  };

  const contextValue: DataSyncContextType = {
    syncStatus,
    syncEvents,
    addSyncEvent,
    syncNow,
    clearFailedEvents,
    retryFailedEvents,
    getEntityData,
    subscribeToEntity
  };

  return (
    <DataSyncContext.Provider value={contextValue}>
      {children}
      
      {/* Sync Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <div
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              syncStatus.isOnline 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={() => setShowSyncStatus(!showSyncStatus)}
            title={syncStatus.isOnline ? 'Online' : 'Offline'}
          >
            {syncStatus.isOnline ? (
              <Wifi className="h-4 w-4 text-white" />
            ) : (
              <WifiOff className="h-4 w-4 text-white" />
            )}
          </div>

          {/* Sync Activity */}
          {syncStatus.syncInProgress && (
            <div className="p-2 bg-blue-500 rounded-full animate-pulse">
              <RefreshCw className="h-4 w-4 text-white" />
            </div>
          )}

          {/* Pending Events */}
          {syncStatus.pendingEvents > 0 && (
            <div className="p-2 bg-yellow-500 rounded-full cursor-pointer" onClick={() => setShowSyncStatus(true)}>
              <div className="h-4 w-4 text-white text-xs flex items-center justify-center font-bold">
                {syncStatus.pendingEvents}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sync Status Panel */}
      {showSyncStatus && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-96">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sync className="h-5 w-5" />
                  Sync Status
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowSyncStatus(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Connection Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {syncStatus.isOnline ? (
                    <Wifi className="h-4 w-4 text-green-600" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {syncStatus.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <Badge variant={syncStatus.isOnline ? 'default' : 'destructive'}>
                  {syncStatus.isOnline ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>

              {/* Sync Progress */}
              {syncStatus.syncInProgress && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Syncing...</span>
                    <span>{syncStatus.syncSpeed} events/sec</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              )}

              {/* Last Sync */}
              <div className="flex items-center justify-between text-sm">
                <span>Last Sync:</span>
                <span>{new Date(syncStatus.lastSync).toLocaleTimeString()}</span>
              </div>

              {/* Pending Events */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Events:</span>
                <Badge variant={syncStatus.pendingEvents > 0 ? 'destructive' : 'secondary'}>
                  {syncStatus.pendingEvents}
                </Badge>
              </div>

              {/* Sync Error */}
              {syncStatus.syncError && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{syncStatus.syncError}</AlertDescription>
                </Alert>
              )}

              {/* Recent Events */}
              <div>
                <h4 className="text-sm font-medium mb-2">Recent Events</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {syncEvents.slice(-5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {event.status === 'completed' && <CheckCircle className="h-3 w-3 text-green-600" />}
                        {event.status === 'failed' && <AlertTriangle className="h-3 w-3 text-red-600" />}
                        {event.status === 'syncing' && <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />}
                        {event.status === 'pending' && <Clock className="h-3 w-3 text-yellow-600" />}
                        <span className="capitalize">{event.type}</span>
                        <span className="text-gray-600">{event.entity}</span>
                      </div>
                      <span className="text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={syncNow} 
                  disabled={syncStatus.syncInProgress || syncStatus.pendingEvents === 0}
                  className="flex-1"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync Now
                </Button>
                {syncEvents.some(e => e.status === 'failed') && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={retryFailedEvents}
                    disabled={syncStatus.syncInProgress}
                  >
                    Retry Failed
                  </Button>
                )}
                {syncEvents.some(e => e.status === 'failed') && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={clearFailedEvents}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DataSyncContext.Provider>
  );
}

// Hook for easy data synchronization
export function useSyncedData<T>(entity: string, entityId: string, initialData: T) {
  const { getEntityData, subscribeToEntity, addSyncEvent } = useDataSync();
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    // Get initial data from cache
    const cachedData = getEntityData(entity, entityId);
    if (cachedData) {
      setData(cachedData);
    }

    // Subscribe to updates
    const unsubscribe = subscribeToEntity(entity, entityId, (newData: any) => {
      setData(newData);
    });

    return unsubscribe;
  }, [entity, entityId, getEntityData, subscribeToEntity]);

  const updateData = useCallback((newData: Partial<T>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    
    // Add sync event
    addSyncEvent({
      type: 'update',
      entity,
      entityId,
      data: newData,
      source: 'client'
    });
  }, [data, entity, entityId, addSyncEvent]);

  const createData = useCallback((newData: T) => {
    setData(newData);
    
    // Add sync event
    addSyncEvent({
      type: 'create',
      entity,
      entityId,
      data: newData,
      source: 'client'
    });
  }, [entity, entityId, addSyncEvent]);

  const deleteData = useCallback(() => {
    setData(initialData);
    
    // Add sync event
    addSyncEvent({
      type: 'delete',
      entity,
      entityId,
      data: {},
      source: 'client'
    });
  }, [entity, entityId, addSyncEvent, initialData]);

  return {
    data,
    updateData,
    createData,
    deleteData,
    isCached: !!getEntityData(entity, entityId)
  };
}

// Component for displaying sync status
export function SyncStatusIndicator() {
  const { syncStatus } = useDataSync();

  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <div className={`w-2 h-2 rounded-full ${syncStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span>{syncStatus.isOnline ? 'Online' : 'Offline'}</span>
      {syncStatus.pendingEvents > 0 && (
        <span className="text-yellow-600">
          • {syncStatus.pendingEvents} pending
        </span>
      )}
    </div>
  );
}