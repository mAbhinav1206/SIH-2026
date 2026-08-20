import { Check } from 'lucide-react';

export default function ProgressIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-clinical-600 text-white'
                    : isCurrent
                    ? 'bg-clinical-100 text-clinical-700 border-2 border-clinical-600'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`text-[11px] mt-1.5 font-medium text-center hidden sm:block ${
                  isCurrent ? 'text-clinical-700' : isCompleted ? 'text-text-secondary' : 'text-text-muted'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                  isCompleted ? 'bg-clinical-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
