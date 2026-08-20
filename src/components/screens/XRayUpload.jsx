import { useState, useRef } from 'react';
import { Upload, Camera, Image, Check, X, AlertTriangle, Loader2, Send, ArrowRight } from 'lucide-react';
import RiskBadge from '../primitives/RiskBadge';
import { RISK_LEVELS } from '../../data/mockData';

export default function XRayUpload({ worker, onComplete, onBack }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quality, setQuality] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setQuality(null);
      setResult(null);
      // Simulate quality check
      setTimeout(() => {
        const qualities = ['Good', 'Acceptable', 'Poor'];
        const q = qualities[Math.floor(Math.random() * 2)]; // bias toward good/acceptable
        setQuality(q);
      }, 1000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleCameraCapture = () => {
    // Simulate camera capture with a sample image
    setFile({ name: 'chest-xray-capture.jpg', type: 'image/jpeg' });
    setPreview('data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23e2e8f0" width="400" height="400"/><text x="200" y="200" font-family="sans-serif" font-size="14" fill="%2364748b" text-anchor="middle" dy=".3em">Chest X-ray Image</text></svg>`));
    setQuality(null);
    setResult(null);
    setTimeout(() => {
      setQuality('Good');
    }, 1000);
  };

  const runAIScreening = () => {
    setProcessing(true);
    setTimeout(() => {
      setResult({
        silicosis: {
          status: worker?.riskLevel === RISK_LEVELS.HIGH ? 'Suspicious' : worker?.riskLevel === RISK_LEVELS.MODERATE ? 'Findings consistent with early pneumoconiosis' : 'No suspicious findings',
          details: worker?.riskLevel === RISK_LEVELS.HIGH
            ? 'Bilateral upper zone opacities consistent with pneumoconiosis. Small rounded opacities (p/q) profusion category 2/1.'
            : worker?.riskLevel === RISK_LEVELS.MODERATE
            ? 'Bilateral lower zone ground-glass opacities. Possible early silicotic changes.'
            : 'Normal chest radiograph. No evidence of pneumoconiosis or active disease.',
        },
        tb: {
          status: worker?.riskLevel === RISK_LEVELS.HIGH ? 'Requires evaluation' : 'No suspicious findings',
          details: worker?.riskLevel === RISK_LEVELS.HIGH
            ? 'Right upper lobe infiltrate with possible cavitation. Findings consistent with pulmonary tuberculosis.'
            : 'No active TB findings detected.',
        },
        overallRisk: worker?.riskLevel || RISK_LEVELS.LOW,
      });
      setProcessing(false);
    }, 3000);
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <h2 className="text-xl font-bold text-text-primary mb-1">AI Screening Result</h2>
        <p className="text-sm text-text-secondary mb-6">
          Findings are advisory and require clinical review. This is not a diagnosis.
        </p>

        <div className="space-y-4">
          <RiskBadge level={result.overallRisk} size="lg" />

          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-amber-800">Silicosis-related Findings</h3>
              </div>
              <p className={`text-sm font-medium mb-1 ${
                result.silicosis.status.includes('No') ? 'text-green-700' : 'text-amber-700'
              }`}>
                {result.silicosis.status}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">{result.silicosis.details}</p>
            </div>

            <div className="p-4 rounded-xl border border-red-200 bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-semibold text-red-800">TB-related Findings</h3>
              </div>
              <p className={`text-sm font-medium mb-1 ${
                result.tb.status.includes('No') ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.tb.status}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">{result.tb.details}</p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Disclaimer:</strong> AI findings are decision support only. All results must be reviewed and confirmed by a qualified physician before any clinical action is taken.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
                setPreview(null);
                setQuality(null);
              }}
              className="py-3 px-5 bg-white border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50"
            >
              Retake X-ray
            </button>
            <button
              onClick={() => onComplete(result)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send for Clinical Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-clinical-50 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-clinical-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">AI Analysis in Progress</h2>
          <p className="text-sm text-text-secondary mb-6">
            Our AI system is analyzing the chest X-ray for signs of occupational lung disease and tuberculosis. This typically takes a few seconds.
          </p>
          <div className="max-w-xs mx-auto space-y-2">
            <div className="flex items-center gap-2 text-sm text-clinical-600">
              <Check className="w-4 h-4" />
              <span>Image loaded successfully</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-clinical-600 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluating for silicosis patterns...</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <div className="w-4 h-4" />
              <span>Screening for TB indicators...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary">Chest X-ray Upload</h2>
        <p className="text-sm text-text-secondary">
          {worker?.name ? `Imaging for ${worker.name}` : 'Upload a PA view chest radiograph'}
        </p>
      </div>

      {!preview ? (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-clinical-500 bg-clinical-50'
                : 'border-gray-300 hover:border-clinical-400 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-sm font-medium text-text-primary mb-1">
              Drop X-ray image here or click to browse
            </p>
            <p className="text-xs text-text-muted">Supports JPG, PNG, DICOM &middot; Max 20MB</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-secondary px-3 text-text-muted">or</span>
            </div>
          </div>

          <button
            onClick={handleCameraCapture}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-clinical-300 text-clinical-700 rounded-xl text-sm font-semibold hover:bg-clinical-50 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Take Photo with Camera
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-white rounded-2xl border border-border overflow-hidden">
            <img
              src={preview}
              alt="Chest X-ray"
              className="w-full h-64 object-contain bg-gray-50"
            />
            <button
              onClick={() => { setFile(null); setPreview(null); setQuality(null); }}
              className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          {quality === null ? (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
              <p className="text-sm text-blue-700">Checking image quality...</p>
            </div>
          ) : quality === 'Poor' ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-semibold text-red-800">Poor Image Quality</p>
              </div>
              <p className="text-xs text-red-700 mb-3">
                The uploaded image does not meet quality standards for AI analysis. Please retake the X-ray ensuring proper positioning, exposure, and no motion artifacts.
              </p>
              <button
                onClick={() => { setFile(null); setPreview(null); setQuality(null); }}
                className="py-2 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Retake X-ray
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`flex items-center gap-2 p-3 rounded-xl ${
                quality === 'Good' ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
              }`}>
                <Check className={`w-5 h-5 ${quality === 'Good' ? 'text-green-600' : 'text-amber-600'}`} />
                <div>
                  <p className={`text-sm font-medium ${quality === 'Good' ? 'text-green-800' : 'text-amber-800'}`}>
                    Image Quality: {quality}
                  </p>
                  <p className={`text-xs ${quality === 'Good' ? 'text-green-600' : 'text-amber-600'}`}>
                    {quality === 'Good' ? 'Image is suitable for AI analysis' : 'Image is acceptable but may have minor quality issues'}
                  </p>
                </div>
              </div>

              <button
                onClick={runAIScreening}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors"
              >
                Run AI Screening
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full mt-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        Back to Assessment
      </button>
    </div>
  );
}
