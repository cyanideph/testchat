import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { Menu, Bell } from 'lucide-react';
import { NotificationCenter } from '../notifications/NotificationCenter';

export function Header() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost drawer-button lg:hidden">
          <Menu className="h-6 w-6" />
        </label>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">UZZAP-BETA</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost" onClick={() => setShowNotifications(!showNotifications)}>
          <Bell className="h-5 w-5" />
        </button>
        {user && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="ring ring-primary ring-offset-base-100 w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName || user.email}`} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
              <li><a>{user.displayName || user.email}</a></li>
              <li><a onClick={handleSignOut}>Logout</a></li>
            </ul>
          </div>
        )}
      </div>
      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
    </div>
  );
}
