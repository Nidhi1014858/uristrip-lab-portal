/**
 * Prediction Engine for Point-of-Care Urinalysis Strips
 * Supports 10-panel and 14-panel configurations.
 */

export const ANALYTE_DEFINITIONS = {
  // 10-Panel Core Analytes
  glucose: {
    id: 'glucose',
    name: 'Glucose',
    unit: 'mg/dL',
    refRange: 'Negative (<50 mg/dL)',
    category: 'Metabolic',
    normalRGB: { r: 64, g: 196, b: 180 },
    abnormalRGB: { r: 180, g: 90, b: 40 },
    calculate: (r, g, b) => {
      // Lower green/blue, higher red indicates elevation
      const score = (r * 1.8 - g * 0.9 - b * 0.8);
      if (score < 40) return { value: 'Negative', flag: 'normal', score: 98, numeric: 0 };
      if (score < 90) return { value: '100 (Trace)', flag: 'trace', score: 94, numeric: 100 };
      if (score < 150) return { value: '250 (+)', flag: 'abnormal', score: 96, numeric: 250 };
      if (score < 220) return { value: '500 (++)', flag: 'abnormal', score: 95, numeric: 500 };
      return { value: '1000+ (+++)', flag: 'abnormal', score: 92, numeric: 1000 };
    }
  },
  protein: {
    id: 'protein',
    name: 'Protein',
    unit: 'mg/dL',
    refRange: 'Negative (<15 mg/dL)',
    category: 'Renal',
    normalRGB: { r: 230, g: 220, b: 130 },
    abnormalRGB: { r: 30, g: 140, b: 110 },
    calculate: (r, g, b) => {
      const score = (g * 1.5 + b * 1.2 - r * 1.5);
      if (score < 30) return { value: 'Negative', flag: 'normal', score: 99, numeric: 0 };
      if (score < 80) return { value: 'Trace (15 mg/dL)', flag: 'trace', score: 95, numeric: 15 };
      if (score < 130) return { value: '30 mg/dL (+)', flag: 'abnormal', score: 97, numeric: 30 };
      if (score < 180) return { value: '100 mg/dL (++)', flag: 'abnormal', score: 94, numeric: 100 };
      return { value: '300+ mg/dL (+++)', flag: 'abnormal', score: 91, numeric: 300 };
    }
  },
  ph: {
    id: 'ph',
    name: 'pH',
    unit: 'pH units',
    refRange: '4.5 - 8.0',
    category: 'Acid-Base',
    normalRGB: { r: 230, g: 160, b: 50 },
    abnormalRGB: { r: 40, g: 120, b: 180 },
    calculate: (r, g, b) => {
      // Orange/Yellow (low pH) to Blue/Green (high pH)
      const ratio = (b * 1.5 + g * 0.8) / (r + 1);
      let phVal = Math.min(8.5, Math.max(5.0, Number((5.0 + ratio * 2.2).toFixed(1))));
      let flag = (phVal < 4.5 || phVal > 8.0) ? 'abnormal' : 'normal';
      return { value: `${phVal}`, flag, score: 96, numeric: phVal };
    }
  },
  ketones: {
    id: 'ketones',
    name: 'Ketones',
    unit: 'mg/dL',
    refRange: 'Negative (<5 mg/dL)',
    category: 'Metabolic',
    normalRGB: { r: 245, g: 215, b: 175 },
    abnormalRGB: { r: 150, g: 30, b: 90 },
    calculate: (r, g, b) => {
      const score = (r * 1.2 - g * 1.5 + b * 0.5);
      if (score < 80) return { value: 'Negative', flag: 'normal', score: 98, numeric: 0 };
      if (score < 120) return { value: 'Trace (5 mg/dL)', flag: 'trace', score: 93, numeric: 5 };
      if (score < 160) return { value: '15 mg/dL (+)', flag: 'abnormal', score: 96, numeric: 15 };
      if (score < 200) return { value: '40 mg/dL (++)', flag: 'abnormal', score: 95, numeric: 40 };
      return { value: '80+ mg/dL (+++)', flag: 'abnormal', score: 94, numeric: 80 };
    }
  },
  blood: {
    id: 'blood',
    name: 'Blood',
    unit: 'cells/µL',
    refRange: 'Negative (<5 cells/µL)',
    category: 'Renal/Vascular',
    normalRGB: { r: 235, g: 195, b: 60 },
    abnormalRGB: { r: 35, g: 115, b: 75 },
    calculate: (r, g, b) => {
      const score = (g * 1.4 + b * 0.8 - r * 1.2);
      if (score < 40) return { value: 'Negative', flag: 'normal', score: 99, numeric: 0 };
      if (score < 90) return { value: 'Trace non-hemolyzed', flag: 'trace', score: 94, numeric: 10 };
      if (score < 140) return { value: '25 cells/µL (+)', flag: 'abnormal', score: 97, numeric: 25 };
      if (score < 190) return { value: '80 cells/µL (++)', flag: 'abnormal', score: 95, numeric: 80 };
      return { value: '200+ cells/µL (+++)', flag: 'abnormal', score: 93, numeric: 200 };
    }
  },
  bilirubin: {
    id: 'bilirubin',
    name: 'Bilirubin',
    unit: 'mg/dL',
    refRange: 'Negative (<0.2 mg/dL)',
    category: 'Hepatic',
    normalRGB: { r: 245, g: 225, b: 180 },
    abnormalRGB: { r: 185, g: 130, b: 155 },
    calculate: (r, g, b) => {
      const score = (r * 1.2 + b * 1.1 - g * 1.6);
      if (score < 70) return { value: 'Negative', flag: 'normal', score: 98, numeric: 0 };
      if (score < 110) return { value: '1.0 mg/dL (+)', flag: 'abnormal', score: 95, numeric: 1.0 };
      if (score < 150) return { value: '2.0 mg/dL (++)', flag: 'abnormal', score: 96, numeric: 2.0 };
      return { value: '4.0+ mg/dL (+++)', flag: 'abnormal', score: 93, numeric: 4.0 };
    }
  },
  urobilinogen: {
    id: 'urobilinogen',
    name: 'Urobilinogen',
    unit: 'mg/dL',
    refRange: '0.2 - 1.0 mg/dL',
    category: 'Hepatic',
    normalRGB: { r: 250, g: 215, b: 180 },
    abnormalRGB: { r: 220, g: 80, b: 100 },
    calculate: (r, g, b) => {
      const score = (r * 1.4 - g * 1.2 - b * 0.8);
      if (score < 60) return { value: '0.2 mg/dL (Normal)', flag: 'normal', score: 97, numeric: 0.2 };
      if (score < 100) return { value: '1.0 mg/dL (Normal)', flag: 'normal', score: 96, numeric: 1.0 };
      if (score < 140) return { value: '2.0 mg/dL (Elevated)', flag: 'abnormal', score: 94, numeric: 2.0 };
      if (score < 180) return { value: '4.0 mg/dL (Elevated)', flag: 'abnormal', score: 95, numeric: 4.0 };
      return { value: '8.0+ mg/dL (High)', flag: 'abnormal', score: 92, numeric: 8.0 };
    }
  },
  nitrite: {
    id: 'nitrite',
    name: 'Nitrite',
    unit: 'Qualitative',
    refRange: 'Negative',
    category: 'Infection',
    normalRGB: { r: 250, g: 240, b: 225 },
    abnormalRGB: { r: 235, g: 110, b: 160 },
    calculate: (r, g, b) => {
      const score = (r * 1.5 - g * 1.4 + b * 0.8);
      if (score < 100) return { value: 'Negative', flag: 'normal', score: 99, numeric: 0 };
      return { value: 'Positive (UTI indicated)', flag: 'abnormal', score: 97, numeric: 1 };
    }
  },
  leucocytes: {
    id: 'leucocytes',
    name: 'Leucocytes',
    unit: 'cells/µL',
    refRange: 'Negative (<15 cells/µL)',
    category: 'Infection',
    normalRGB: { r: 245, g: 235, b: 200 },
    abnormalRGB: { r: 140, g: 80, b: 140 },
    calculate: (r, g, b) => {
      const score = (b * 1.4 - g * 1.1 + r * 0.5);
      if (score < 60) return { value: 'Negative', flag: 'normal', score: 98, numeric: 0 };
      if (score < 100) return { value: 'Trace (15 cells/µL)', flag: 'trace', score: 94, numeric: 15 };
      if (score < 140) return { value: '70 cells/µL (+)', flag: 'abnormal', score: 96, numeric: 70 };
      if (score < 180) return { value: '125 cells/µL (++)', flag: 'abnormal', score: 95, numeric: 125 };
      return { value: '500+ cells/µL (+++)', flag: 'abnormal', score: 93, numeric: 500 };
    }
  },
  sg: {
    id: 'sg',
    name: 'Specific Gravity',
    unit: 'ratio',
    refRange: '1.005 - 1.030',
    category: 'Hydration/Renal',
    normalRGB: { r: 60, g: 130, b: 150 },
    abnormalRGB: { r: 210, g: 160, b: 40 },
    calculate: (r, g, b) => {
      // Dark cyan (1.000) to Yellow/Brown (1.030)
      const score = (r * 1.5 + g * 0.8 - b * 1.2);
      let sgVal = Number((1.005 + Math.min(0.025, Math.max(0, score / 4000))).toFixed(3));
      let flag = (sgVal < 1.005 || sgVal > 1.030) ? 'abnormal' : 'normal';
      return { value: `${sgVal}`, flag, score: 97, numeric: sgVal };
    }
  },

  // 4 Additional Analytes for 14-Panel Strip
  ascorbic: {
    id: 'ascorbic',
    name: 'Ascorbic Acid',
    unit: 'mg/dL',
    refRange: '0 - 10 mg/dL',
    category: 'Interference',
    normalRGB: { r: 70, g: 170, b: 200 },
    abnormalRGB: { r: 230, g: 190, b: 60 },
    calculate: (r, g, b) => {
      const score = (r * 1.4 + g * 0.8 - b * 1.3);
      if (score < 40) return { value: '0 mg/dL', flag: 'normal', score: 98, numeric: 0 };
      if (score < 90) return { value: '10 mg/dL', flag: 'normal', score: 96, numeric: 10 };
      if (score < 140) return { value: '25 mg/dL', flag: 'trace', score: 95, numeric: 25 };
      return { value: '50+ mg/dL (High)', flag: 'abnormal', score: 94, numeric: 50 };
    }
  },
  calcium: {
    id: 'calcium',
    name: 'Calcium',
    unit: 'mg/dL',
    refRange: '1.0 - 10.0 mg/dL',
    category: 'Electrolyte',
    normalRGB: { r: 235, g: 210, b: 160 },
    abnormalRGB: { r: 190, g: 70, b: 120 },
    calculate: (r, g, b) => {
      const score = (r * 1.1 + b * 1.2 - g * 1.5);
      if (score < 50) return { value: '2.5 mg/dL (Normal)', flag: 'normal', score: 97, numeric: 2.5 };
      if (score < 100) return { value: '5.0 mg/dL (Normal)', flag: 'normal', score: 96, numeric: 5.0 };
      if (score < 150) return { value: '10.0 mg/dL (Borderline)', flag: 'trace', score: 94, numeric: 10.0 };
      return { value: '20.0+ mg/dL (Elevated)', flag: 'abnormal', score: 92, numeric: 20.0 };
    }
  },
  creatinine: {
    id: 'creatinine',
    name: 'Creatinine',
    unit: 'mg/dL',
    refRange: '10 - 300 mg/dL',
    category: 'Renal',
    normalRGB: { r: 210, g: 150, b: 90 },
    abnormalRGB: { r: 90, g: 70, b: 130 },
    calculate: (r, g, b) => {
      const score = (b * 1.5 - r * 1.2);
      if (score < 30) return { value: '10 mg/dL (Low)', flag: 'trace', score: 95, numeric: 10 };
      if (score < 80) return { value: '50 mg/dL (Normal)', flag: 'normal', score: 98, numeric: 50 };
      if (score < 130) return { value: '100 mg/dL (Normal)', flag: 'normal', score: 97, numeric: 100 };
      if (score < 180) return { value: '200 mg/dL (High)', flag: 'abnormal', score: 94, numeric: 200 };
      return { value: '300+ mg/dL (Very High)', flag: 'abnormal', score: 91, numeric: 300 };
    }
  },
  microalbumin: {
    id: 'microalbumin',
    name: 'Microalbumin',
    unit: 'mg/L',
    refRange: '<20 mg/L',
    category: 'Renal Risk',
    normalRGB: { r: 240, g: 235, b: 210 },
    abnormalRGB: { r: 60, g: 140, b: 160 },
    calculate: (r, g, b) => {
      const score = (g * 1.4 + b * 1.2 - r * 1.6);
      if (score < 30) return { value: '<10 mg/L (Normal)', flag: 'normal', score: 99, numeric: 10 };
      if (score < 80) return { value: '20 mg/L (Borderline)', flag: 'trace', score: 95, numeric: 20 };
      if (score < 130) return { value: '50 mg/L (Abnormal)', flag: 'abnormal', score: 96, numeric: 50 };
      if (score < 180) return { value: '100 mg/L (Abnormal)', flag: 'abnormal', score: 94, numeric: 100 };
      return { value: '150+ mg/L (Severe)', flag: 'abnormal', score: 92, numeric: 150 };
    }
  }
};

