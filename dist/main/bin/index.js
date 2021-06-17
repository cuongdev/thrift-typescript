#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const resolveOptions_1 = require("./resolveOptions");
const cliArgs = process.argv.slice(2);
const options = resolveOptions_1.resolveOptions(cliArgs);
index_1.generate(options);
//# sourceMappingURL=index.js.map