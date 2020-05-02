import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ThemeIcon, Task, TaskDefinition, ProcessExecution, TaskScope, ShellExecution } from 'vscode';

export class ScriptsTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    public pathData: any;
    iconPath: vscode.Uri | vscode.ThemeIcon | undefined;
    private _onDidChangeTreeData = new vscode.EventEmitter();
    readonly onDidChangeTreeData: vscode.Event<any | undefined> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string, private _runningTask: any) {
        this.iconPath = new ThemeIcon('wrench') ;
    }

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: vscode.TreeItem | undefined): Promise<vscode.TreeItem[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No Package.json in empty workspace');
            return Promise.resolve([]);
        }
        const packageJsonFile = this._getPackageJson(path.join(this.workspaceRoot, 'package.json'));
        if(packageJsonFile.length > 0){
            return packageJsonFile.map((schematicName: any) => schematicName );
        }
        return Promise.resolve([]);
    }

    private _getPackageJson(packageJsonPath: string) {
        if (this.pathExists(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            delete packageJson.scripts['ng'];
            return packageJson.scripts
                ? Object.keys(packageJson.scripts)
                .map((param: any) => {
                    const appendText = this._runningTask[param] ? ' (running)' : '';
                    const item = new vscode.TreeItem(param + appendText, vscode.TreeItemCollapsibleState.None);
                    let tdef: TaskDefinition = {type : 'npm'};
                    const task = new Task(tdef,param,'npm', new ShellExecution(packageJson.scripts[param]));
                    task.isBackground = true;
                    item.command = {
                        title: `RUN ${param}` + appendText,
                        command: 'run-project.scriptRun',
                        arguments: [undefined,{ name:param, excu : packageJson.scripts[param] , task }]
                    };
                    item.iconPath = this.iconPath;
                    item.contextValue = this._runningTask[param] ? 'run' : 'ready';
                    return item;
                }): [];
        } else {
            return [];
        }
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }
        return true;
    }
    private _getDirectories(path: string) {
        return fs.readdirSync(path).filter(function (file) {
          return fs.statSync(path+'/'+file).isDirectory();
        });
    }
}