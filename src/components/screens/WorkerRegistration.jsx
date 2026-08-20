import { useState } from 'react';
import { Search, UserPlus, ChevronRight, ChevronLeft, Check, Shield } from 'lucide-react';
import ProgressIndicator from '../primitives/ProgressIndicator';

const STEPS = ['Consent', 'Personal', 'Occupational', 'Exposure'];

export default function WorkerRegistration({ onSubmit, onBack, existingWorkers }) {
  const [step, setStep] = useState(-1); // -1 = dedupe lookup
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formData, setFormData] = useState({
    consent: false,
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    aadhaar: '',
    address: '',
    workplace: '',
    occupation: '',
    yearsExposed: '',
    supervisor: '',
    silica: false,
    asbestos: false,
    coal: false,
    ppe: 'sometimes',
    ventilation: 'poor',
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      const results = existingWorkers.filter(
        (w) =>
          w.name.toLowerCase().includes(query.toLowerCase()) ||
          w.id.toLowerCase().includes(query.toLowerCase()) ||
          w.phone.includes(query)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.consent;
      case 1: return formData.name && formData.age && formData.phone;
      case 2: return formData.workplace && formData.occupation;
      case 3: return true;
      default: return false;
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      id: `WRK-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
    });
  };

  // Dedupe lookup step
  if (step === -1) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <h2 className="text-xl font-bold text-text-primary mb-1">Register Worker</h2>
        <p className="text-sm text-text-secondary mb-6">Search for an existing worker or register a new one.</p>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, Worker ID, or phone number..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500 focus:border-clinical-500 placeholder:text-text-muted"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Existing Workers</p>
            {searchResults.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWorker(w)}
                className="w-full text-left p-4 bg-white rounded-xl border border-border hover:border-clinical-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{w.name}</p>
                    <p className="text-xs text-text-secondary">{w.id} &middot; {w.workplace}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedWorker && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4 animate-slide-up">
            <p className="text-sm font-medium text-blue-800 mb-2">Continue existing worker: {selectedWorker.name}</p>
            <div className="flex gap-2">
              <button
                onClick={() => onBack?.('case-tracking', selectedWorker)}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                View Case
              </button>
              <button
                onClick={() => setSelectedWorker(null)}
                className="py-2.5 px-4 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-secondary px-3 text-text-muted">or</span>
          </div>
        </div>

        <button
          onClick={() => setStep(0)}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Register New Worker
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className="w-full mt-3 py-3 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <ProgressIndicator steps={STEPS} currentStep={step} />

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm min-h-[400px]">
        {/* Step 0: Consent */}
        {step === 0 && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-clinical-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-clinical-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">Informed Consent</h3>
                <p className="text-xs text-text-secondary">Please read before proceeding</p>
              </div>
            </div>

            <div className="p-4 bg-surface-secondary rounded-xl mb-6 space-y-3">
              <p className="text-sm text-text-primary leading-relaxed">
                This screening collects personal and occupational health information to assess your risk for lung diseases including silicosis and tuberculosis.
              </p>
              <p className="text-sm text-text-primary leading-relaxed">
                <strong>Data collected:</strong> Name, contact details, work history, exposure conditions, symptoms, and chest X-ray images.
              </p>
              <p className="text-sm text-text-primary leading-relaxed">
                <strong>How it's used:</strong> AI-assisted analysis supports clinical decision-making. A qualified doctor reviews all findings before any diagnosis or referral. Your data is stored securely and shared only with authorized healthcare providers involved in your care.
              </p>
              <p className="text-sm text-text-primary leading-relaxed">
                <strong>Your rights:</strong> You may request a copy of your records or ask for your data to be corrected at any time.
              </p>
            </div>

            <button
              onClick={() => updateField('consent', !formData.consent)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                formData.consent
                  ? 'bg-clinical-50 border-clinical-500'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${
                  formData.consent ? 'bg-clinical-600 border-clinical-600' : 'border-gray-300'
                }`}
              >
                {formData.consent && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-sm font-medium text-text-primary text-left">
                I have explained the purpose of this screening and the worker has given informed consent.
              </span>
            </button>
          </div>
        )}

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="animate-slide-up space-y-4">
            <h3 className="text-lg font-bold text-text-primary mb-4">Personal Details</h3>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Ramesh Kumar Sharma"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  placeholder="e.g., 42"
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500 bg-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Aadhaar Number (optional)</label>
              <input
                type="text"
                value={formData.aadhaar}
                onChange={(e) => updateField('aadhaar', e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Village/Town, District, State"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Occupational Details */}
        {step === 2 && (
          <div className="animate-slide-up space-y-4">
            <h3 className="text-lg font-bold text-text-primary mb-4">Occupational Details</h3>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Workplace / Mine Name *</label>
              <input
                type="text"
                value={formData.workplace}
                onChange={(e) => updateField('workplace', e.target.value)}
                placeholder="e.g., Ambaji Stone Quarry"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Occupation / Job Role *</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => updateField('occupation', e.target.value)}
                placeholder="e.g., Stone Cutter, Drill Operator"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Years of Exposure</label>
              <input
                type="number"
                value={formData.yearsExposed}
                onChange={(e) => updateField('yearsExposed', e.target.value)}
                placeholder="e.g., 12"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Supervisor Name (optional)</label>
              <input
                type="text"
                value={formData.supervisor}
                onChange={(e) => updateField('supervisor', e.target.value)}
                placeholder="e.g., Mahesh Bhai"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Exposure Assessment */}
        {step === 3 && (
          <div className="animate-slide-up space-y-5">
            <h3 className="text-lg font-bold text-text-primary mb-4">Exposure Conditions</h3>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">Exposure to hazardous substances</label>
              <div className="space-y-2">
                {[
                  { key: 'silica', label: 'Silica dust (stone cutting, quarrying, grinding)' },
                  { key: 'asbestos', label: 'Asbestos fibers' },
                  { key: 'coal', label: 'Coal dust' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => updateField(item.key, !formData[item.key])}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                      formData[item.key]
                        ? 'bg-clinical-50 border-clinical-500'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                        formData[item.key] ? 'bg-clinical-600 border-clinical-600' : 'border-gray-300'
                      }`}
                    >
                      {formData[item.key] && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-text-primary text-left">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">PPE Usage</label>
              <div className="grid grid-cols-3 gap-2">
                {['always', 'sometimes', 'never'].map((val) => (
                  <button
                    key={val}
                    onClick={() => updateField('ppe', val)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                      formData.ppe === val
                        ? 'bg-clinical-50 border-clinical-500 text-clinical-700'
                        : 'bg-white border-gray-200 text-text-secondary hover:border-gray-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Workplace Ventilation</label>
              <div className="grid grid-cols-3 gap-2">
                {['good', 'moderate', 'poor'].map((val) => (
                  <button
                    key={val}
                    onClick={() => updateField('ventilation', val)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                      formData.ventilation === val
                        ? 'bg-clinical-50 border-clinical-500 text-clinical-700'
                        : 'bg-white border-gray-200 text-text-secondary hover:border-gray-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center justify-center gap-1 py-3 px-5 bg-white border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        {step === 0 && (
          <button
            onClick={() => setStep(-1)}
            className="flex items-center justify-center gap-1 py-3 px-5 bg-white border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <button
          onClick={() => (step === STEPS.length - 1 ? handleSubmit() : setStep(step + 1))}
          disabled={!canProceed()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === STEPS.length - 1 ? 'Complete Registration' : 'Continue'}
          {step < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
