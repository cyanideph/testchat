import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ChatProvider } from './contexts/ChatContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppContent } from './components/AppContent'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}