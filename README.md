# Venera Source Repository Starter

This is a starter repository layout for organizing Venera-compatible comic sources.


## Files
- `index.json`: source index (currently empty; add entries only after a source is implemented and tested).
- `sources/`: JavaScript source files.
- `sources/_template.js`: neutral starter template for a source.

## Index format
Each source entry typically contains:
- `name`: display name
- `key`: unique stable identifier
- `version`: source version
- `fileName`: JS filename relative to the index
- `description` (optional)

Example entry (replace values with a real, tested source):
```json
{
  "name": "Example Source",
  "key": "example_source",
  "version": "1.0.0",
  "fileName": "sources/example_source.js",
  "description": "Placeholder example"
}
```

Do not add the placeholder to `index.json` until the source is implemented and validated against the target app version.
