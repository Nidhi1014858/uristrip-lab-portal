# Cura — Point-of-Care Urinalysis Portal

**Cura** is a modern React web application for point-of-care urine test strip analysis used by pathology lab technicians and reviewing clinicians. It digitizes strip reading, provides automated non-linear concentration predictions for both **10-panel** and **14-panel** test strips, tags reports with pathology diagnostics company destinations, and manages clinician review workflows end-to-end.

---

## 🌟 Key Features

- **Clinical Diagnostic Aesthetic & Monospace Typography**:
  - Purpose-built clinical design palette with distinct light and dark modes.
  - Monospace font styling for technical parameters, RGB triplets, medical IDs, and timestamps.
  - Reagent pad strip brand motif embedded into the brand identity.

- **Pathology Company / Report Destination Tagging**:
  - Technicians select target pathology diagnostics providers (*Metropolis Healthcare, Dr Lal PathLabs, SRL Diagnostics, Thyrocare Laboratories, or In-house / K J Somaiya Hospital*) during test creation.
  - Displayed prominently on reports and filterable across the reports repository.

- **Dynamic 10-Panel vs. 14-Panel Strip Support**:
  - **10-Panel Core**: Glucose, Protein, pH, Ketones, Blood, Bilirubin, Urobilinogen, Nitrite, Leucocytes, Specific Gravity.
  - **14-Panel Extended**: Adds **Ascorbic Acid, Calcium, Creatinine, and Microalbumin** for early diabetic nephropathy screening.
  - Dynamic RGB pad entry table, live color swatches, and preset shortcuts (*Load Normal*, *Load Pathological*, *Load High Abnormal*).

- **Explicit End-to-End Clinician Review Workflow**:
  - Submitted tests auto-land in the **Clinician Review Queue** (sorted abnormal-first).
  - Dedicated **"Review Now" / "Sign Off"** action directly on the **Report Detail Page** — clinicians can review from either the queue or patient reports.
  - Visual 3-step **Review Status Timeline** (*Submitted → Pending Review → Reviewed/Approved or Flagged*).

- **Patient History & Longitudinal Trend Charts**:
  - Patients page groups all historical tests per patient.
  - Interactive **Recharts trend graph** tracking analyte concentrations over time.
  - **"Re-Test This Patient"** shortcut button that prefills patient demographics into the test wizard.

- **Technician Profile Management**:
  - Edit user credentials, designation, department, and profile photo avatar (data URL persistence).

- **Persistent Dark & Light Mode**:
  - Class-based dark mode (`dark:`) persisted to `localStorage` with anti-flash script in `index.html`.

---

## 🛠️ Architecture & Mock Data Layer

The application isolates all backend communication behind an asynchronous service layer:

- [`src/services/mockApi.js`](file:///d:/Nidhi%20-%20College/Sem%205/uristrip-lab-portal/src/services/mockApi.js): Simulates a MongoDB-shaped database using `localStorage` (`cura_tests`, `cura_patients`, `cura_users`, `cura_session`).
- [`src/services/predictionEngine.js`](file:///d:/Nidhi%20-%20College/Sem%205/uristrip-lab-portal/src/services/predictionEngine.js): Stand-in non-linear regression model computing values, units, reference ranges, flags, and confidence scores from pad RGB triplets.
- [`src/services/seedData.js`](file:///d:/Nidhi%20-%20College/Sem%205/uristrip-lab-portal/src/services/seedData.js): Pre-populates realistic seed data on first run.

### Swapping for a Real Backend API
To connect to a live backend (Express/MongoDB or REST/GraphQL):
1. Keep component imports pointing to `mockApi.js`.
2. Replace `localStorage` operations in `mockApi.js` with `fetch` or `axios` calls pointing to your API endpoints.
3. No React UI components require modification.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. Build production bundle:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Login Credentials

You can use the quick demo buttons on the login page or enter these credentials:

| Role | Email | Password |
|---|---|---|
| **Lab Technician** | `tech@cura.lab` | `password123` |
| **Clinician Pathologist** | `clinician@cura.lab` | `password123` |

You can also use the **Active Role** switcher in the sidebar to toggle between Technician and Clinician modes instantly during testing.
