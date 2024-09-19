import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuth } from '../../hooks/useAuth';

interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export function UserDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuth();
  const database = getDatabase();

  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const usersArray = Object.entries(usersData || {}).map(([id, userData]: [string, any]) => ({
        id,
        ...userData,
      }));
      setUsers(usersArray);
    });

    return () => {
      unsubscribe();
    };
  }, [database]);

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Directory</h2>
      <input
        type="text"
        placeholder="Search users..."
        className="input input-bordered w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-4">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName}`} alt={user.displayName} />
                  </div>
                </div>
                <div>
                  <h3 className="card-title">{user.displayName}</h3>
                  <p className="text-base-content/70">{user.email}</p>
                </div>
              </div>
              {currentUser && currentUser.uid !== user.id && (
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm">Send Message</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}