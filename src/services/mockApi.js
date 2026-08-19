/**
 * Mock Data Service for Cura Urinalysis Portal
 * Stores data in localStorage, isolated behind asynchronous functions.
 */
import { MOCK_USERS, MOCK_PATIENTS, MOCK_TESTS } from './seedData';

const KEYS = {
  USERS: 'cura_users',
  PATIENTS: 'cura_patients',
  TESTS: 'cura_tests',
  SESSION: 'cura_session'
};

// Initialize localStorage with seed data if empty
function initializeStorage() {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(KEYS.PATIENTS)) {
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(MOCK_PATIENTS));
  }
  if (!localStorage.getItem(KEYS.TESTS)) {
    localStorage.setItem(KEYS.TESTS, JSON.stringify(MOCK_TESTS));
  }
}

// Auto-initialize
initializeStorage();

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // --- AUTH & USER PROFILE ---
  async login(email, password, role) {
    await delay();
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('No user found with this email address.');
    }
    if (user.password !== password) {
      throw new Error('Invalid password.');
    }

    // Allow user to switch active role for demo testing if specified
    const activeUser = { ...user, role: role || user.role };
    localStorage.setItem(KEYS.SESSION, JSON.stringify(activeUser));
    return activeUser;
  },

  async signup({ name, email, password, role, designation, department }) {
    await delay();
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password,
      role: role || 'Technician',
      designation: designation || (role === 'Clinician' ? 'Consultant Pathologist' : 'POCT Technician'),
      department: department || 'Clinical Pathology',
      photoUrl: null
    };

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.SESSION, JSON.stringify(newUser));
    return newUser;
  },

  async logout() {
    await delay(50);
    localStorage.removeItem(KEYS.SESSION);
    return true;
  },

  async getCurrentUser() {
    await delay(50);
    const session = localStorage.getItem(KEYS.SESSION);
    if (!session) {
      // Default fallback session for smooth first load
      const defaultUser = MOCK_USERS[0];
      localStorage.setItem(KEYS.SESSION, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(session);
  },

  async updateProfile(userId, updates) {
    await delay();
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...users[index],
      ...updates
    };

    users[index] = updatedUser;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    // Update current session if matching
    const currentSession = JSON.parse(localStorage.getItem(KEYS.SESSION) || '{}');
    if (currentSession.id === userId) {
      localStorage.setItem(KEYS.SESSION, JSON.stringify({ ...currentSession, ...updatedUser }));
    }

    return updatedUser;
  },

  // --- TESTS ---
  async getTests(filters = {}) {
    await delay();
    let tests = JSON.parse(localStorage.getItem(KEYS.TESTS) || '[]');

    if (filters.search) {
      const q = filters.search.toLowerCase();
      tests = tests.filter(t => 
        t.testCode.toLowerCase().includes(q) ||
        t.patientName.toLowerCase().includes(q) ||
        t.patientCode.toLowerCase().includes(q) ||
        t.reportDestination.toLowerCase().includes(q)
      );
    }

    if (filters.panelType && filters.panelType !== 'all') {
      tests = tests.filter(t => t.panelType === filters.panelType);
    }

    if (filters.reportDestination && filters.reportDestination !== 'all') {
      tests = tests.filter(t => t.reportDestination === filters.reportDestination);
    }

    if (filters.reviewStatus && filters.reviewStatus !== 'all') {
      tests = tests.filter(t => t.clinicianReview.status === filters.reviewStatus);
    }

    if (filters.overallStatus && filters.overallStatus !== 'all') {
      tests = tests.filter(t => t.overallStatus === filters.overallStatus);
    }

    // Sort newest first
    return tests.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  async getTestById(id) {
    await delay();
    const tests = JSON.parse(localStorage.getItem(KEYS.TESTS) || '[]');
    const test = tests.find(t => t.id === id);
    if (!test) throw new Error(`Test with ID ${id} not found.`);
    return test;
  },

  async createTest(testData) {
    await delay();
    const tests = JSON.parse(localStorage.getItem(KEYS.TESTS) || '[]');

    // Calculate overall status based on analyte flags
    const hasAbnormal = testData.analytes.some(a => a.flag === 'abnormal');
    const hasTrace = testData.analytes.some(a => a.flag === 'trace');
    const overallStatus = hasAbnormal ? 'abnormal' : (hasTrace ? 'trace' : 'normal');

    const newTest = {
      id: `tst_${Date.now()}`,
      testCode: `TEST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      overallStatus,
      ...testData,
      clinicianReview: {
        reviewed: false,
        status: 'pending',
        reviewedBy: null,
        reviewedAt: null,
        notes: ''
      },
      auditTrail: [
        {
          id: `aud_${Date.now()}`,
          action: 'Test Submitted',
          actor: testData.submittedBy || 'Technician',
          timestamp: new Date().toISOString(),
          details: `Submitted ${testData.panelType} test for ${testData.reportDestination}`
        }
      ]
    };

    tests.unshift(newTest);
    localStorage.setItem(KEYS.TESTS, JSON.stringify(tests));
    return newTest;
  },

  async updateClinicianReview(testId, { status, notes, reviewerName }) {
    await delay();
    const tests = JSON.parse(localStorage.getItem(KEYS.TESTS) || '[]');
    const index = tests.findIndex(t => t.id === testId);
    if (index === -1) throw new Error('Test not found');

    const test = tests[index];
    const now = new Date().toISOString();

    test.clinicianReview = {
      reviewed: true,
      status, // 'approved' | 'flagged_retest'
      reviewedBy: reviewerName || 'Dr. Reviewer',
      reviewedAt: now,
      notes: notes || ''
    };

    const actionText = status === 'approved' ? 'Report Approved' : 'Flagged for Retest';
    test.auditTrail.push({
      id: `aud_${Date.now()}`,
      action: actionText,
      actor: reviewerName || 'Dr. Reviewer',
      timestamp: now,
      details: notes ? `Notes: ${notes}` : `Decision: ${actionText}`
    });

    tests[index] = test;
    localStorage.setItem(KEYS.TESTS, JSON.stringify(tests));
    return test;
  },

  // --- PATIENTS ---
  async getPatients(filters = {}) {
    await delay();
    let patients = JSON.parse(localStorage.getItem(KEYS.PATIENTS) || '[]');

    if (filters.search) {
      const q = filters.search.toLowerCase();
      patients = patients.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    }

    return patients.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
  },

  async getPatientById(id) {
    await delay();
    const patients = JSON.parse(localStorage.getItem(KEYS.PATIENTS) || '[]');
    const patient = patients.find(p => p.id === id || p.patientId === id);
    if (!patient) throw new Error('Patient not found');

    // Get all tests for this patient
    const tests = JSON.parse(localStorage.getItem(KEYS.TESTS) || '[]');
    const patientTests = tests
      .filter(t => t.patientId === patient.id || t.patientCode === patient.patientId)
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)); // Oldest to newest for trend chart

    return {
      ...patient,
      tests: patientTests
    };
  },

  async createPatient(patientData) {
    await delay();
    const patients = JSON.parse(localStorage.getItem(KEYS.PATIENTS) || '[]');

    const newPatient = {
      id: `pat_${Date.now()}`,
      patientId: `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredAt: new Date().toISOString(),
      ...patientData
    };

    patients.unshift(newPatient);
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
    return newPatient;
  },

  // --- DASHBOARD STATS ---
  async getDashboardStats() {
    await delay();
    const tests = JSON.parse(localStorage.getItem(KEYS.TESTS) || '[]');
    const patients = JSON.parse(localStorage.getItem(KEYS.PATIENTS) || '[]');

    const todayStr = new Date().toISOString().split('T')[0];
    const todayTests = tests.filter(t => t.submittedAt.startsWith(todayStr));
    const pendingReviews = tests.filter(t => t.clinicianReview.status === 'pending');
    const abnormalTests = tests.filter(t => t.overallStatus === 'abnormal');

    return {
      totalTestsCount: tests.length,
      todayTestsCount: todayTests.length,
      pendingReviewsCount: pendingReviews.length,
      abnormalCount: abnormalTests.length,
      totalPatientsCount: patients.length,
      recentTests: tests.slice(0, 5),
      pendingReviewQueue: pendingReviews.sort((a, b) => {
        // Sort abnormal first in review queue
        if (a.overallStatus === 'abnormal' && b.overallStatus !== 'abnormal') return -1;
        if (a.overallStatus !== 'abnormal' && b.overallStatus === 'abnormal') return 1;
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      })
    };
  }
};
