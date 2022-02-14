"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DialogEngine = /** @class */ (function () {
    function DialogEngine(_a) {
        var _this = this;
        var _b = _a.displayHandler, displayHandler = _b === void 0 ? undefined : _b, _c = _a.inputHandler, inputHandler = _c === void 0 ? undefined : _c, _d = _a.endHandler, endHandler = _d === void 0 ? undefined : _d;
        this.loadTree = function (tree) {
            _this.curTree = tree;
            for (var _i = 0, tree_1 = tree; _i < tree_1.length; _i++) {
                var event_1 = tree_1[_i];
                _this.eventsMap.set(event_1.event, event_1);
            }
        };
        this.startTree = function () {
            if (_this.displayHandler && _this.inputHandler && _this.curTree) {
                _this.runEvent(_this.curTree[0]);
            }
            else {
                throw Error("DisplayHandler or InputHandler not defined.");
            }
        };
        this.runEvent = function (event) {
            if (_this.displayHandler) {
                _this.displayHandler(event.mes);
            }
            // chain to next event if defined
            if (event.chain) {
                var nextEvent = _this.eventsMap.get(event.chain);
                if (nextEvent) {
                    _this.runEvent(nextEvent);
                    return;
                }
            }
            if (event.res) {
                if (_this.inputHandler) {
                    _this.inputHandler(event.res, function (responseIndex) {
                        if (event.res) {
                            var response = event.res[responseIndex];
                            var nextEvent = _this.eventsMap.get(response.next);
                            if (nextEvent) {
                                _this.runEvent(nextEvent);
                                return;
                                console.log("should");
                            }
                        }
                    });
                }
            }
            if (!event.chain && !event.res) {
                // signal that end of tree has been reached
                if (_this.endHandler)
                    _this.endHandler();
            }
        };
        this.displayHandler = displayHandler;
        this.inputHandler = inputHandler;
        this.endHandler = endHandler;
        this.curTree = undefined;
        this.eventsMap = new Map();
    }
    return DialogEngine;
}());
exports.default = DialogEngine;
//# sourceMappingURL=DialogEngine.js.map