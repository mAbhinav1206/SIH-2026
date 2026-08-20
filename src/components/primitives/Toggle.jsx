export default function Toggle({ label, checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all duration-200 ${
        checked
          ? 'bg-clinical-50 border-clinical-500 shadow-sm'
          : 'bg-white border-gray-200 hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
    >
      <span className="text-left text-sm font-medium text-text-primary">{label}</span>
      <div
        className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
          checked ? 'bg-clinical-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
