# SCSS Block Comments Readme

This extension allows developers to automatically format their SCSS files to have end-of-block comments including the selector. This is done to allow for greater positional clarity when navigating larger scss files.

## Features

Hooks into built in VSCode formatting. Either CMD+Shift+P and "Format Document" or set up format on save in vscode settings.

## Extension Settings
### Defaults:

"scssComments.verboseSelectors" : true,  
  -Concatenate nested selectors for the end-of-block comment if true.  
  
"scssComments.includeMediaQueries" : false,  
  -Include media query comments if true.  
