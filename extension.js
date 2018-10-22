// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "scss-block-comments" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.formatScssBlocks', function () {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        let lineCount = editor.document.lineCount;

        let selector = '';
        let selectors = [];
        let concatSelector = '';
        let line = '';
        let edits = [];
        let edit = new vscode.WorkspaceEdit();
        let range = null;

        for (let i=0; i < lineCount; i++) {
            line = editor.document.lineAt(i).text;

            if (line.indexOf('{') != -1) {
                selector = line.slice(0, line.indexOf('{')).trim();
                selectors.push(selector)
            }

            if (line.indexOf('}') != -1) {
                range = new vscode.Range( editor.document.lineAt(i).range.start,  editor.document.lineAt(i).range.end);

                // if at the end of a block with an & selector
                if (selectors[selectors.length-1].slice(0, 1) === '&') {
                    for (let k = 0; k < selectors.length; k++)  {
                        selectors[k] = selectors[k].replace('&', '');
                    }
                    console.log(selectors);
                    concatSelector = selectors.join('');
                    console.log(concatSelector);
                    edit.replace(editor.document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '//' + concatSelector));
                } else {
                    edit.replace(editor.document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '//' + selectors[selectors.length-1]));
                }
                selectors.splice(-1,1)
                edits.push(edit);
            }
        }

        for (let j = 0; j < edits.length; j++) {
            vscode.workspace.applyEdit(edits[j]).then(success => {
                if (success) {
                } else {
                }
            });
        }


        // vscode.window.showInformationMessage(openBrackets);
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;