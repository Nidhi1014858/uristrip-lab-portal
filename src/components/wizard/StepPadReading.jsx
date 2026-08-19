import React from 'react';
import { AlertCircle, CheckCircle2, Sliders } from 'lucide-react';
import {
  ANALYTE_DEFINITIONS,
  PANEL_10_KEYS,
  PANEL_14_KEYS
} from '../../services/predictionEngine';
import { rgbToCss, rgbToHex } from '../../utils/colorUtils';

export function StepPadReading({ formData, updateFormData, onNext, onPrev }) {
  const panelType = formData.panelType || '10-panel';
  const analyteKeys = panelType === '14-panel' ? PANEL_14_KEYS : PANEL_10_KEYS;
  const rgbReadings = formData.rgbReadings || {};
  const completeCount = analyteKeys.filter((key) => {
    const rgb = rgbReadings[key];
    return rgb && ['r', 'g', 'b'].every((channel) => Number.isFinite(Number(rgb[channel])));
  }).length;
  const hasCompleteReadings = completeCount === analyteKeys.length;

  const handleRGBChange = (key, channel, value) => {
    const nextValue = value === '' ? '' : Math.max(0, Math.min(255, Number(value) || 0));
    const updated = {
      ...rgbReadings,
      [key]: {
        ...(rgbReadings[key] || {}),
        [channel]: nextValue
      }
    };
    updateFormData({ rgbReadings: updated });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
          Step 3: Extracted Reagent Pad RGB Values ({panelType})
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter the RGB triplets already extracted from the strip reader. Cura will analyze these values and generate concentration predictions.
        </p>
      </div>

      <div className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border flex items-start gap-3 ${
        hasCompleteReadings
          ? 'border-emerald-200 dark:border-emerald-800'
          : 'border-amber-200 dark:border-amber-800'
      }`}>
        {hasCompleteReadings ? (
          <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
        )}
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {completeCount}/{analyteKeys.length} reagent pads ready for analysis
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fill R, G, and B for every analyte before previewing the prediction.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            RGB Triplet Inputs ({analyteKeys.length} Pads)
          </h3>
          <span className="text-[11px] font-mono bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
            Already Extracted Data
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[520px] overflow-y-auto pr-1">
          {analyteKeys.map((key) => {
            const def = ANALYTE_DEFINITIONS[key];
            const rgb = rgbReadings[key];
            const displayRgb = rgb && Number.isFinite(Number(rgb.r)) && Number.isFinite(Number(rgb.g)) && Number.isFinite(Number(rgb.b))
              ? rgb
              : { r: 200, g: 200, b: 200 };
            const cssColor = rgbToCss(displayRgb);
            const hexColor = rgbToHex(displayRgb.r, displayRgb.g, displayRgb.b);

            return (
              <div key={key} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-7 h-7 rounded-md shadow-inner border border-black/10 shrink-0 transition-colors duration-200"
                    style={{ backgroundColor: cssColor }}
                    title={`RGB(${displayRgb.r}, ${displayRgb.g}, ${displayRgb.b}) / ${hexColor}`}
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white leading-tight">
                      {def.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      {def.category} | {def.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-rose-500">R:</span>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={rgb?.r ?? ''}
                      onChange={(event) => handleRGBChange(key, 'r', event.target.value)}
                      placeholder="0"
                      className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-1 focus:ring-rose-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-emerald-500">G:</span>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={rgb?.g ?? ''}
                      onChange={(event) => handleRGBChange(key, 'g', event.target.value)}
                      placeholder="0"
                      className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-blue-500">B:</span>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={rgb?.b ?? ''}
                      onChange={(event) => handleRGBChange(key, 'b', event.target.value)}
                      placeholder="0"
                      className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasCompleteReadings}
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Preview & Submit
        </button>
      </div>
    </div>
  );
}
