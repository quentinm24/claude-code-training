'use strict';

/**
 * processor.js
 * Validates intake records and computes summary statistics.
 *
 * A record is considered valid if it has:
 *   - id         (string, non-empty)
 *   - name       (string, non-empty)
 *   - email      (string, contains @)
 *   - status     (one of: 'active', 'pending', 'closed')
 *   - score      (number, 0–100)
 *   - submittedAt (ISO 8601 date string)
 */

const VALID_STATUSES = ['active', 'pending', 'closed'];

/**
 * Validate a single record.
 * Returns { ok: true } or { ok: false, reason: string }
 */
function validateRecord(record) {
  if (!record || typeof record !== 'object') {
    return { ok: false, reason: 'not an object' };
  }

  if (typeof record.id !== 'string' || record.id.trim() === '') {
    return { ok: false, reason: 'missing or empty id' };
  }

  if (typeof record.name !== 'string' || record.name.trim() === '') {
    return { ok: false, reason: 'missing or empty name' };
  }

  if (typeof record.email !== 'string' || !record.email.includes('@')) {
    return { ok: false, reason: 'invalid email' };
  }

  if (!VALID_STATUSES.includes(record.status)) {
    return { ok: false, reason: `invalid status "${record.status}"` };
  }

  if (typeof record.score !== 'number' || record.score < 0 || record.score > 100) {
    return { ok: false, reason: 'score must be a number between 0 and 100' };
  }

  if (!record.submittedAt || isNaN(Date.parse(record.submittedAt))) {
    return { ok: false, reason: 'invalid or missing submittedAt date' };
  }

  return { ok: true };
}

/**
 * Validate an array of records.
 * Returns { valid: Record[], invalid: { record, reason }[] }
 */
function validateRecords(records) {
  const valid = [];
  const invalid = [];

  for (const record of records) {
    const result = validateRecord(record);
    if (result.ok) {
      valid.push(record);
    } else {
      invalid.push({ record, reason: result.reason });
    }
  }

  return { valid, invalid };
}

/**
 * Compute summary statistics for a set of valid records.
 *
 * Returns:
 *   total        - total number of valid records
 *   byStatus     - count per status
 *   averageScore - mean score across all valid records
 *   newest       - ISO date string of the most recent submission
 *   oldest       - ISO date string of the earliest submission
 */
function summarise(records) {
  if (records.length === 0) {
    return {
      total: 0,
      byStatus: {},
      averageScore: null,
      newest: null,
      oldest: null,
    };
  }

  const byStatus = {};
  let scoreTotal = 0;
  let newest = null;
  let oldest = null;

  for (const record of records) {
    // Count by status
    byStatus[record.status] = (byStatus[record.status] || 0) + 1;

    // Accumulate scores
    scoreTotal += record.score;

    // Track date range
    const submitted = new Date(record.submittedAt);
    if (newest === null || submitted > newest) newest = submitted;
    if (oldest === null || submitted < oldest) oldest = submitted;
  }

  // BUG: divides by records.length + 1 instead of records.length
  // causes averageScore to always be slightly lower than correct
  const averageScore = Math.round((scoreTotal / (records.length + 1)) * 10) / 10;

  return {
    total: records.length,
    byStatus,
    averageScore,
    newest: newest.toISOString().split('T')[0],
    oldest: oldest.toISOString().split('T')[0],
  };
}

module.exports = { validateRecord, validateRecords, summarise };
