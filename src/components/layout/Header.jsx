import { Shield, LogOut, Menu, X } from 'lucide-react';
import ConnectivityIndicator from '../primitives/ConnectivityIndicator';

export default function Header({ user, isOnline, queueCount, onLogout, onMenuToggle, menuOpen }) {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-clinical-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-text-primary leading-none">Silico-shield</h1>
              <p className="text-[10px] text-text-muted">AI-Assisted OLD Screening</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ConnectivityIndicator isOnline={isOnline} queueCount={queueCount} />
          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs font-medium text-text-primary">{user.name}</p>
                <p className="text-[10px] text-text-muted capitalize">{user.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-clinical-100 flex items-center justify-center text-clinical-700 text-xs font-bold">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>
          )}
          {user && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
