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
    vscode.languages.registerDocumentFormattingEditProvider('scss', {
        provideDocumentFormattingEdits(document) {

            // let editor = vscode.window.activeTextEditor;
            // if (!editor) {
            //     return; // No open text editor
            // }

            let lineCount = document.lineCount;
            let selector = '';
            let selectors = [];
            let cleanedSelectors = [];
            let concatSelector = '';
            let line = '';
            let edits = [];
            let edit = new vscode.WorkspaceEdit();
            let range = null;

            let config = {
                verboseSelectors: vscode.workspace.getConfiguration().get('conf.verboseSelectors')
            };
            console.log('config: ', config);


            for (let i=0; i < lineCount; i++) {
                // iterate over each line
                line = document.lineAt(i).text;

                if (line.indexOf('{') != -1) {
                    // trim selector and add to array of selectors
                    selector = line.slice(0, line.indexOf('{')).trim();
                    selectors.push(selector)
                }

                if (line.indexOf('}') != -1) {
                    range = new vscode.Range( document.lineAt(i).range.start,  document.lineAt(i).range.end);

                    // if you have verbose selectors enabled in settings
                    if(config.verboseSelectors) {
                        // if at the end of a block with an & selector
                        if (selectors[selectors.length-1].slice(0, 1) === '&') {
                            // strip '&' and concatenate selectors
                            cleanedSelectors = [];
                            for (let k = 0; k < selectors.length; k++)  {
                                cleanedSelectors.push(selectors[k].replace('&', ''));
                            }
                            concatSelector = cleanedSelectors.join('');

                            // create comment edit
                            edit.replace(document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '//' + concatSelector));
                        } else {
                            // create comment edit
                            edit.replace(document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '//' + selectors[selectors.length-1]));
                        }
                    } else {
                        // create comment edit
                        edit.replace(document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '//' + selectors[selectors.length-1]));
                    }

                    // remove last selector in stack
                    selectors.pop();
                    // push edit to array
                    edits.push(edit);
                }
            }

            // apply edits
            for (let j = 0; j < edits.length; j++) {
                vscode.workspace.applyEdit(edits[j]).then(success => {
                    if (success) {
                    } else {
                    }
                });
            }
        }
    });

    //context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;