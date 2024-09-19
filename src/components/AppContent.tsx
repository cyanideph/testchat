import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { ChatRoom } from './chat/ChatRoom';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { CommunityFeed } from './community/CommunityFeed';
import { UserDirectory } from './community/UserDirectory';
import { EventCalendar } from './community/EventCalendar';
import { ThemeSwitcher } from './ThemeSwitcher';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('chat');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="tabs tabs-boxed mb-4">
              <a
                className={`tab ${activeTab === 'login' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </a>
              <a
                className={`tab ${activeTab === 'register' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </a>
            </div>
            {activeTab === 'login' ? <Login /> : <Register />}
          </div>
        </main>
        <ThemeSwitcher />
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Header />
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'chat' && <ChatRoom />}
          {activeTab === 'community' && <CommunityFeed />}
          {activeTab === 'users' && <UserDirectory />}
          {activeTab === 'events' && <EventCalendar />}
        </div>
        <ThemeSwitcher />
      </div>
      <Sidebar setActiveTab={setActiveTab} />
    </div>
  );
}