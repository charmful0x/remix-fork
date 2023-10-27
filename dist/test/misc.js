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
describe('Misc', () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        const provider = new index_1.Provider();
        yield provider.init();
        web3.setProvider(provider);
    }));
    describe('web3_clientVersion', () => {
        it('should get correct remix simulator version', (done) => __awaiter(void 0, void 0, void 0, function* () {
            web3['_requestManager'].send({ method: 'web3_clientVersion', params: [] }, (err, version) => {
                if (err) {
                    throw new Error(err);
                }
                const remixVersion = require('../package.json').version;
                assert.equal(version, 'Remix Simulator/' + remixVersion);
                done();
            });
        }));
    });
    describe('eth_protocolVersion', () => {
        it('should get protocol version', () => __awaiter(void 0, void 0, void 0, function* () {
            web3['_requestManager'].send({ method: 'eth_protocolVersion', params: [] }, (err, result) => {
                if (err) {
                    throw new Error(err);
                }
                assert.equal(result, '0x3f');
            });
        }));
    });
    describe('eth_syncing', () => {
        it('should get if is syncing', () => __awaiter(void 0, void 0, void 0, function* () {
            const isSyncing = yield web3.eth.isSyncing();
            assert.equal(isSyncing, false);
        }));
    });
    describe('eth_mining', () => {
        it('should get if is mining', () => __awaiter(void 0, void 0, void 0, function* () {
            const isMining = yield web3.eth.isMining();
            assert.equal(isMining, false);
        }));
    });
    describe('eth_hashrate', () => {
        it('should get hashrate', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashrate = yield web3.eth.getHashrate();
            assert.equal(hashrate, 0);
        }));
    });
    describe('web3_sha3', () => {
        it('should get result of a sha3', () => __awaiter(void 0, void 0, void 0, function* () {
            web3['_requestManager'].send({ method: 'web3_sha3', params: ['0x68656c6c6f20776f726c64'] }, (err, result) => {
                if (err) {
                    throw new Error(err);
                }
                assert.equal(result, '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad');
            });
        }));
    });
    describe('eth_getCompilers', () => {
        it('should get list of compilers', () => __awaiter(void 0, void 0, void 0, function* () {
            web3['_requestManager'].send({ method: 'eth_getCompilers', params: [] }, (err, result) => {
                if (err) {
                    throw new Error(err);
                }
                assert.equal(result, 0);
            });
        }));
    });
    describe('eth_compileSolidity', () => {
        it('get unsupported result when requesting solidity compiler', () => __awaiter(void 0, void 0, void 0, function* () {
            web3['_requestManager'].send({ method: 'eth_compileSolidity', params: [] }, (err, result) => {
                if (err) {
                    throw new Error(err);
                }
                assert.equal(result, 'unsupported');
            });
        }));
    });
    describe('eth_compileLLL', () => {
        it('get unsupported result when requesting LLL compiler', () => __awaiter(void 0, void 0, void 0, function* () {
            web3['_requestManager'].send({ method: 'eth_compileLLL', params: [] }, (err, result) => {
                if (err) {
                    throw new Error(err);
                }
                assert.equal(result, 'unsupported');
            });
        }));
    });
    describe('eth_compileSerpent', () => {
        it('get unsupported result when requesting serpent compiler', () => __awaiter(void 0, void 0, void 0, function* () {
            web3['_requestManager'].send({ method: 'eth_compileSerpent', params: [] }, (err, result) => {
                if (err) {
                    throw new Error(err);
                }
                assert.equal(result, 'unsupported');
            });
        }));
    });
});
