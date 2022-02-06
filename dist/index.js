"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = __importDefault(require("./engine"));
var tree1_json_1 = __importDefault(require("./tree1.json"));
var prompt = require("prompt");
prompt.start();
var displayHandler = function (message) {
    console.log(message);
};
var inputHandler = function (responses, cb) {
    responses.forEach(function (r, i) {
        console.log(i + ": " + r.mes);
    });
    prompt.get("res", function (err, results) {
        if (results.res) {
            console.log("calling cb with", results.res);
            cb(results.res);
        }
        else if (err) {
            throw err;
        }
    });
};
var de = new engine_1.default({
    displayHandler: displayHandler,
    inputHandler: inputHandler,
});
de.loadTree(tree1_json_1.default);
de.startTree();
//# sourceMappingURL=index.js.map