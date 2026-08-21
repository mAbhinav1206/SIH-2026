import { useState } from 'react';
import { Shield, Eye, EyeOff, WifiOff } from 'lucide-react';
import ConnectivityIndicator from '../primitives/ConnectivityIndicator';

export default function Login({ onLogin, isOnline, queueCount }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('worker');
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'worker', label: 'Screening Worker / ASHA / ANM', description: 'Field-based screening and registration' },
    { id: 'doctor', label: 'Doctor / Radiologist', description: 'Clinical review and diagnosis' },
    { id: 'admin', label: 'Occupational Health Officer', description: 'Dashboard and administration' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'USR-001',
        name: selectedRole === 'worker' ? 'Priya Patel' : selectedRole === 'doctor' ? 'Dr. Anita Desai' : 'Rajesh Kumar',
        role: selectedRole,
        facility: 'Primary Health Centre, Ambaji',
        district: 'Banaskantha',
        state: 'Gujarat',
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-clinical-50 to-white flex flex-col">
      <div className="absolute top-4 right-4">
        <ConnectivityIndicator isOnline={isOnline} queueCount={queueCount} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-clinical-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Silico-shield</h1>
            <p className="text-sm text-text-secondary mt-1">
              AI-assisted occupational lung disease screening
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-border p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Sign in as</label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                        selectedRole === role.id
                          ? 'border-clinical-500 bg-clinical-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm font-medium text-text-primary">{role.label}</p>
                      <p className="text-xs text-text-secondary">{role.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Worker ID / Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., anm-ambaji@gov.in"
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500 focus:border-clinical-500 placeholder:text-text-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500 focus:border-clinical-500 placeholder:text-text-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-secondary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 active:bg-clinical-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {!isOnline && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-700">
                <WifiOff className="w-4 h-4 flex-shrink-0" />
                <span>You are offline. Some features may be limited. Data will sync when connectivity is restored.</span>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-text-muted mt-6">
            Smart India Hackathon 2026 &middot; Silico-shield v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
