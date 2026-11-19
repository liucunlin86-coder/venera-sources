VeneraX Comic Source Repository

A community repository for organizing and maintaining JavaScript comic sources compatible with VeneraX.

Repository

This repository provides an "index.json" file that can be added to VeneraX as a source library.

Repository URL:

"https://github.com/liucunlin86-coder/venera-sources"

Index URL:

"https://raw.githubusercontent.com/liucunlin86-coder/venera-sources/main/index.json"

Repository URL vs. Source Script URL

There are two different URLs:

- Repository URL: Points to the "index.json" file containing a list of sources.
- Source Script URL: Points directly to an individual ".js" source file.

When adding this repository to VeneraX, use the Index URL.

Index Format

The "index.json" file must contain a JSON array.

Each source entry must include:

Field| Required| Description
"key"| Yes| Unique source identifier
"version"| Yes| Source version
"url"| One of two| Direct URL to the JavaScript source
"fileName"| One of two| Source file path relative to the index
"name"| No| Display name
"description"| No| Source description

Use exactly one of "url" or "fileName" for each entry.

Example: Using a direct URL

[
  {
    "key": "example_source",
    "name": "Example Source",
    "version": "1.0.0",
    "url": "https://example.com/example.js",
    "description": "Example comic source"
  }
]

Example: Using fileName

[
  {
    "key": "example_source",
    "name": "Example Source",
    "version": "1.0.0",
    "fileName": "sources/example.js",
    "description": "Example comic source"
  }
]

These examples are format demonstrations only. They are not working sources.

Source Script Requirements

Each source should:

- Be written in JavaScript.
- Define a class extending "ComicSource".
- Have a unique "key".
- Include a source "version".
- Follow the API supported by the target VeneraX version.
- Be tested in VeneraX before being published.

Search, comic details, chapter lists, and image loading must be implemented according to the actual app API.

Compatibility

This repository currently targets:

- VeneraX 3.0.0

Source scripts must be checked against the target version before being marked compatible.

Repository Structure

venera-sources/
├── index.json
├── README.md
├── .gitignore
├── .github/
│   └── workflows/
│       └── check.yml
└── sources/
    ├── README.md
    └── _template.js

Quality Control

GitHub Actions automatically checks:

- JSON syntax
- Required index fields
- Duplicate source keys
- JavaScript syntax
- Empty JavaScript files

Passing automated checks does not guarantee that a source works inside VeneraX. Sources must also be tested in the app.

Source Status

Status| Meaning
Planned| Not started
Developing| Implementation in progress
Testing| Currently being tested
Stable| Tested and working
Broken| Currently not working

Contribution Rules

1. One source per JavaScript file.
2. Every source must have a unique key.
3. Keep "index.json" entries consistent with source files.
4. Do not publish untested sources as Stable.
5. Verify compatibility before updating a source version.
6. Do not include private credentials, cookies, or account information.

Current Status

No functional sources have been published yet.

The "index.json" file will remain an empty array until sources have been implemented and tested.