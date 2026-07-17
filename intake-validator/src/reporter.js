'use strict';

/**
 * reporter.js
 * Formats the validation summary into a human-readable report.
 */

/**
 * Format a summary report.
 *
 * @param {object} summary  - output of summarise()
 * @param {Array}  invalid  - array of { record, reason } from validateRecords()
 * @returns {string}
 */
function formatReport(summary, invalid) {
  const lines = [];

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('  CLIENT INTAKE VALIDATION REPORT');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');

  if (summary.total === 0 && invalid.length === 0) {
    lines.push('  No records found.');
    lines.push('');
    return lines.join('\n');
  }

  lines.push(`  Total valid records  : ${summary.total}`);
  lines.push(`  Total invalid records: ${invalid.length}`);
  lines.push('');

  if (summary.total > 0) {
    lines.push('  Status breakdown:');
    for (const [status, count] of Object.entries(summary.byStatus)) {
      const bar = '█'.repeat(Math.min(count, 20));
      lines.push(`    ${status.padEnd(10)} ${String(count).padStart(3)}  ${bar}`);
    }
    lines.push('');

    lines.push(`  Average score  : ${summary.averageScore}`);
    lines.push(`  Oldest record  : ${summary.oldest}`);
    lines.push(`  Newest record  : ${summary.newest}`);
    lines.push('');
  }

  if (invalid.length > 0) {
    lines.push('  Invalid records:');
    for (const { record, reason } of invalid) {
      const id = record && record.id ? record.id : '(no id)';
      const name = record && record.name ? record.name : '(no name)';
      lines.push(`    ✗  ${id} — ${name}: ${reason}`);
    }
    lines.push('');
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');

  return lines.join('\n');
}

module.exports = { formatReport };
