"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const includes_1 = require("../shared/includes");
const const_1 = require("./const");
const enum_1 = require("./enum");
const exception_1 = require("./exception");
const service_1 = require("./service");
const struct_1 = require("./struct");
const typedef_1 = require("./typedef");
const union_1 = require("./union");
const types_1 = require("./types");
function renderImports(statements, state) {
    if (includes_1.statementsUseThrift(statements)) {
        return [
            includes_1.renderThriftImports(state.options.library),
            ...includes_1.renderIncludes(statements, state),
        ];
    }
    else {
        return includes_1.renderIncludes(statements, state);
    }
}
exports.renderImports = renderImports;
function renderConst(statement, state) {
    return [const_1.renderConst(statement, types_1.typeNodeForFieldType, state)];
}
exports.renderConst = renderConst;
function renderTypeDef(statement, state) {
    return typedef_1.renderTypeDef(statement, types_1.typeNodeForFieldType, state);
}
exports.renderTypeDef = renderTypeDef;
function renderEnum(statement, state) {
    return [enum_1.renderEnum(statement)];
}
exports.renderEnum = renderEnum;
function renderStruct(statement, state) {
    return struct_1.renderStruct(statement, state);
}
exports.renderStruct = renderStruct;
function renderException(statement, state) {
    return exception_1.renderException(statement, state);
}
exports.renderException = renderException;
function renderUnion(statement, state) {
    if (state.options.strictUnions) {
        return union_1.renderStrictUnion(statement, state);
    }
    else {
        return union_1.renderUnion(statement, state);
    }
}
exports.renderUnion = renderUnion;
function renderService(statement, state) {
    return service_1.renderService(statement, state);
}
exports.renderService = renderService;
exports.renderer = {
    renderIndex: shared_1.renderIndex,
    renderImports,
    renderConst,
    renderTypeDef,
    renderEnum,
    renderStruct,
    renderException,
    renderUnion,
    renderService,
};
//# sourceMappingURL=index.js.map