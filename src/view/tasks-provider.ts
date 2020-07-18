import * as vscode from 'vscode';
export class TasksDataProvider extends vscode.Task {
    private _onDidEndTask = new vscode.EventEmitter();
    readonly onDidEndTask: vscode.Event<any | undefined> = this._onDidEndTask.event;
    constructor(
        taskDef: vscode.TaskDefinition,
        name: string, 
        source: string,
        execution?: vscode.ShellExecution,
        ){
        super(taskDef,name,source,execution);
    }
}