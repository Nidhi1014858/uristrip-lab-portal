/**
 * Prediction Engine for Point-of-Care Urinalysis Strips
 * Supports 10-panel and 14-panel configurations.
 */

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const rgbSeverity = (normalRGB, abnormalRGB, r, g, b) => {
  const vector = {
    r: abnormalRGB.r - normalRGB.r,
    g: abnormalRGB.g - normalRGB.g,
    b: abnormalRGB.b - normalRGB.b
  };
  const sample = {
    r: r - normalRGB.r,
    g: g - normalRGB.g,
    b: b - normalRGB.b
  };
  const vectorLengthSq = vector.r ** 2 + vector.g ** 2 + vector.b ** 2;

  if (vectorLengthSq === 0) return 0;

  return clamp(
    (sample.r * vector.r + sample.g * vector.g + sample.b * vector.b) / vectorLengthSq
  );
};

const confidenceFromSeverity = (severity) => {
  const nearestAnchorDistance = Math.min(severity, 1 - severity);
  return Math.round(99 - nearestAnchorDistance * 12);
};

const fromClinicalBands = (normalRGB, abnormalRGB, r, g, b, bands) => {
  const severity = rgbSeverity(normalRGB, abnormalRGB, r, g, b);
  const band = bands.find((item) => severity <= item.max) || bands[bands.length - 1];

  return {
    ...band.result,
    score: band.result.score ?? confidenceFromSeverity(severity)
  };
};

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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.22, result: { value: 'Negative', flag: 'normal', numeric: 0 } },
        { max: 0.40, result: { value: 'Trace (100 mg/dL)', flag: 'trace', numeric: 100 } },
        { max: 0.62, result: { value: '250 mg/dL (+)', flag: 'abnormal', numeric: 250 } },
        { max: 0.82, result: { value: '500 mg/dL (++)', flag: 'abnormal', numeric: 500 } },
        { max: 1, result: { value: '1000+ mg/dL (+++)', flag: 'abnormal', numeric: 1000 } }
      ]);
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.18, result: { value: 'Negative', flag: 'normal', numeric: 0 } },
        { max: 0.34, result: { value: 'Trace (5-10 mg/dL)', flag: 'trace', numeric: 10 } },
        { max: 0.56, result: { value: '30 mg/dL (1+)', flag: 'abnormal', numeric: 30 } },
        { max: 0.78, result: { value: '100 mg/dL (2+)', flag: 'abnormal', numeric: 100 } },
        { max: 0.92, result: { value: '300 mg/dL (3+)', flag: 'abnormal', numeric: 300 } },
        { max: 1, result: { value: '1000 mg/dL (4+)', flag: 'abnormal', numeric: 1000 } }
      ]);
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
    calculate(r, g, b) {
      const severity = rgbSeverity(this.normalRGB, this.abnormalRGB, r, g, b);
      const phVal = Number((5.0 + severity * 3.5).toFixed(1));
      const flag = phVal > 8.0 ? 'abnormal' : 'normal';
      return { value: `${phVal}`, flag, score: confidenceFromSeverity(severity), numeric: phVal };
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.22, result: { value: 'Negative', flag: 'normal', numeric: 0 } },
        { max: 0.40, result: { value: 'Trace (5 mg/dL)', flag: 'trace', numeric: 5 } },
        { max: 0.62, result: { value: '15 mg/dL (+)', flag: 'abnormal', numeric: 15 } },
        { max: 0.82, result: { value: '40 mg/dL (++)', flag: 'abnormal', numeric: 40 } },
        { max: 1, result: { value: '80+ mg/dL (+++)', flag: 'abnormal', numeric: 80 } }
      ]);
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.20, result: { value: 'Negative', flag: 'normal', numeric: 0 } },
        { max: 0.38, result: { value: 'Trace intact RBC', flag: 'trace', numeric: 10 } },
        { max: 0.58, result: { value: '25 cells/uL (+)', flag: 'abnormal', numeric: 25 } },
        { max: 0.78, result: { value: '80 cells/uL (++)', flag: 'abnormal', numeric: 80 } },
        { max: 1, result: { value: '200+ cells/uL (+++)', flag: 'abnormal', numeric: 200 } }
      ]);
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.24, result: { value: 'Negative', flag: 'normal', numeric: 0 } },
        { max: 0.52, result: { value: 'Small (1 mg/dL)', flag: 'abnormal', numeric: 1 } },
        { max: 0.76, result: { value: 'Moderate (2 mg/dL)', flag: 'abnormal', numeric: 2 } },
        { max: 1, result: { value: 'Large (4+ mg/dL)', flag: 'abnormal', numeric: 4 } }
      ]);
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.32, result: { value: '0.2 mg/dL', flag: 'normal', numeric: 0.2 } },
        { max: 0.50, result: { value: '1.0 mg/dL', flag: 'normal', numeric: 1 } },
        { max: 0.68, result: { value: '2.0 mg/dL (Elevated)', flag: 'abnormal', numeric: 2 } },
        { max: 0.86, result: { value: '4.0 mg/dL (Elevated)', flag: 'abnormal', numeric: 4 } },
        { max: 1, result: { value: '8.0+ mg/dL (High)', flag: 'abnormal', numeric: 8 } }
      ]);
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.44, result: { value: 'Negative', flag: 'normal', numeric: 0 } },
        { max: 1, result: { value: 'Positive', flag: 'abnormal', numeric: 1 } }
      ]);
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.22, result: { value: 'Negative', flag: 'normal', numeric: 0 } },
        { max: 0.40, result: { value: 'Trace (15 cells/uL)', flag: 'trace', numeric: 15 } },
        { max: 0.60, result: { value: '70 cells/uL (+)', flag: 'abnormal', numeric: 70 } },
        { max: 0.80, result: { value: '125 cells/uL (++)', flag: 'abnormal', numeric: 125 } },
        { max: 1, result: { value: '500+ cells/uL (+++)', flag: 'abnormal', numeric: 500 } }
      ]);
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
    calculate(r, g, b) {
      const severity = rgbSeverity(this.normalRGB, this.abnormalRGB, r, g, b);
      const sgVal = Number((1.005 + severity * 0.025).toFixed(3));
      const flag = sgVal < 1.005 || sgVal > 1.030 ? 'abnormal' : 'normal';
      return { value: `${sgVal}`, flag, score: confidenceFromSeverity(severity), numeric: sgVal };
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.30, result: { value: '0 mg/dL', flag: 'normal', numeric: 0 } },
        { max: 0.52, result: { value: '10 mg/dL', flag: 'normal', numeric: 10 } },
        { max: 0.74, result: { value: '25 mg/dL (Interference risk)', flag: 'trace', numeric: 25 } },
        { max: 1, result: { value: '50+ mg/dL (High interference risk)', flag: 'abnormal', numeric: 50 } }
      ]);
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.28, result: { value: '2.5 mg/dL', flag: 'normal', numeric: 2.5 } },
        { max: 0.52, result: { value: '5.0 mg/dL', flag: 'normal', numeric: 5 } },
        { max: 0.74, result: { value: '10.0 mg/dL (Borderline)', flag: 'trace', numeric: 10 } },
        { max: 1, result: { value: '20.0+ mg/dL (Elevated)', flag: 'abnormal', numeric: 20 } }
      ]);
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.20, result: { value: '10 mg/dL', flag: 'normal', numeric: 10 } },
        { max: 0.48, result: { value: '50 mg/dL', flag: 'normal', numeric: 50 } },
        { max: 0.68, result: { value: '100 mg/dL', flag: 'normal', numeric: 100 } },
        { max: 0.86, result: { value: '200 mg/dL (High)', flag: 'abnormal', numeric: 200 } },
        { max: 1, result: { value: '300+ mg/dL (Very High)', flag: 'abnormal', numeric: 300 } }
      ]);
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
    calculate(r, g, b) {
      return fromClinicalBands(this.normalRGB, this.abnormalRGB, r, g, b, [
        { max: 0.28, result: { value: '<20 mg/L', flag: 'normal', numeric: 10 } },
        { max: 0.48, result: { value: '20 mg/L (Borderline)', flag: 'trace', numeric: 20 } },
        { max: 0.68, result: { value: '50 mg/L (Abnormal)', flag: 'abnormal', numeric: 50 } },
        { max: 0.86, result: { value: '100 mg/L (Abnormal)', flag: 'abnormal', numeric: 100 } },
        { max: 1, result: { value: '150+ mg/L (Severe)', flag: 'abnormal', numeric: 150 } }
      ]);
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
