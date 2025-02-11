import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { NotificationState, Notification } from '../types';
import { notificationReducer } from './notificationReducer';
import { supabase } from '../../../lib/supabase';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
};

interface NotificationContextType extends NotificationState {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Bildirimleri yükle
  const loadNotifications = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_START' });
      
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      dispatch({ 
        type: 'FETCH_SUCCESS', 
        payload: notifications.map(n => ({
          ...n,
          createdAt: new Date(n.created_at)
        }))
      });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, []);

  // Bildirimi okundu olarak işaretle
  const markAsRead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'MARK_AS_READ', payload: id });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  }, []);

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;

      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  }, []);

  // Bildirimi sil
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  }, []);

  // Tüm bildirimleri temizle
  const clearAllNotifications = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .not('id', 'is', null);

      if (error) throw error;

      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  }, []);

  // Realtime subscription
  React.useEffect(() => {
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications' 
      }, payload => {
        switch (payload.eventType) {
          case 'INSERT':
            dispatch({ 
              type: 'ADD_NOTIFICATION', 
              payload: {
                ...payload.new,
                createdAt: new Date(payload.new.created_at)
              }
            });
            break;
          case 'UPDATE':
            dispatch({ 
              type: 'UPDATE_NOTIFICATION', 
              payload: {
                ...payload.new,
                createdAt: new Date(payload.new.created_at)
              }
            });
            break;
          case 'DELETE':
            dispatch({ 
              type: 'DELETE_NOTIFICATION', 
              payload: payload.old.id 
            });
            break;
        }
      })
      .subscribe();

    // Initial load
    loadNotifications();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadNotifications]);

  return (
    <NotificationContext.Provider 
      value={{ 
        ...state,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};