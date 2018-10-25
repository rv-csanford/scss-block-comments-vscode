const vscode = require('vscode');

// this method is called when the extension is activated
function activate(context) {
  console.log(
    'Congratulations, your extension "scss-block-comments" is now active!'
  );
  let config = {
    verboseSelectors: vscode.workspace
      .getConfiguration()
      .get('scssComments.verboseSelectors'),
    includeMediaQueries: vscode.workspace
      .getConfiguration()
      .get('scssComments.includeMediaQueries'),
    formatterEnable: vscode.workspace
      .getConfiguration()
      .get('scssComments.formatterEnable'), 
  };

  let disposable = vscode.commands.registerCommand('extension.formatScssBlocks', function () {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }
    let document = editor.document;

    let lineCount = document.lineCount;
    let selector = '';
    let selectors = [];
    let cleanedSelectors = [];
    let concatSelector = '';
    let line = '';
    let edits = [];
    let edit = new vscode.WorkspaceEdit();
    let range = null;

    for (let i = 0; i < lineCount; i++) {
      // iterate over each line
      line = document.lineAt(i).text;

      if (line.indexOf('{') != -1) {
        // trim selector and add to array of selectors
        selector = line.slice(0, line.indexOf('{')).trim();
        if (config.verboseSelectors) {
          if (selector.slice(0, 1) === '&') {
            selector = selector.substring(1);
          } else {
            selector = ' ' + selector;
          }
        }
        selectors.push(selector);
      }

      if (line.indexOf('}') != -1) {
        range = new vscode.Range(
          document.lineAt(i).range.start,
          document.lineAt(i).range.end
        );

        // if you have verbose selectors enabled in settings
        if (config.verboseSelectors) {
          if (selectors[selectors.length - 1].slice(0, 2) === ' @') {
            // if configured to exclude media queries
            if (!config.includeMediaQueries) {
              //just don't add an edit
            } else {
              edit.replace(
                document.uri,
                range,
                line.slice(0, line.indexOf('}') + 1) +
                  '// ' +
                  selectors[selectors.length - 1]
              );
            }
          } else {
            // create comment edit (handle concat with MQs)
            cleanedSelectors = [];
            selectors.map(select => {
              if (select.slice(0, 2) === ' @') {
                // do nothing (do not add mediaqueries to concat selectors)
              } else {
                cleanedSelectors.push(select);
              }
            });
            for (let k = 0; k < selectors.length; k++) {}
            concatSelector = cleanedSelectors.join('');
            edit.replace(
              document.uri,
              range,
              line.slice(0, line.indexOf('}') + 1) + ' //' + concatSelector
            );
          }
        } else {
          if (selectors[selectors.length - 1].slice(0, 2) === ' @') {
            // if configured to exclude media queries
            if (!config.includeMediaQueries) {
              // do nothing
            } else {
              edit.replace(
                document.uri,
                range,
                line.slice(0, line.indexOf('}') + 1) +
                  ' //' +
                  selectors[selectors.length - 1]
              );
            }
          } else {
            // create comment edit
            edit.replace(
              document.uri,
              range,
              line.slice(0, line.indexOf('}') + 1) +
                ' //' +
                selectors[selectors.length - 1]
            );
          }
        }
        // remove last selector in stack
        selectors.pop();
        // push edit to array
        edits.push(edit);
      }
    }

    // apply edits
    edits.map(edit => {
      vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
        } else {
        }
      });
    });
  });
  
  context.subscriptions.push(disposable);
  if (config.formatterEnable) {
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

        for (let i = 0; i < lineCount; i++) {
          // iterate over each line
          line = document.lineAt(i).text;

          if (line.indexOf('{') != -1) {
            // trim selector and add to array of selectors
            selector = line.slice(0, line.indexOf('{')).trim();
            if (config.verboseSelectors) {
              if (selector.slice(0, 1) === '&') {
                selector = selector.substring(1);
              } else {
                selector = ' ' + selector;
              }
            }
            selectors.push(selector);
          }

          if (line.indexOf('}') != -1) {
            range = new vscode.Range(
              document.lineAt(i).range.start,
              document.lineAt(i).range.end
            );

            // if you have verbose selectors enabled in settings
            if (config.verboseSelectors) {
              if (selectors[selectors.length - 1].slice(0, 2) === ' @') {
                // if configured to exclude media queries
                if (!config.includeMediaQueries) {
                  //just don't add an edit
                } else {
                  edit.replace(
                    document.uri,
                    range,
                    line.slice(0, line.indexOf('}') + 1) +
                      '// ' +
                      selectors[selectors.length - 1]
                  );
                }
              } else {
                // create comment edit (handle concat with MQs)
                cleanedSelectors = [];
                selectors.map(select => {
                  if (select.slice(0, 2) === ' @') {
                    // do nothing (do not add mediaqueries to concat selectors)
                  } else {
                    cleanedSelectors.push(select);
                  }
                });
                for (let k = 0; k < selectors.length; k++) {}
                concatSelector = cleanedSelectors.join('');
                edit.replace(
                  document.uri,
                  range,
                  line.slice(0, line.indexOf('}') + 1) + ' //' + concatSelector
                );
              }
            } else {
              if (selectors[selectors.length - 1].slice(0, 2) === ' @') {
                // if configured to exclude media queries
                if (!config.includeMediaQueries) {
                  // do nothing
                } else {
                  edit.replace(
                    document.uri,
                    range,
                    line.slice(0, line.indexOf('}') + 1) +
                      ' //' +
                      selectors[selectors.length - 1]
                  );
                }
              } else {
                // create comment edit
                edit.replace(
                  document.uri,
                  range,
                  line.slice(0, line.indexOf('}') + 1) +
                    ' //' +
                    selectors[selectors.length - 1]
                );
              }
            }
            // remove last selector in stack
            selectors.pop();
            // push edit to array
            edits.push(edit);
          }
        }

        // apply edits
        edits.map(edit => {
          vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
            } else {
            }
          });
        });
      }
    });
  }
  
}
exports.activate = activate;

// this method is called when extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
