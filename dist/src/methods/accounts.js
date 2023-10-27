"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Web3Accounts = void 0;
const util_1 = require("@ethereumjs/util");
const bn_js_1 = __importDefault(require("bn.js"));
const Web3EthAccounts = require('web3-eth-accounts');
const crypto = __importStar(require("crypto"));
class Web3Accounts {
    constructor(vmContext) {
        this.vmContext = vmContext;
        // TODO: make it random and/or use remix-libs
        this.web3Accounts = new Web3EthAccounts();
        this.accounts = {};
        this.accountsKeys = {};
    }
    resetAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            this.accounts = {};
            this.accountsKeys = {};
            yield this._addAccount('503f38a9c967ed597e47fe25643985f032b072db8075426a92110f82df48dfcb', '0x56BC75E2D63100000');
            yield this._addAccount('7e5bfb82febc4c2c8529167104271ceec190eafdca277314912eaabdb67c6e5f', '0x56BC75E2D63100000');
            yield this._addAccount('cc6d63f85de8fef05446ebdd3c537c72152d0fc437fd7aa62b3019b79bd1fdd4', '0x56BC75E2D63100000');
            yield this._addAccount('638b5c6c8c5903b15f0d3bf5d3f175c64e6e98a10bdb9768a2003bf773dcb86a', '0x56BC75E2D63100000');
            yield this._addAccount('f49bf239b6e554fdd08694fde6c67dac4d01c04e0dda5ee11abee478983f3bc0', '0x56BC75E2D63100000');
            yield this._addAccount('adeee250542d3790253046eee928d8058fd544294a5219bea152d1badbada395', '0x56BC75E2D63100000');
            yield this._addAccount('097ffe12069dcb3c3d99e6771e2cbf491a9b8b2f93ff4d3468f550c5e8264755', '0x56BC75E2D63100000');
            yield this._addAccount('5f58e8b9f1867ef00578b6f03e159428ab168f776aa445bc3ecdb02c7db8e865', '0x56BC75E2D63100000');
            yield this._addAccount('290e721ac87c7b3f31bef7b70104b9280ed3fa1425a59451490c9c02bf50d08f', '0x56BC75E2D63100000');
            yield this._addAccount('27efe944ff128cf510ab447b529eec28772f13bf65ebf1cbd504192c4f26e9d8', '0x56BC75E2D63100000');
            yield this._addAccount('3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511', '0x56BC75E2D63100000');
            yield this._addAccount('2ac6c190b09897cd8987869cc7b918cfea07ee82038d492abce033c75c1b1d0c', '0x56BC75E2D63100000');
            yield this._addAccount('dae9801649ba2d95a21e688b56f77905e5667c44ce868ec83f82e838712a2c7a', '0x56BC75E2D63100000');
            yield this._addAccount('d74aa6d18aa79a05f3473dd030a97d3305737cbc8337d940344345c1f6b72eea', '0x56BC75E2D63100000');
            yield this._addAccount('71975fbf7fe448e004ac7ae54cad0a383c3906055a65468714156a07385e96ce', '0x56BC75E2D63100000');
        });
    }
    _addAccount(privateKey, balance) {
        return new Promise((resolve, reject) => {
            privateKey = Buffer.from(privateKey, 'hex');
            const address = (0, util_1.privateToAddress)(privateKey);
            const addressStr = (0, util_1.toChecksumAddress)('0x' + address.toString('hex'));
            this.accounts[addressStr] = { privateKey, nonce: 0 };
            this.accountsKeys[addressStr] = '0x' + privateKey.toString('hex');
            const stateManager = this.vmContext.vm().stateManager;
            stateManager.getAccount(util_1.Address.fromString(addressStr)).then((account) => {
                account.balance = new bn_js_1.default(balance.replace('0x', '') || 'f00000000000000001', 16);
                stateManager.putAccount(util_1.Address.fromString(addressStr), account).catch((error) => {
                    reject(error);
                }).then(() => {
                    resolve({});
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }
    newAccount(cb) {
        let privateKey;
        do {
            privateKey = crypto.randomBytes(32);
        } while (!(0, util_1.isValidPrivate)(privateKey));
        this._addAccount(privateKey, '0x56BC75E2D63100000');
        return cb(null, '0x' + (0, util_1.privateToAddress)(privateKey).toString('hex'));
    }
    methods() {
        return {
            eth_accounts: this.eth_accounts.bind(this),
            eth_getBalance: this.eth_getBalance.bind(this),
            eth_sign: this.eth_sign.bind(this)
        };
    }
    eth_accounts(_payload, cb) {
        return cb(null, Object.keys(this.accounts));
    }
    eth_getBalance(payload, cb) {
        const address = payload.params[0];
        this.vmContext.vm().stateManager.getAccount(util_1.Address.fromString(address)).then((account) => {
            cb(null, new bn_js_1.default(account.balance).toString(10));
        }).catch((error) => {
            cb(error);
        });
    }
    eth_sign(payload, cb) {
        const address = payload.params[0];
        const message = payload.params[1];
        const privateKey = this.accountsKeys[(0, util_1.toChecksumAddress)(address)];
        if (!privateKey) {
            return cb(new Error('unknown account'));
        }
        const account = this.web3Accounts.privateKeyToAccount(privateKey);
        const data = account.sign(message);
        cb(null, data.signature);
    }
}
exports.Web3Accounts = Web3Accounts;
