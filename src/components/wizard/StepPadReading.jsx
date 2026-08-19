import React, { useState } from 'react';
import { Upload, RefreshCw, Sparkles, Sliders, Image as ImageIcon } from 'lucide-react';
import { 
  PANEL_10_KEYS, 
  PANEL_14_KEYS, 
  ANALYTE_DEFINITIONS, 
  getSampleRGBReadings 
} from '../../services/predictionEngine';
import { rgbToCss, rgbToHex } from '../../utils/colorUtils';

export function StepPadReading({ formData, updateFormData, onNext, onPrev }) {
  const [imagePreview, setImagePreview] = useState(
    formData.stripImageUrl || 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400'
  );

  const panelType = formData.panelType || '10-panel';
  const analyteKeys = panelType === '14-panel' ? PANEL_14_KEYS : PANEL_10_KEYS;
  const rgbReadings = formData.rgbReadings || getSampleRGBReadings(panelType, 'normal');

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result;
        setImagePreview(url);
        updateFormData({ stripImageUrl: url });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRGBChange = (key, channel, val) => {
    const num = Math.max(0, Math.min(255, Number(val) || 0));
    const updated = {
      ...rgbReadings,
      [key]: {
        ...rgbReadings[key],
        [channel]: num
      }
    };
    updateFormData({ rgbReadings: updated });
  };

  const loadPreset = (presetType) => {
    const preset = getSampleRGBReadings(panelType, presetType);
    updateFormData({ rgbReadings: preset });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
          Step 3: Strip Scan & Reagent Pad RGB Readings ({panelType})
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload or capture the strip image and fine-tune individual RGB pad values for automated concentration prediction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image Upload & Preset Shortcuts */}
        <div className="space-y-4">
          {/* Strip Image Card */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Strip Specimen Image</span>
              <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400">POCT Camera Scan</span>
            </label>
            <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center p-4 min-h-[180px]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Strip preview"
                  className="max-h-44 object-cover rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Upload or drag strip image</p>
                </div>
              )}
              <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Change Strip Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Quick Presets Box */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Load Sample Readings
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Shortcut presets for rapid demonstration & simulation:
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => loadPreset('normal')}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors flex items-center justify-between"
              >
                <span>🟢 Load Normal Reading</span>
                <span className="text-[10px] font-mono">All Negative/Normal</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset('mixed')}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors flex items-center justify-between"
              >
                <span>🟡 Load Mild Pathological</span>
                <span className="text-[10px] font-mono">Protein + Glucose</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset('abnormal')}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors flex items-center justify-between"
              >
                <span>🔴 Load High Abnormal</span>
                <span className="text-[10px] font-mono">Multi-parameter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: RGB Pad Table (2 cols width) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Reagent Pad RGB Triplet Inputs ({analyteKeys.length} Pads)
            </h3>
            <span className="text-[11px] font-mono bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
              Live Color Swatch Sync
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[440px] overflow-y-auto pr-1">
            {analyteKeys.map((key) => {
              const def = ANALYTE_DEFINITIONS[key];
              const rgb = rgbReadings[key] || def.normalRGB;
              const cssColor = rgbToCss(rgb);
              const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

              return (
                <div key={key} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  {/* Analyte Label & Swatch */}
                  <div className="flex items-center gap-3 w-40 shrink-0">
                    <div
                      className="w-6 h-6 rounded-md shadow-inner border border-black/10 shrink-0 transition-colors duration-200"
                      style={{ backgroundColor: cssColor }}
                      title={`RGB(${rgb.r}, ${rgb.g}, ${rgb.b}) / ${hexColor}`}
                    ></div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">
                        {def.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {def.unit}
                      </p>
                    </div>
                  </div>

                  {/* Inputs R, G, B */}
                  <div className="flex items-center gap-2 font-mono">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-rose-500">R:</span>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgb.r}
                        onChange={(e) => handleRGBChange(key, 'r', e.target.value)}
                        className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-1 focus:ring-rose-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-emerald-500">G:</span>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgb.g}
                        onChange={(e) => handleRGBChange(key, 'g', e.target.value)}
                        className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-blue-500">B:</span>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgb.b}
                        onChange={(e) => handleRGBChange(key, 'b', e.target.value)}
                        className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
          Next: Preview & Submit →
        </button>
      </div>
    </div>
  );
}
