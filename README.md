# ScriptDeck (run-project)

ScriptDeck is a VS Code extension that lists scripts from your project's `package.json` and lets you run or stop them directly from a panel in the Activity Bar.

## Features

- **Lists all scripts** from your workspace's `package.json` in a dedicated panel.
- **Run any script** with a single click (context menu or inline button).
- **Stop the running script** from the same panel.
- **Scripts execute in a VS Code terminal** and show output live.
- **Refresh scripts** if you update your `package.json`.

![ScriptDeck Screenshot](demo.gif)

## Requirements

- Your workspace must contain a `package.json` file with scripts defined.
- Node.js and npm should be installed and available in your system PATH.

## Usage

1. Open a folder with a `package.json`.
2. Click the **Run Project** icon in the Activity Bar.
3. See all available scripts listed.
4. Right-click a script to **Run Script** or **Stop Script**.
5. The script runs in a dedicated terminal. You can stop it from the panel.

## Extension Settings

This extension does not add any custom settings.

## Known Issues

- Only one script can be run at a time from the panel. Running a new script will stop the previous one.
- Only scripts from the root `package.json` are shown.

## Release Notes

### 1.1.1

- Show scripts from `package.json` in a panel.
- Run and stop scripts from the panel.
- Scripts run in a VS Code terminal.

---

**Enjoy using ScriptDeck!**

For feedback or issues, visit the [GitHub repository](https://github.com/rajratnamaitry/runNpmProject/)
