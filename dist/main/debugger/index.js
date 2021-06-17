"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
function padLeft(num, str) {
    while (str.length < num) {
        str = ' ' + str;
    }
    return str;
}
function indicatorForLocaction(loc) {
    const indicator = padLeft(loc.start.column, '^');
    return indicator;
}
function padStart(length, str) {
    let paddedStr = str;
    while (length--) {
        paddedStr = ' ' + paddedStr;
    }
    return paddedStr;
}
function errorType(type) {
    switch (type) {
        case "ValidationError":
            return 'Validation Error:';
        case "ResolutionError":
            return 'Identifier Resolution Error:';
        case "GenerationError":
            return 'Code Generation Error:';
    }
}
function printErrorForFile(file) {
    const sourceLines = file.sourceFile.source.split(os.EOL);
    const formattedErrors = file.errors.map((next) => {
        return formatError(next);
    });
    function getSourceLine(lineNumber) {
        return sourceLines[lineNumber - 1];
    }
    function formatError(err) {
        return {
            sourceLine: getSourceLine(err.loc.start.line),
            locIndicator: indicatorForLocaction(err.loc),
            line: err.loc.start.line,
            column: err.loc.start.column,
            message: err.message,
            type: err.type,
        };
    }
    console.log(`Error generating file '${file.sourceFile.path}/${file.sourceFile.name}.thrift': ${file.errors.length} errors found:`);
    formattedErrors.forEach((err) => {
        const prefix = `${err.line} | `;
        console.log();
        console.log(`${errorType(err.type)}\n`);
        console.log(`Message: ${err.message}`);
        console.log();
        console.log(`${prefix}${err.sourceLine}`);
        console.log(padStart(prefix.length, err.locIndicator));
        console.log();
    });
}
function printErrorsForFiles(files) {
    files.forEach((next) => {
        printErrorForFile(next);
    });
}
exports.printErrorsForFiles = printErrorsForFiles;
function printErrors(files) {
    files.forEach((next) => {
        console.log(`Errors encountered while generating namesapce: ${next.namespace.name}`);
        console.log();
        next.errors.forEach((err) => {
            console.log(`Error: ${err.message}`);
            console.log();
        });
    });
}
exports.printErrors = printErrors;
function collectInvalidFiles(resolvedFiles, errors = []) {
    for (const file of resolvedFiles) {
        if (file.errors.length > 0) {
            errors.push(file);
        }
    }
    return errors;
}
exports.collectInvalidFiles = collectInvalidFiles;
//# sourceMappingURL=index.js.map