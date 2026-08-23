import React from 'react';
import { Layers, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import { STRIP_BRANDS } from '../../services/seedData';
import { PANEL_10_KEYS, PANEL_14_KEYS } from '../../services/predictionEngine';

export function StepStripSelection({ formData, updateFormData, onNext, onPrev }) {
  const currentBrandObj = STRIP_BRANDS.find(b => b.name === formData.stripBrand) || STRIP_BRANDS[0];
  const currentPanel = formData.panelType || '10-panel';

  // Handler when user clicks a panel card (10-panel or 14-panel)
  const handleSelectPanel = (panelType) => {
    let targetBrand = formData.stripBrand;
    // If selected brand doesn't support this panel, auto-switch to a compatible brand
    if (currentBrandObj && !currentBrandObj.panels.includes(panelType)) {
      const compatibleBrand = STRIP_BRANDS.find(b => b.panels.includes(panelType));
      if (compatibleBrand) {
        targetBrand = compatibleBrand.name;
      }
    }
    updateFormData({
      panelType,
      stripBrand: targetBrand,
      rgbReadings: {}
    });
  };

  // Handler when user clicks a brand
  const handleSelectBrand = (brand) => {
    let targetPanel = currentPanel;
    // If brand doesn't support current panel, auto-switch to brand's first supported panel
    if (!brand.panels.includes(currentPanel)) {
      targetPanel = brand.panels[0];
    }
    updateFormData({
      stripBrand: brand.name,
      panelType: targetPanel
    });
  };

  // Check support for each panel type under current brand
  const supports10 = currentBrandObj.panels.includes('10-panel');
  const supports14 = currentBrandObj.panels.includes('14-panel');

  // Explanation message for selected brand
  const getBrandExplanation = (brand) => {
    if (brand.panels.length === 1) {
      return `${brand.name} supports ${brand.panels[0]} only`;
    }
    return `${brand.name} supports both 10-panel & 14-panel strips`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Step 2: Strip Parameter Count &amp; Brand
          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono text-[10px] uppercase font-bold border border-teal-300 dark:border-teal-800">
            Compatibility Guard Active
          </span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Choose between standard 10-parameter urinalysis strip or extended 14-parameter strip. Options auto-adjust based on brand hardware specs.
        </p>
      </div>

      {/* Compatibility Guard Banner */}
      <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-indigo-600 text-white shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-indigo-950 dark:text-indigo-200">
              Panel–Brand Guard:
            </span>{' '}
            <span className="text-indigo-800 dark:text-indigo-300 font-medium">
              "{getBrandExplanation(currentBrandObj)}"
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
          Auto-validated
        </span>
      </div>

      {/* Strip Brand Selection FIRST so user sees hardware capabilities */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-slate-900 dark:text-white">
            Select Reagent Strip Brand
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            Hardware Manufacturer Specs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {STRIP_BRANDS.map((brand) => {
            const isSelected = formData.stripBrand === brand.name;
            const singlePanel = brand.panels.length === 1 ? brand.panels[0] : null;

            return (
              <div
                key={brand.id}
                onClick={() => handleSelectBrand(brand)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative ${
                  isSelected
                    ? 'bg-teal-50/90 dark:bg-teal-950/80 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {brand.name}
                  </span>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{brand.manufacturer}</p>

                {/* Compatibility tag */}
                <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">Spec:</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded ${
                      singlePanel
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {singlePanel ? `${singlePanel} only` : '10 & 14-panel'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 10-Panel Option */}
        <div
          onClick={() => handleSelectPanel('10-panel')}
          className={`p-5 rounded-2xl border transition-all relative ${
            !supports10
              ? 'opacity-50 grayscale cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700'
              : currentPanel === '10-panel'
              ? 'bg-teal-50 dark:bg-teal-950/80 border-teal-500 shadow-md ring-2 ring-teal-500/20 cursor-pointer'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
              10-PANEL STRIP
            </span>
            {currentPanel === '10-panel' && supports10 && (
              <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            )}
            {!supports10 && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                Unsupported by {currentBrandObj.name}
              </span>
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

          {!supports10 && (
            <p className="mt-3 text-[11px] text-rose-600 dark:text-rose-400 font-semibold italic">
              * Selecting this will automatically switch strip brand to a 10-panel compatible brand.
            </p>
          )}
        </div>

        {/* 14-Panel Option */}
        <div
          onClick={() => handleSelectPanel('14-panel')}
          className={`p-5 rounded-2xl border transition-all relative ${
            !supports14
              ? 'opacity-50 grayscale cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700'
              : currentPanel === '14-panel'
              ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-500 shadow-md ring-2 ring-purple-500/20 cursor-pointer'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" /> 14-PANEL EXTENDED
            </span>
            {currentPanel === '14-panel' && supports14 && (
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            )}
            {!supports14 && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {currentBrandObj.name} supports 10-panel only
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
            Extended Renal &amp; Metabolic Panel (14 Pads)
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

          {!supports14 && (
            <p className="mt-3 text-[11px] text-amber-700 dark:text-amber-400 font-semibold italic">
              * Selecting this will automatically switch strip brand to a 14-panel compatible brand (e.g. CuraStrip Pro 14).
            </p>
          )}
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
