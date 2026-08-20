export function SkeletonLine({ width = '100%', height = '16px', className = '' }) {
  return (
    <div
      className={`skeleton rounded ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-border space-y-3">
      <SkeletonLine width="60%" height="20px" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? '40%' : '100%'} height="14px" />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-border space-y-2">
            <SkeletonLine width="50%" height="12px" />
            <SkeletonLine width="30%" height="28px" />
          </div>
        ))}
      </div>
      <SkeletonCard lines={4} />
      <SkeletonCard lines={4} />
    </div>
  );
}
