const vscode = require('vscode');

// this method is called when the extension is activated
function activate(context) {
    console.log('Congratulations, your extension "scss-block-comments" is now active!');

    vscode.languages.registerDocumentFormattingEditProvider('scss', {
        provideDocumentFormattingEdits(document) {
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
                verboseSelectors: vscode.workspace.getConfiguration().get('conf.verboseSelectors'),
                includeMediaQueries: vscode.workspace.getConfiguration().get('conf.includeMediaQueries')
            };

            for (let i=0; i < lineCount; i++) {
                // iterate over each line
                line = document.lineAt(i).text;

                if (line.indexOf('{') != -1) {
                    // trim selector and add to array of selectors
                    selector = line.slice(0, line.indexOf('{')).trim();
                    selectors.push(selector);
                }

                if (line.indexOf('}') != -1) {
                    range = new vscode.Range( document.lineAt(i).range.start,  document.lineAt(i).range.end);

                    // if you have verbose selectors enabled in settings
                    if (config.verboseSelectors) {
                        // if at the end of a block with an & selector
                        if (selectors[selectors.length-1].slice(0, 1) === '&') {
                            // strip '&' and concatenate selectors
                            cleanedSelectors = [];
                            for (let k = 0; k < selectors.length; k++)  {
                                cleanedSelectors.push(selectors[k].replace('&', ''));
                            }
                            concatSelector = cleanedSelectors.join('');

                            // create comment edit
                            edit.replace(document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '// ' + concatSelector));
                        } else {
                            if (selectors[selectors.length-1].slice(0, 1) === '@') {
                                // if configured to exclude media queries
                                if (!config.includeMediaQueries) {
                                    //just don't add an edit
                                } else {
                                   edit.replace(document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '// ' + selectors[selectors.length-1]));
                                }
                            } else {
                                // create comment edit
                                cleanedSelectors = []
                                for (let k=0; k < selectors.length; k++) {
                                    if (selectors[k].slice(0, 1) === '@') {
                                        // do nothing (do not add mediaqueries to concat selectors)
                                    } else {
                                        cleanedSelectors.push(selectors[k]);
                                    }
                                }
                                concatSelector = cleanedSelectors.join('');
                                edit.replace(document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '// ' + concatSelector));
                            }
                        }
                    } else {
                        if (selectors[selectors.length-1].slice(0, 1) === '@') {
                            // if configured to exclude media queries
                            if (!config.includeMediaQueries) {
                            } else {
                                edit.replace(document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '// ' + selectors[selectors.length-1]));
                            }
                        } else {
                            // create comment edit
                            edit.replace(document.uri, range, (line.slice(0, line.indexOf('}') + 1) + '// ' + selectors[selectors.length-1]));
                        }
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
}
exports.activate = activate;

// this method is called when extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;