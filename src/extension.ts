// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const replacements = [
  { pattern: /^(\s{0,})"/g, replacement: ''},
  { pattern: /"(\s{0,})$/g, replacement: ''},
  { pattern: /\\n/g, replacement: '\n'},
  { pattern: /\\"/g, replacement: '"'},
  { pattern: /\sfrom|\sFROM/g, replacement: '\nFROM'},
  { pattern: /\s{0,}select|\s{0,}SELECT/g, replacement: '\nSELECT\n'},
  { pattern: /\sleft\sjoin|\sLEFT\sJOIN/g, replacement: '\nLEFT JOIN'},
  { pattern: /\sorder\sby\s|\sORDER\sBY\s/g, replacement: '\n\nORDER BY\n'},
  { pattern: /\sor|\sOR/g, replacement: '\n\tOR'},
  { pattern: /\sand|\sAND/g, replacement: '\n\tAND'},
  { pattern: /\sunion\s|\sUNION\s/g, replacement: '\n\nUNION\n'},
  { pattern: /,/g, replacement: ',\n'},
];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('prettify-postgresql.prettify', () => {
      // The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const { document, selection } = editor;

      const { start: { line: startLine }, end: { line: endLine } } = selection;

      const selectedLines = Array
        .from(Array(endLine - startLine + 1)
          .keys()
        )
        .map(n => startLine + n)
        .map(l => document.lineAt(l).text);

      let sqlString = selectedLines.join('');
      replacements.forEach((replacement) => {
        sqlString = sqlString.replace(replacement.pattern, replacement.replacement);
      });

      editor.edit(editBuilder => editBuilder.replace(selection, sqlString));
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
