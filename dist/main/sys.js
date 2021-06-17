"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const printer_1 = require("./printer");
function saveFiles(files, outDir) {
    files.forEach((next) => {
        const outPath = path.resolve(outDir, next.path, `${next.name}.${next.ext}`);
        try {
            fs.outputFileSync(outPath, printer_1.print(next.body, true));
        }
        catch (err) {
            throw new Error(`Unable to save generated files to: ${outPath}`);
        }
    });
}
exports.saveFiles = saveFiles;
//# sourceMappingURL=sys.js.map