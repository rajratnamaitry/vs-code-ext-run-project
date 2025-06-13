# ScriptDeck (run-project)

ScriptDeck is a VS Code extension that lists scripts from your project's `package.json` and lets you run or stop them directly from a panel in the Activity Bar.

## Features

- **Lists all scripts** from your workspace's `package.json` in a dedicated panel.
- **Run any script** with a single click (context menu or inline button).
- **Stop the running script** from the same panel.
- **Scripts execute in a VS Code terminal** and show output live.
- **Refresh scripts** if you update your `package.json`.
- **Pre-script support:** Run a custom one-line command before each script (configurable in settings).

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

## Example

Suppose your `package.json` contains:
```json
{
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Running tests...\""
  }
}
```
ScriptDeck will show both `start` and `test` scripts in the panel. You can run or stop either script directly from the ScriptDeck panel.

## Extension Settings

### Pre-Script

You can configure a command to run before every script executed from ScriptDeck by setting the `scriptDeck.preScript` property in your workspace or user settings.

## How to Set the Pre-Script Property

You can set the pre-script in two ways:

### Method 1: Using the Command Palette

1. Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> (Windows/Linux) or <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> (Mac) to open the Command Palette.
2. Type `Set Pre-Script` and select the `ScriptDeck: Set Pre-Script` command.
3. Enter your desired one-line script (e.g., `echo Pre-script running && timeout /t 5 /nobreak > nul`) and press Enter.
4. The pre-script will now run before every script you execute from ScriptDeck.

### Method 2: Editing settings.json Directly

1. Open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> or <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>).
2. Type `Preferences: Open Settings (JSON)` and select it.
3. Add or edit the following lines in your `settings.json`:

   ```json
   // Example: Run a message and wait 5 seconds before each script
   "scriptDeck.preScript": "echo Pre-script running && timeout /t 5 /nobreak > nul"
   ```

   Or, if you need to set up your Node.js environment Or load any modules before running scripts:

   ```json
   // Example: Set Node.js path before running script
   "scriptDeck.preScript": "C:\\Windows\\System32\\cmd.exe /k \"C:\\Program Files\\nodejs\\nodevars.bat\""
   ```

   > **Note:** Adjust the path as needed for your system. Double backslashes are required in JSON.

4. Save the file.

Now, every time you run a script from ScriptDeck, your pre-script will execute first.

## Known Issues

- Only one script can be run at a time from the panel. Running a new script will stop the previous one.
- Only scripts from the root `package.json` are shown.

## Release Notes

### 2.0.0

- Added support for running a configurable pre-script before each script execution (via settings or command).
- Added `Set Pre-Script` command to easily set or clear the pre-script from the command palette.

### 1.1.1

- Show scripts from `package.json` in a panel.
- Run and stop scripts from the panel.
- Scripts run in a VS Code terminal.

---

**Enjoy using ScriptDeck!**

For feedback or issues, visit the [GitHub repository](https://github.com/rajratnamaitry/runNpmProject/)
