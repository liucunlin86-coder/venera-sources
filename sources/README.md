Source Directory

This directory stores VeneraX comic source scripts.

Status Legend

- Planned: not started
- Developing: implementation in progress
- Testing: being tested in VeneraX
- Stable: tested and confirmed working
- Broken: currently not working

Source Registry

Source| Key| Status| Version| Compatibility| Notes
VeneraX 测试源| demo_test_source| Testing| 1.1.0| VeneraX 3.0.0+| Core functions tested; pagination needs final confirmation

Files

- "demo_test.js": neutral demo source for testing
- "_template.js": reusable source development template

Development Rules

1. One source per JavaScript file.
2. Every source must have a unique key.
3. Follow the VeneraX 3.0.0 API.
4. Test search, pagination, comic details, chapters and image loading.
5. Do not add untested scripts to the main index.
6. Keep source scripts and index entries consistent.
7. Update this registry when source status changes.

Compatibility

This repository targets VeneraX 3.0.0.

Source scripts must be checked against the corresponding application API before being marked Stable.