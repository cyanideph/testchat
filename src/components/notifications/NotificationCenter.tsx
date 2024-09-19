import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { useAuth } from '../../hooks/useAuth';

interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationCenterProps {
  onClose: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const database = getDatabase();

  useEffect(() => {
    if (user) {
      const notificationsRef = ref(database, `notifications/${user.uid}`);
      const unsubscribe = onValue(notificationsRef, (snapshot) => {
        const notificationsData = snapshot.val();
        const notificationsArray = Object.entries(notificationsData || {}).map(([id, notificationData]: [string, any]) => ({
          id,
          ...notificationData,
        }));
        setNotifications(notificationsArray);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [database, user]);

  const markAsRead = async (notificationId: string) => {
    if (user) {
      const notificationRef = ref(database, `notifications/${user.uid}/${notificationId}`);
      await update(notificationRef, { read: true });
    }
  };

  const markAllAsRead = async () => {
    if (user) {
      const updates: { [key: string]: boolean } = {};
      notifications.forEach((notification) => {
        if (!notification.read) {
          updates[`notifications/${user.uid}/${notification.id}/read`] = true;
        }
      });
      await update(ref(database), updates);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h3 className="text-lg font-bold mb-4">Notifications</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${notification.read ? 'bg-base-200' : 'bg-primary text-primary-content'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <p>{notification.message}</p>
                <p className="text-sm opacity-70">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-between">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={markAllAsRead}>Mark All as Read</button>
        </div>
      </div>
    </div>
  );
}