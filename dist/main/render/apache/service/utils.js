"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalize = capitalize;
function createStructArgsName(def) {
    return `${capitalize(def.name.value)}Args`;
}
exports.createStructArgsName = createStructArgsName;
function createStructResultName(def) {
    return `${capitalize(def.name.value)}Result`;
}
exports.createStructResultName = createStructResultName;
//# sourceMappingURL=utils.js.map