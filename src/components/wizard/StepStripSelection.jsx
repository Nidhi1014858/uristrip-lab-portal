import React from 'react';
import { Layers, Sparkles, CheckCircle } from 'lucide-react';
import { STRIP_BRANDS } from '../../services/seedData';
import { PANEL_10_KEYS, PANEL_14_KEYS } from '../../services/predictionEngine';

export function StepStripSelection({ formData, updateFormData, onNext, onPrev }) {
  const handleSelectPanel = (panelType) => {
    updateFormData({
      panelType,
      rgbReadings: {}
    });
  };

  const handleSelectBrand = (brand) => {
    updateFormData({ stripBrand: brand.name });
  };

  const currentPanel = formData.panelType || '10-panel';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
          Step 2: Strip Parameter Count & Brand
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Choose between standard 10-parameter urinalysis strip or extended 14-parameter strip with microalbuminuria detection.
        </p>
      </div>

      {/* Panel Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 10-Panel Option */}
        <div
          onClick={() => handleSelectPanel('10-panel')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            currentPanel === '10-panel'
              ? 'bg-teal-50 dark:bg-teal-950/80 border-teal-500 shadow-md ring-2 ring-teal-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
              10-PANEL STRIP
            </span>
            {currentPanel === '10-panel' && (
              <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
            Standard Urinalysis (10 Pads)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Measures Glucose, Protein, pH, Ketones, Blood, Bilirubin, Urobilinogen, Nitrite, Leucocytes, and Specific Gravity.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-1">
            {PANEL_10_KEYS.map(k => (
              <span key={k} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* 14-Panel Option */}
        <div
          onClick={() => handleSelectPanel('14-panel')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            currentPanel === '14-panel'
              ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-500 shadow-md ring-2 ring-purple-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" /> 14-PANEL EXTENDED
            </span>
            {currentPanel === '14-panel' && (
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
            Extended Renal & Metabolic Panel (14 Pads)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Includes all 10 core analytes plus <strong>Ascorbic Acid, Calcium, Creatinine, and Microalbumin</strong> for early nephropathy screening.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-1">
            {PANEL_14_KEYS.map(k => (
              <span key={k} className={`text-[10px] font-mono px-1.5 py-0.5 rounded capitalize ${
                ['ascorbic', 'calcium', 'creatinine', 'microalbumin'].includes(k)
                  ? 'bg-purple-100 dark:bg-purple-900/80 text-purple-800 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strip Brand Selection */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="block text-sm font-bold text-slate-900 dark:text-white">
          Select Reagent Strip Brand
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {STRIP_BRANDS.filter(b => b.panels.includes(currentPanel)).map((brand) => {
            const isSelected = formData.stripBrand === brand.name;
            return (
              <div
                key={brand.id}
                onClick={() => handleSelectBrand(brand)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/80 border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <p className="font-bold text-xs text-slate-900 dark:text-white">{brand.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{brand.manufacturer}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-all"
        >
          Next: Reagent Pad Reading →
        </button>
      </div>
    </div>
  );
}
