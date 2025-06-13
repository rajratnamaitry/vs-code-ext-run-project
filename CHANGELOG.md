# Change Log

All notable changes to the "run-project" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [2.0.0] - 2025-06-13

- Added support for running a configurable pre-script before each script execution (via settings or command).
- Added `Set Pre-Script` command to easily set or clear the pre-script from the command palette.

## [1.1.1] - 2025-06-13

- Show scripts from `package.json` in a panel in the Activity Bar.
- Run and stop scripts from the panel using context menu actions.
- Scripts execute in a dedicated VS Code terminal and show output live.
- Only one script can be run at a time; running a new script stops the previous one.
- Refresh scripts list after updating `package.json`.
