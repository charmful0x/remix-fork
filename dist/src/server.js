"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_ws_1 = __importDefault(require("express-ws"));
const provider_1 = require("./provider");
const logs_1 = require("./utils/logs");
const app = (0, express_1.default)();
class Server {
    constructor(options) {
        this.provider = new provider_1.Provider(options);
        this.provider.init().then(() => {
            (0, logs_1.log)('Provider initiated');
        }).catch((error) => {
            (0, logs_1.log)(error);
        });
        this.rpcOnly = options.rpc;
    }
    getApp() {
        return app;
    }
    start(host, port) {
        const wsApp = (0, express_ws_1.default)(app);
        app.use((0, cors_1.default)());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use(body_parser_1.default.json());
        app.get('/', (req, res) => {
            res.send('Welcome to remix-simulator');
        });
        if (this.rpcOnly) {
            app.use((req, res) => {
                this.provider.sendAsync(req.body, (err, jsonResponse) => {
                    if (err) {
                        return res.send(JSON.stringify({ error: err }));
                    }
                    res.send(jsonResponse);
                });
            });
        }
        else {
            wsApp.app.ws('/', (ws, req) => {
                ws.on('message', (msg) => {
                    this.provider.sendAsync(JSON.parse(msg.toString()), (err, jsonResponse) => {
                        if (err) {
                            return ws.send(JSON.stringify({ error: err }));
                        }
                        ws.send(JSON.stringify(jsonResponse));
                    });
                });
                this.provider.on('data', (result) => {
                    ws.send(JSON.stringify(result));
                });
            });
        }
        app.listen(port, host, () => {
            (0, logs_1.log)('Remix Simulator listening on ws://' + host + ':' + port);
            if (!this.rpcOnly) {
                (0, logs_1.log)('http json-rpc is deprecated and disabled by default. To enable it use --rpc');
            }
        });
    }
}
exports.Server = Server;
// module.exports = Server