export const PANEL_10_KEYS = [
  'glucose', 'protein', 'ph', 'ketones', 'blood', 
  'bilirubin', 'urobilinogen', 'nitrite', 'leucocytes', 'sg'
];

export const PANEL_14_KEYS = [
  ...PANEL_10_KEYS,
  'ascorbic', 'calcium', 'creatinine', 'microalbumin'
];

/**
 * Given a panelType ('10-panel' or '14-panel') and an array or object of RGB readings per pad,
 * calculate all analyte predictions.
 */
export function predictAnalytes(panelType, rgbData) {
  const keys = panelType === '14-panel' ? PANEL_14_KEYS : PANEL_10_KEYS;
  
  return keys.map((key) => {
    const def = ANALYTE_DEFINITIONS[key];
    const rgb = rgbData[key] || def.normalRGB;
    const result = def.calculate(rgb.r, rgb.g, rgb.b);

    return {
      id: def.id,
      name: def.name,
      unit: def.unit,
      refRange: def.refRange,
      category: def.category,
      rgbInput: rgb,
      value: result.value,
      flag: result.flag,
      score: result.score,
      numeric: result.numeric
    };
  });
}

/**
 * Generate sample RGB readings for quick testing in wizard
 */
export function getSampleRGBReadings(panelType, statusType = 'normal') {
  const keys = panelType === '14-panel' ? PANEL_14_KEYS : PANEL_10_KEYS;
  const result = {};

  keys.forEach((key) => {
    const def = ANALYTE_DEFINITIONS[key];
    if (statusType === 'abnormal') {
      result[key] = { ...def.abnormalRGB };
    } else if (statusType === 'mixed') {
      // Some abnormal, some normal
      const isAbnormal = ['protein', 'glucose', 'leucocytes', 'microalbumin'].includes(key);
      result[key] = isAbnormal ? { ...def.abnormalRGB } : { ...def.normalRGB };
    } else {
      result[key] = { ...def.normalRGB };
    }
  });

  return result;
}
