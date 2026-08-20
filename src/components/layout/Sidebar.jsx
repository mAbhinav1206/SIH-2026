import {
  LayoutDashboard,
  UserPlus,
  ClipboardList,
  Image,
  Stethoscope,
  GitBranch,
  FolderCheck,
  Activity,
  BarChart3,
} from 'lucide-react';

const roleMenus = {
  worker: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'register', label: 'Register Worker', icon: UserPlus },
    { id: 'screening', label: 'New Screening', icon: ClipboardList },
    { id: 'cases', label: 'My Cases', icon: Activity },
  ],
  doctor: [
    { id: 'worklist', label: 'Worklist', icon: Stethoscope },
    { id: 'cases', label: 'Case Tracking', icon: Activity },
  ],
  admin: [
    { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'worklist', label: 'Doctor Worklist', icon: Stethoscope },
    { id: 'cases', label: 'Case Tracking', icon: Activity },
    { id: 'compensation', label: 'Compensation', icon: FolderCheck },
  ],
};

export default function Sidebar({ role, currentScreen, onNavigate, isOpen, onClose }) {
  const menuItems = roleMenus[role] || roleMenus.worker;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-14 left-0 bottom-0 w-60 bg-white border-r border-border z-30 transform transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-clinical-50 text-clinical-700'
                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
