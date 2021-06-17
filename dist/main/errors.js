"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class ValidationError extends Error {
    constructor(msg, loc) {
        super(msg);
        this.message = msg;
        this.loc = loc;
    }
}
exports.ValidationError = ValidationError;
function createValidationError(message, loc = utils_1.emptyLocation()) {
    return {
        type: "ValidationError",
        message,
        loc,
    };
}
exports.createValidationError = createValidationError;
//# sourceMappingURL=errors.js.map