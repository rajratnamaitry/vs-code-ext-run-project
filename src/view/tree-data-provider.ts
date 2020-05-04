import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ThemeIcon, Task, TaskDefinition, ProcessExecution, TaskScope, ShellExecution } from 'vscode';

export class ScriptsTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    public pathData: any;
    iconPath: vscode.Uri | vscode.ThemeIcon | undefined;
    iconPathFolder: vscode.Uri | vscode.ThemeIcon | undefined;
    private _onDidChangeTreeData = new vscode.EventEmitter();
    readonly onDidChangeTreeData: vscode.Event<any | undefined> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string, private _runningTask: any) {
        this.iconPath = new ThemeIcon('wrench') ;
        this.iconPathFolder = new ThemeIcon('folder') ;
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
        let workspacePath = '';
        if(!element){
            workspacePath = this.workspaceRoot;
        } else {
            workspacePath = path.join(element.description+'');
        }
        const packageJsonFile = this._getPackageJson(path.join(workspacePath,'package.json'),workspacePath);
        if(packageJsonFile.length > 0){
            return packageJsonFile.map((schematicName: any) => schematicName );
        }else {
            return this._getSubFolder(workspacePath);
        }
    }
    private _getSubFolder(folderPath: string){
        const folders = this._getDirectories(folderPath);
        return folders.map((folder)=>{
            const item = new vscode.TreeItem(folder, vscode.TreeItemCollapsibleState.Collapsed);
            item.iconPath = this.iconPathFolder;
            item.description = path.join(folderPath,folder);
            item.contextValue = 'folder';
            return item;
        });
    }
    private _getPackageJson(packageJsonPath: string,folderPath : string) {
        if (this.pathExists(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            delete packageJson.scripts['ng'];
            return packageJson.scripts
                ? Object.keys(packageJson.scripts)
                .map((param: any) => {
                    const index = param+folderPath.trim();
                    const appendText = this._runningTask[index] ? ' (running)' : '';
                    const item = new vscode.TreeItem(param + appendText, vscode.TreeItemCollapsibleState.None);
                    let tdef: TaskDefinition = {type : 'npm' , index};
                    const task = new Task(tdef,param,'npm', new ShellExecution(packageJson.scripts[param],
                        {cwd: path.join(folderPath) }));
                    task.isBackground = true;
                    item.command = {
                        title: `RUN ${param}` + appendText,
                        command: 'run-project.scriptRun',
                        arguments: [task]
                    };
                    item.iconPath = this.iconPath;
                    item.contextValue = this._runningTask[index] ? 'run' : 'ready';
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