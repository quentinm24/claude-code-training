# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This repository contains a single Node.js project, `intake-validator/`, an internal CLI tool for validating and summarizing client intake records. There is no root-level build config — all commands are run from inside `intake-validator/`.

## Commands

Run from the `intake-validator/` directory:

```
npm install                              # install dependencies (none currently declared)
node index.js <path-to-records-file>     # run the CLI against a records file
npm start                                 # shortcut for: node index.js data/sample-records.json
npm test                                  # run the full test suite
node --test tests/processor.test.js       # same as npm test
node --test --test-name-pattern="<name>" tests/processor.test.js   # run a single test by name
```

## Architecture

The tool is a straight pipeline, wired together in `index.js`:

1. `index.js` — CLI entry point. Resolves the input file path from argv, reads it, `JSON.parse`s it, and validates that the top-level value is an array. All I/O and argument handling lives here; everything downstream is pure functions.
2. `src/processor.js` — core logic, no I/O:
   - `validateRecord(record)` — checks a single record has a non-empty `id`, non-empty `name`, an `email` containing `@`, a `status` in `active`/`pending`/`closed`, a `score` in `0-100`, and a parseable `submittedAt` date. Returns `{ ok, reason }`.
   - `validateRecords(records)` — maps `validateRecord` over an array, splitting into `{ valid, invalid }` (invalid entries carry the failure `reason`).
   - `summarise(records)` — computes `total`, `byStatus` counts, `averageScore`, and `oldest`/`newest` submission dates from the valid records.
3. `src/reporter.js` — `formatReport(summary, invalid)` turns the `summarise()` output and the invalid-record list into the human-readable report string printed to stdout.

Data flows one way: `index.js` → `validateRecords` → `summarise` (on the valid subset) → `formatReport` → `console.log`. When changing the shape of a record or the summary object, all three files in `src/` plus `tests/processor.test.js` need to stay in sync.

## Known issue

`summarise()` in `src/processor.js` has a documented off-by-one bug: it divides `scoreTotal` by `records.length + 1` instead of `records.length`, so `averageScore` is always computed slightly low. This currently causes 2 of the 12 tests in `tests/processor.test.js` to fail (`npm test`) — the failures are in the average-score assertions, not the fix's own test names.
