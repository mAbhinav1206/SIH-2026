import { Wifi, WifiOff, CloudOff } from 'lucide-react';

export default function ConnectivityIndicator({ isOnline, queueCount }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isOnline
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline</span>
          {queueCount > 0 && (
            <span className="flex items-center gap-0.5 ml-1">
              <CloudOff className="w-3 h-3" />
              {queueCount} queued
            </span>
          )}
        </>
      )}
    </div>
  );
}
