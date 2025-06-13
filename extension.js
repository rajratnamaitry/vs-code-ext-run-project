const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

let scriptTerminal = null;
let preScript = vscode.workspace.getConfiguration('scriptDeck').get('preScript', '');

class ScriptTreeItem extends vscode.TreeItem {
    constructor(scriptName, scriptCmd) {
        super(scriptName, vscode.TreeItemCollapsibleState.None);
        this.description = scriptCmd;
        this.contextValue = 'scriptItem';
        this.iconPath = new vscode.ThemeIcon('wrench'); 
    }
}

class ScriptsProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren() {
        const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const scripts = pkg.scripts || {};
            return Object.keys(scripts).map(scriptName => {
                return new ScriptTreeItem(scriptName, scripts[scriptName]);
            });
        }
        return [];
    }
}

async function setPreScript() {
    const value = await vscode.window.showInputBox({
        prompt: 'Enter a one-line script to run before each script (leave empty to clear)',
        value: preScript
    });
    preScript = value || '';
    await vscode.workspace.getConfiguration('scriptDeck').update('preScript', preScript, vscode.ConfigurationTarget.Workspace);
    vscode.window.showInformationMessage(preScript ? `Pre-script set: ${preScript}` : 'Pre-script cleared.');
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }
    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const packageJsonPath = path.join(workspaceRoot, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
        vscode.window.showWarningMessage('No package.json found in workspace.');
        return;
    }

    const scriptsProvider = new ScriptsProvider(workspaceRoot);
    vscode.window.registerTreeDataProvider('run-project.scriptsView', scriptsProvider);

    context.subscriptions.push(
        vscode.commands.registerCommand('run-project.refreshScripts', () => scriptsProvider.refresh())
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('run-project.setPreScript', setPreScript)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('run-project.runScript', (item) => {
            if (!item || !item.label) return;
            if (scriptTerminal) {
                scriptTerminal.dispose();
            }
            scriptTerminal = vscode.window.createTerminal(`Script: ${item.label}`);
            scriptTerminal.show();
            if (preScript) {
                scriptTerminal.sendText(preScript);
            }
            scriptTerminal.sendText(`npm run ${item.label}`);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('run-project.stopScript', () => {
            if (scriptTerminal) {
                scriptTerminal.dispose();
                scriptTerminal = null;
            }
        })
    );
}

function deactivate() {
    if (scriptTerminal) {
        scriptTerminal.dispose();
    }
}

module.exports = {
    activate,
    deactivate,
    ScriptTreeItem,
    ScriptsProvider
};