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
describe('Transactions', () => {
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new index_1.Provider({ fork: 'shanghai' });
            yield provider.init();
            web3.setProvider(provider);
        });
    });
    describe('eth_sendTransaction', () => {
        it('should deploy Storage contract, save a number and retrieve it', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const accounts = yield web3.eth.getAccounts();
                let receipt = yield web3.eth.sendTransaction({
                    from: accounts[0],
                    gas: 1000000,
                    data: '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea2646970667358221220bfa7ddc6d937b635c7a8ad020080923800f04f6b0a685c47330306fd5267626b64736f6c63430008150033'
                });
                const storageAddress = receipt.contractAddress;
                const receiptPull = yield web3.eth.getTransactionReceipt(receipt.transactionHash);
                assert.equal(receiptPull.contractAddress, receipt.contractAddress);
                receipt = yield web3.eth.sendTransaction({
                    from: accounts[0],
                    to: storageAddress,
                    gas: 1000000,
                    data: '0x6057361d000000000000000000000000000000000000000000000000000000000000000e'
                });
                const value = yield web3.eth.call({
                    from: accounts[0],
                    to: storageAddress,
                    data: '0x2e64cec1'
                });
                assert.notEqual(value, 15);
                assert.equal(value, 14);
            });
        });
    });
});
