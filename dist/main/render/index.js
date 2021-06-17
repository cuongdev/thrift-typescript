"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apache_1 = require("./apache");
const thrift_server_1 = require("./thrift-server");
function rendererForTarget(target = 'apache') {
    switch (target) {
        case 'thrift-server':
            return thrift_server_1.renderer;
        case 'apache':
            return apache_1.renderer;
        default:
            const msg = target;
            throw new Error(`Non-exhaustive match for ${msg}`);
    }
}
exports.rendererForTarget = rendererForTarget;
//# sourceMappingURL=index.js.map