"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = exports.Provider = void 0;
const blocks_1 = require("./methods/blocks");
const logs_1 = require("./utils/logs");
const merge_1 = __importDefault(require("merge"));
const accounts_1 = require("./methods/accounts");
const filters_1 = require("./methods/filters");
const misc_1 = require("./methods/misc");
const net_1 = require("./methods/net");
const transactions_1 = require("./methods/transactions");
const debug_1 = require("./methods/debug");
const vm_context_1 = require("./vm-context");
class Provider {
    constructor(options = {}) {
        this.options = options;
        this.connected = true;
        this.vmContext = new vm_context_1.VMContext(options['fork'], options['nodeUrl'], options['blockNumber']);
        this.Accounts = new accounts_1.Web3Accounts(this.vmContext);
        this.Transactions = new transactions_1.Transactions(this.vmContext);
        this.methods = {};
        this.methods = (0, merge_1.default)(this.methods, this.Accounts.methods());
        this.methods = (0, merge_1.default)(this.methods, (new blocks_1.Blocks(this.vmContext, options)).methods());
        this.methods = (0, merge_1.default)(this.methods, (0, misc_1.methods)());
        this.methods = (0, merge_1.default)(this.methods, (new filters_1.Filters(this.vmContext)).methods());
        this.methods = (0, merge_1.default)(this.methods, (0, net_1.methods)());
        this.methods = (0, merge_1.default)(this.methods, this.Transactions.methods());
        this.methods = (0, merge_1.default)(this.methods, (new debug_1.Debug(this.vmContext)).methods());
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initialized = false;
            this.pendingRequests = [];
            yield this.vmContext.init();
            yield this.Accounts.resetAccounts();
            this.Transactions.init(this.Accounts.accounts);
            this.initialized = true;
            if (this.pendingRequests.length > 0) {
                this.pendingRequests.map((req) => {
                    this.sendAsync(req.payload, req.callback);
                });
                this.pendingRequests = [];
            }
        });
    }
    sendAsync(payload, callback) {
        // log.info('payload method is ', payload.method) // commented because, this floods the IDE console
        if (!this.initialized) {
            this.pendingRequests.push({ payload, callback });
            return;
        }
        const method = this.methods[payload.method];
        if (this.options.logDetails) {
            (0, logs_1.info)(payload);
        }
        if (method) {
            return method.call(method, payload, (err, result) => {
                if (this.options.logDetails) {
                    (0, logs_1.info)(err);
                    (0, logs_1.info)(result);
                }
                if (err) {
                    return callback(err);
                }
                const response = { id: payload.id, jsonrpc: '2.0', result: result };
                callback(null, response);
            });
        }
        callback(new Error('unknown method ' + payload.method));
    }
    send(payload, callback) {
        this.sendAsync(payload, callback || function () { });
    }
    isConnected() {
        return true;
    }
    disconnect() {
        return false;
    }
    supportsSubscriptions() {
        return true;
    }
    on(type, cb) {
        this.vmContext.logsManager.addListener(type, cb);
    }
}
exports.Provider = Provider;
function extend(web3) {
    if (!web3.extend) {
        return;
    }
    // DEBUG
    const methods = [];
    if (!(web3.eth && web3.eth.getExecutionResultFromSimulator)) {
        methods.push(new web3.extend.Method({
            name: 'getExecutionResultFromSimulator',
            call: 'eth_getExecutionResultFromSimulator',
            inputFormatter: [null],
            params: 1
        }));
    }
    if (!(web3.eth && web3.eth.getHHLogsForTx)) {
        methods.push(new web3.extend.Method({
            name: 'getHHLogsForTx',
            call: 'eth_getHHLogsForTx',
            inputFormatter: [null],
            params: 1
        }));
    }
    if (!(web3.eth && web3.eth.getHashFromTagBySimulator)) {
        methods.push(new web3.extend.Method({
            name: 'getHashFromTagBySimulator',
            call: 'eth_getHashFromTagBySimulator',
            inputFormatter: [null],
            params: 1
        }));
    }
    if (methods.length > 0) {
        web3.extend({
            property: 'eth',
            methods: methods,
            properties: []
        });
    }
}
exports.extend = extend;
