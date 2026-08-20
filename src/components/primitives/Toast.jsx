import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

const typeConfig = {
  success: { icon: CheckCircle, bg: 'bg-green-50 border-green-200', text: 'text-green-800', iconColor: 'text-green-500' },
  error: { icon: AlertTriangle, bg: 'bg-red-50 border-red-200', text: 'text-red-800', iconColor: 'text-red-500' },
  info: { icon: Info, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', iconColor: 'text-blue-500' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', iconColor: 'text-amber-500' },
};

export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type] || typeConfig.success;
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up ${config.bg}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
            <p className={`text-sm font-medium ${config.text} flex-1`}>{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className={`${config.text} opacity-60 hover:opacity-100`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
