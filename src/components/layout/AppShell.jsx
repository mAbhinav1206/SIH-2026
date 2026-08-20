import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppShell({ user, isOnline, queueCount, onLogout, currentScreen, onNavigate, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Header
        user={user}
        isOnline={isOnline}
        queueCount={queueCount}
        onLogout={onLogout}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        menuOpen={menuOpen}
      />
      <Sidebar
        role={user.role}
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <main className="lg:ml-60 min-h-[calc(100vh-3.5rem)]">
        <div className="p-4 sm:p-6 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
