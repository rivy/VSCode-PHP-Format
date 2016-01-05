var vscode = require('vscode');
var beautify = require('js-beautify').html;
var beautifier = require('beautifier');

function format(document, range, options) {
    if (range === null) {
        var start = new vscode.Position(0, 0);
        var end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        range = new vscode.Range(start, end);
    }
    var result = [];
    var content = document.getText(range);

    var fieldPHP = new Array();
    var stringHTML = content;

    var nextNumber = -1;

    while (stringHTML.indexOf("<?php") != -1) {
        nextNumber++;
        var firstBracket = stringHTML.indexOf("<?php");
        var secondBracket = stringHTML.indexOf("?>");
        fieldPHP.push(stringHTML.substring(firstBracket, secondBracket + editor.tabSize));
        var find = stringHTML.substring(firstBracket, secondBracket + editor.tabSize);
        stringHTML = stringHTML.replace(find, "<!--Replace" + nextNumber + "-->");
    }

    stringHTML = beautify(stringHTML, { indent_size: editor.tabSize });

    for (var index = 0; index < fieldPHP.length; index++) {
        var change1 = fieldPHP[index].replace("<?php", "//firstCH\n");
        var change2 = change1.replace("?>", "//secondCH\n");
        var clear1 = beautifier.js_beautify(change2, { indent_size: editor.tabSize });
        var clear2 = clear1.replace("//firstCH", "<?php");
        var clear3 = clear2.replace("//secondCH", "?>");
        var clear4 = clear3.split('- >').join('->');
        var clear5 = clear4.split('= >').join('=>');
        var clear6 = clear5.split('. =').join(' .=');
        var clear = clear6.replace("\n", " ");
        stringHTML = stringHTML.replace("<!--Replace" + index + "-->", clear);
    }

    if (stringHTML) {
        result.push(new vscode.TextEdit(range, stringHTML));
    }

    return result;
}

function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('php', {
        provideDocumentFormattingEdits: function (document, options, token) {
            return format(document, null, options);
        }
    }));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('php', {
        provideDocumentRangeFormattingEdits: function (document, range, options, token) {
            var start = new vscode.Position(0, 0);
            var end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            return format(document, new vscode.Range(start, end), options);
        }
    }));
}

exports.activate = activate;
