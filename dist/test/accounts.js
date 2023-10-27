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
/* global describe, before, it */
const web3_1 = __importDefault(require("web3"));
const index_1 = require("../src/index");
const web3 = new web3_1.default();
const assert = __importStar(require("assert"));
describe('Accounts', () => {
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new index_1.Provider();
            yield provider.init();
            web3.setProvider(provider);
        });
    });
    describe('eth_getAccounts', () => {
        it('should get a list of accounts', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const accounts = yield web3.eth.getAccounts();
                assert.notEqual(accounts.length, 0);
            });
        });
    });
    describe('eth_getBalance', () => {
        it('should get a account balance', () => __awaiter(void 0, void 0, void 0, function* () {
            const accounts = yield web3.eth.getAccounts();
            const balance0 = yield web3.eth.getBalance(accounts[0]);
            const balance1 = yield web3.eth.getBalance(accounts[1]);
            const balance2 = yield web3.eth.getBalance(accounts[2]);
            assert.deepEqual(balance0, '100000000000000000000');
            assert.deepEqual(balance1, '100000000000000000000');
            assert.deepEqual(balance2, '100000000000000000000');
        }));
    });
    describe('eth_sign', () => {
        it('should sign payloads', () => __awaiter(void 0, void 0, void 0, function* () {
            const accounts = yield web3.eth.getAccounts();
            const signature = yield web3.eth.sign('Hello world', accounts[0]);
            assert.deepEqual(signature.length, 132);
        }));
    });
});
