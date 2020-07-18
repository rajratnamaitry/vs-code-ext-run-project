// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ScriptsTreeDataProvider } from './view';
let treeDataProvider: vscode.TreeView<vscode.TreeItem> | undefined;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
const runningTask:any= {};
let scriptTree: ScriptsTreeDataProvider;
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "run-project" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	scriptTree = new ScriptsTreeDataProvider(vscode.workspace.rootPath+'',runningTask);
	let disposable = vscode.commands.registerCommand('run-project.scriptRun', scriptRun );
	vscode.commands.registerCommand('run-project.scriptStop', scriptStop);
	treeDataProvider = vscode.window.createTreeView('angular-runProject', {
		treeDataProvider: scriptTree,
	});
	treeDataProvider.message = `List of Script`;
	context.subscriptions.push(disposable);
}
function scriptRun (param?: any) {
	// The code you place here will be executed every time your command is executed
	let task = param;
	if(param['command']){
		task = param.command.arguments[0];
	}
	vscode.tasks.executeTask(task).then(function (value:any) {
		vscode.window.showInformationMessage(value.task.name +' Command(s) are already running!');
		runningTask[value.task['definition']['index']] = value;
		scriptTree.refresh();
		return value;
	}, function(e) {
		console.error('I am error',e);
	});
}
function scriptStop(param: any){
	const index = param.command.arguments[0]['definition']['index'];
	runningTask[index].terminate();
	delete runningTask[index];
	scriptTree.refresh();
}
// this method is called when your extension is deactivated
export function deactivate() {
	scriptTree.refresh();
}
