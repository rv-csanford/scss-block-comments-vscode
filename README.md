SCSS Block Comments Readme
=====
This extension allows developers to automatically format their SCSS files to have end-of-block comments including the selector. This is done to allow for greater positional clarity when navigating larger scss files.  
  
## Features
  
Press `CMD+Shift+P` then select `SCSS Block Comments`.  
  
If you have "scssComments.formatterEnable" set to true then the extension hooks into built in VSCode formatting. Either `CMD+Shift+P` and `Format Document` or set up format on save in VSCode settings.  
NOTE: If you enable this option, you must restart VSCode to use the native Format commands.  
  
## Extension Settings
  
"scssComments.formatterEnable" : false,
  
    Use SCSS Block Comments as your default SCSS formatter (will take precedence over any other formatters).  
    Use this if you want to use format on save or just dont use other SCSS formatters.

  
"scssComments.verboseSelectors" : true,  
  
    Concatenate nested selectors for the end-of-block comment if true.
  
"scssComments.includeMediaQueries" : false,  

    Include media query comments if true.  
