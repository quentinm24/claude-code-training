'use strict';

/**
 * tests/processor.test.js
 * Basic tests for the intake record processor.
 *
 * Run with: node --test tests/processor.test.js
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateRecord, validateRecords, summarise } = require('../src/processor');

// ── validateRecord ────────────────────────────────────────────────────────────

test('validateRecord — accepts a fully valid record', () => {
  const record = {
    id: 'REC-001',
    name: 'Amara Osei',
    email: 'amara@example.com',
    status: 'active',
    score: 82,
    submittedAt: '2026-03-14T09:22:00Z',
  };
  const result = validateRecord(record);
  assert.equal(result.ok, true);
});

test('validateRecord — rejects missing id', () => {
  const record = { name: 'Test', email: 'a@b.com', status: 'active', score: 50, submittedAt: '2026-01-01T00:00:00Z' };
  const result = validateRecord(record);
  assert.equal(result.ok, false);
  assert.match(result.reason, /id/);
});

test('validateRecord — rejects invalid email', () => {
  const record = { id: '1', name: 'Test', email: 'not-valid', status: 'active', score: 50, submittedAt: '2026-01-01T00:00:00Z' };
  const result = validateRecord(record);
  assert.equal(result.ok, false);
  assert.match(result.reason, /email/);
});

test('validateRecord — rejects unknown status', () => {
  const record = { id: '1', name: 'Test', email: 'a@b.com', status: 'unknown', score: 50, submittedAt: '2026-01-01T00:00:00Z' };
  const result = validateRecord(record);
  assert.equal(result.ok, false);
  assert.match(result.reason, /status/);
});

test('validateRecord — rejects score above 100', () => {
  const record = { id: '1', name: 'Test', email: 'a@b.com', status: 'active', score: 105, submittedAt: '2026-01-01T00:00:00Z' };
  const result = validateRecord(record);
  assert.equal(result.ok, false);
  assert.match(result.reason, /score/);
});

// ── validateRecords ───────────────────────────────────────────────────────────

test('validateRecords — separates valid from invalid', () => {
  const records = [
    { id: '1', name: 'Alice', email: 'a@b.com', status: 'active', score: 80, submittedAt: '2026-01-01T00:00:00Z' },
    { id: '2', name: 'Bob', email: 'not-an-email', status: 'active', score: 70, submittedAt: '2026-01-01T00:00:00Z' },
  ];
  const { valid, invalid } = validateRecords(records);
  assert.equal(valid.length, 1);
  assert.equal(invalid.length, 1);
});

// ── summarise ─────────────────────────────────────────────────────────────────

test('summarise — returns nulls for empty array', () => {
  const result = summarise([]);
  assert.equal(result.total, 0);
  assert.equal(result.averageScore, null);
});

test('summarise — counts total correctly', () => {
  const records = [
    { id: '1', name: 'A', email: 'a@b.com', status: 'active', score: 80, submittedAt: '2026-01-01T00:00:00Z' },
    { id: '2', name: 'B', email: 'b@b.com', status: 'pending', score: 60, submittedAt: '2026-02-01T00:00:00Z' },
  ];
  const result = summarise(records);
  assert.equal(result.total, 2);
});

test('summarise — averageScore is correct for two records scoring 80 and 60', () => {
  const records = [
    { id: '1', name: 'A', email: 'a@b.com', status: 'active', score: 80, submittedAt: '2026-01-01T00:00:00Z' },
    { id: '2', name: 'B', email: 'b@b.com', status: 'pending', score: 60, submittedAt: '2026-02-01T00:00:00Z' },
  ];
  const result = summarise(records);
  // 80 + 60 = 140, divided by 2 = 70
  assert.equal(result.averageScore, 70);
});

test('summarise — averageScore is correct for a single record scoring 90', () => {
  const records = [
    { id: '1', name: 'A', email: 'a@b.com', status: 'active', score: 90, submittedAt: '2026-01-01T00:00:00Z' },
  ];
  const result = summarise(records);
  assert.equal(result.averageScore, 90);
});

test('summarise — identifies newest and oldest submission dates', () => {
  const records = [
    { id: '1', name: 'A', email: 'a@b.com', status: 'active', score: 80, submittedAt: '2026-01-01T00:00:00Z' },
    { id: '2', name: 'B', email: 'b@b.com', status: 'pending', score: 60, submittedAt: '2026-06-01T00:00:00Z' },
  ];
  const result = summarise(records);
  assert.equal(result.oldest, '2026-01-01');
  assert.equal(result.newest, '2026-06-01');
});

test('summarise — byStatus counts are correct', () => {
  const records = [
    { id: '1', name: 'A', email: 'a@b.com', status: 'active', score: 80, submittedAt: '2026-01-01T00:00:00Z' },
    { id: '2', name: 'B', email: 'b@b.com', status: 'active', score: 70, submittedAt: '2026-02-01T00:00:00Z' },
    { id: '3', name: 'C', email: 'c@b.com', status: 'pending', score: 60, submittedAt: '2026-03-01T00:00:00Z' },
  ];
  const result = summarise(records);
  assert.equal(result.byStatus.active, 2);
  assert.equal(result.byStatus.pending, 1);
});
