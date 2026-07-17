#!/usr/bin/env node

/**
 * intake-validator
 * Validates and summarises client intake records from a JSON file.
 *
 * Usage:
 *   node index.js <path-to-records-file>
 *
 * Example:
 *   node index.js data/sample-records.json
 */

const fs = require('fs');
const path = require('path');
const { validateRecords, summarise } = require('./src/processor');
const { formatReport } = require('./src/reporter');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Error: no input file specified.');
  console.error('Usage: node index.js <path-to-records-file>');
  process.exit(1);
}

const filePath = path.resolve(args[0]);

if (!fs.existsSync(filePath)) {
  console.error(`Error: file not found — ${filePath}`);
  process.exit(1);
}

let raw;
try {
  raw = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(`Error reading file: ${err.message}`);
  process.exit(1);
}

let records;
try {
  records = JSON.parse(raw);
} catch (err) {
  console.error(`Error parsing JSON: ${err.message}`);
  process.exit(1);
}

if (!Array.isArray(records)) {
  console.error('Error: input file must contain a JSON array of records.');
  process.exit(1);
}

const { valid, invalid } = validateRecords(records);
const summary = summarise(valid);
const report = formatReport(summary, invalid);

console.log(report);
