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
exports.VmProxy = void 0;
const remix_lib_1 = require("@remix-project/remix-lib");
const { toHexPaddedString, formatMemory } = remix_lib_1.util;
const remix_lib_2 = require("@remix-project/remix-lib");
const { normalizeHexAddress } = remix_lib_2.helpers.ui;
const remix_lib_3 = require("@remix-project/remix-lib");
const bn_js_1 = __importDefault(require("bn.js"));
const web3_utils_1 = require("web3-utils");
const util_1 = require("@ethereumjs/util");
const web3_utils_2 = __importDefault(require("web3-utils"));
const ethers_1 = require("ethers");
class VmProxy {
    constructor(vmContext) {
        this.vmContext = vmContext;
        this.stateCopy;
        this.vm = null;
        this.vmTraces = {};
        this.txs = {};
        this.txsReceipt = {};
        this.hhLogs = {};
        this.processingHash = null;
        this.processingAddress = null;
        this.processingIndex = null;
        this.previousDepth = 0;
        this.incr = 0;
        this.eth = {};
        this.debug = {};
        this.eth.getCode = (address, cb) => this.getCode(address, cb);
        this.eth.getTransaction = (txHash, cb) => this.getTransaction(txHash, cb);
        this.eth.getTransactionReceipt = (txHash, cb) => this.getTransactionReceipt(txHash, cb);
        this.eth.getTransactionFromBlock = (blockNumber, txIndex, cb) => this.getTransactionFromBlock(blockNumber, txIndex, cb);
        this.eth.getBlockNumber = (cb) => this.getBlockNumber(cb);
        this.eth.getStorageAt = (address, position, blockNumber, cb) => this.getStorageAt(address, position, blockNumber, cb);
        this.debug.traceTransaction = (txHash, options, cb) => this.traceTransaction(txHash, options, cb);
        this.debug.storageRangeAt = (blockNumber, txIndex, address, start, maxLength, cb) => this.storageRangeAt(blockNumber, txIndex, address, start, maxLength, cb);
        this.debug.preimage = (hashedKey, cb) => this.preimage(hashedKey, cb);
        this.providers = { HttpProvider: function (url) { } };
        this.currentProvider = { host: 'vm provider' };
        this.storageCache = {};
        this.sha3Preimages = {};
        // util
        this.sha3 = (...args) => web3_utils_2.default.sha3.apply(this, args);
        this.toHex = (...args) => web3_utils_2.default.toHex.apply(this, args);
        this.toAscii = (...args) => web3_utils_2.default.toAscii.apply(this, args);
        this.fromAscii = (...args) => web3_utils_2.default.fromAscii.apply(this, args);
        this.fromDecimal = (...args) => web3_utils_2.default.fromDecimal.apply(this, args);
        this.fromWei = (...args) => web3_utils_2.default.fromWei.apply(this, args);
        this.toWei = (...args) => web3_utils_2.default.toWei.apply(this, args);
        this.toBigNumber = (...args) => web3_utils_2.default.toBN.apply(this, args);
        this.isAddress = (...args) => web3_utils_2.default.isAddress.apply(this, args);
        this.utils = web3_utils_2.default;
        this.txsMapBlock = {};
        this.blocks = {};
        this.lastMemoryUpdate = [];
    }
    setVM(vm) {
        if (this.vm === vm)
            return;
        this.vm = vm;
        this.vm.evm.events.on('step', (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.pushTrace(data);
        }));
        this.vm.events.on('afterTx', (data, resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.txProcessed(data);
            resolve();
        }));
        this.vm.events.on('beforeTx', (data, resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.txWillProcess(data);
            resolve();
        }));
    }
    releaseCurrentHash() {
        const ret = this.processingHash;
        this.processingHash = undefined;
        return ret;
    }
    flagNextAsDoNotRecordEvmSteps() {
        this.flagDoNotRecordEVMSteps = true;
    }
    txWillProcess(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(this.storageCache)
            if (this.flagDoNotRecordEVMSteps)
                return;
            this.lastMemoryUpdate = [];
            this.stateCopy = yield this.vm.stateManager.copy();
            this.incr++;
            this.processingHash = (0, util_1.bufferToHex)(data.hash());
            this.vmTraces[this.processingHash] = {
                gas: '0x0',
                return: '0x0',
                structLogs: []
            };
            const tx = {};
            tx['hash'] = this.processingHash;
            tx['from'] = (0, util_1.toChecksumAddress)(data.getSenderAddress().toString());
            if (data.to) {
                tx['to'] = (0, util_1.toChecksumAddress)(data.to.toString());
            }
            this.processingAddress = tx['to'];
            tx['input'] = (0, util_1.bufferToHex)(data.data);
            tx['gas'] = data.gasLimit.toString(10);
            if (data.value) {
                tx['value'] = data.value.toString(10);
            }
            this.txs[this.processingHash] = tx;
            this.txsReceipt[this.processingHash] = tx;
            this.storageCache[this.processingHash] = {};
            this.storageCache['after_' + this.processingHash] = {};
            if (data.to) {
                ((processingHash, processingAccount, processingAddress, self) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const storage = yield self.stateCopy.dumpStorage(processingAccount);
                        self.storageCache[processingHash][processingAddress] = storage;
                    }
                    catch (e) {
                        console.log(e);
                    }
                }))(this.processingHash, data.to, tx['to'], this);
            }
            this.processingIndex = 0;
        });
    }
    txProcessed(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.flagDoNotRecordEVMSteps) {
                this.flagDoNotRecordEVMSteps = false;
                return;
            }
            const lastOp = this.vmTraces[this.processingHash].structLogs[this.processingIndex - 1];
            if (lastOp) {
                lastOp.error = lastOp.op !== 'RETURN' && lastOp.op !== 'STOP' && lastOp.op !== 'DESTRUCT';
            }
            const gasUsed = '0x' + data.totalGasSpent.toString(16);
            this.vmTraces[this.processingHash].gas = gasUsed;
            this.txsReceipt[this.processingHash].gasUsed = gasUsed;
            const logs = [];
            for (const l in data.execResult.logs) {
                const log = data.execResult.logs[l];
                const topics = [];
                if (log[1].length > 0) {
                    for (const k in log[1]) {
                        topics.push('0x' + log[1][k].toString('hex'));
                    }
                }
                else {
                    topics.push('0x');
                }
                logs.push({
                    address: (0, util_1.toChecksumAddress)('0x' + log[0].toString('hex')),
                    data: '0x' + log[2].toString('hex'),
                    topics: topics,
                    rawVMResponse: log
                });
            }
            this.txsReceipt[this.processingHash].logs = logs;
            this.txsReceipt[this.processingHash].transactionHash = this.processingHash;
            const status = data.execResult.exceptionError ? 0 : 1;
            this.txsReceipt[this.processingHash].status = `0x${status}`;
            const to = this.txs[this.processingHash].to;
            if (to) {
                try {
                    yield ((processingHash, processingAddress, self) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const account = util_1.Address.fromString(processingAddress);
                            const storage = yield self.vm.stateManager.dumpStorage(account);
                            self.storageCache['after_' + processingHash][processingAddress] = storage;
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }))(this.processingHash, to, this);
                }
                catch (e) {
                    console.log(e);
                }
            }
            if (data.createdAddress) {
                const address = data.createdAddress.toString();
                const checksumedAddress = (0, util_1.toChecksumAddress)(address);
                this.vmTraces[this.processingHash].return = checksumedAddress;
                this.txsReceipt[this.processingHash].contractAddress = checksumedAddress;
            }
            else if (data.execResult.returnValue) {
                this.vmTraces[this.processingHash].return = '0x' + data.execResult.returnValue.toString('hex');
            }
            else {
                this.vmTraces[this.processingHash].return = '0x';
            }
            // ADD DATA TO ARWEAVE HERE
            console.log(`FINAL STORAGECACHE`);
            console.log(JSON.stringify(this.storageCache, null, 4));
            console.log(this.txs);
            console.log(this.txsMapBlock);
            // console.log(        ,
            //     this.blocks,
            //     this.lastMemoryUpdate)
            // console.log(`FINAL VMCONTEXT`)
            // console.log(this.vmContext)
            this.processingIndex = null;
            this.processingAddress = null;
            this.previousDepth = 0;
            this.stateCopy = null;
        });
    }
    pushTrace(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(`PUSH TRACE`)
            if (this.flagDoNotRecordEVMSteps)
                return;
            try {
                const depth = data.depth + 1; // geth starts the depth from 1
                if (!this.processingHash) {
                    return;
                }
                let previousOpcode;
                if (this.vmTraces[this.processingHash] && this.vmTraces[this.processingHash].structLogs[this.processingIndex - 1]) {
                    previousOpcode = this.vmTraces[this.processingHash].structLogs[this.processingIndex - 1];
                }
                if (this.previousDepth > depth && previousOpcode) {
                    // returning from context, set error it is not STOP, RETURN
                    previousOpcode.invalidDepthChange = previousOpcode.op !== 'RETURN' && previousOpcode.op !== 'STOP';
                }
                const step = {
                    stack: Object.assign({}, data.stack),
                    storage: {},
                    memory: null,
                    op: data.opcode.name,
                    pc: data.pc,
                    gasCost: data.opcode.fee.toString(),
                    gas: data.gasLeft.toString(),
                    depth: depth
                };
                step.stack.length = Object.keys(data.stack).length;
                if (previousOpcode && (previousOpcode.op === 'CALLDATACOPY' || previousOpcode.op === 'CODECOPY' || previousOpcode.op === 'EXTCODECOPY' || previousOpcode.op === 'RETURNDATACOPY' || previousOpcode.op === 'MSTORE' || previousOpcode.op === 'MSTORE8')) {
                    step.memory = new Uint8Array(data.memory);
                    this.lastMemoryUpdate = step.memory;
                }
                this.vmTraces[this.processingHash].structLogs.push(step);
                // Track hardhat console.log call
                if (step.op === 'STATICCALL' && toHexPaddedString(step.stack[step.stack.length - 2]) === '0x000000000000000000000000000000000000000000636f6e736f6c652e6c6f67') {
                    const payloadStart = parseInt(toHexPaddedString(step.stack[step.stack.length - 3]), 16);
                    const memory = formatMemory(data.memory);
                    const memoryStr = memory.join('');
                    let payload = memoryStr.substring(payloadStart * 2, memoryStr.length);
                    const fnselectorStr = payload.substring(0, 8);
                    const fnselectorStrInHex = '0x' + fnselectorStr;
                    const fnselector = parseInt(fnselectorStrInHex);
                    const fnArgs = remix_lib_3.ConsoleLogs[fnselector];
                    const iface = new ethers_1.ethers.utils.Interface([`function log${fnArgs} view`]);
                    const functionDesc = iface.getFunction(`log${fnArgs}`);
                    const sigHash = iface.getSighash(`log${fnArgs}`);
                    if (fnArgs.includes('uint') && sigHash !== fnselectorStrInHex) {
                        payload = payload.replace(fnselectorStr, sigHash);
                    }
                    else {
                        payload = '0x' + payload;
                    }
                    let consoleArgs = iface.decodeFunctionData(functionDesc, payload);
                    consoleArgs = consoleArgs.map((value) => {
                        if ((0, web3_utils_1.isBigNumber)(value)) {
                            return value.toString();
                        }
                        return value;
                    });
                    this.hhLogs[this.processingHash] = this.hhLogs[this.processingHash] ? this.hhLogs[this.processingHash] : [];
                    this.hhLogs[this.processingHash].push(consoleArgs);
                }
                if (step.op === 'CREATE' || step.op === 'CALL') {
                    if (step.op === 'CREATE') {
                        this.processingAddress = '(Contract Creation - Step ' + this.processingIndex + ')';
                        this.storageCache[this.processingHash][this.processingAddress] = {};
                    }
                    else {
                        this.processingAddress = normalizeHexAddress(toHexPaddedString(step.stack[step.stack.length - 2]));
                        this.processingAddress = (0, util_1.toChecksumAddress)(this.processingAddress);
                        if (!this.storageCache[this.processingHash][this.processingAddress]) {
                            ((processingHash, processingAddress, self) => __awaiter(this, void 0, void 0, function* () {
                                try {
                                    const account = util_1.Address.fromString(processingAddress);
                                    const storage = yield self.stateCopy.dumpStorage(account);
                                    self.storageCache[processingHash][processingAddress] = storage;
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }))(this.processingHash, this.processingAddress, this);
                        }
                    }
                }
                if (previousOpcode && previousOpcode.op === 'SHA3') {
                    const preimage = this.getSha3Input(previousOpcode.stack, formatMemory(this.lastMemoryUpdate));
                    const imageHash = toHexPaddedString(step.stack[step.stack.length - 1]).replace('0x', '');
                    this.sha3Preimages[imageHash] = {
                        preimage: preimage
                    };
                }
                console.log(`\n\nSTEP\n`);
                console.log(step);
                this.processingIndex++;
                this.previousDepth = depth;
                // console.log(        this.txsMapBlock,
                //     this.blocks,
                //     this.lastMemoryUpdate, this.storageCache)
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getCode(address, cb) {
        address = (0, util_1.toChecksumAddress)(address);
        this.vm.stateManager.getContractCode(util_1.Address.fromString(address)).then((result) => {
            cb(null, (0, util_1.bufferToHex)(result));
        }).catch((error) => {
            cb(error);
        });
    }
    setProvider(provider) { }
    traceTransaction(txHash, options, cb) {
        if (this.vmTraces[txHash]) {
            if (cb) {
                cb(null, this.vmTraces[txHash]);
            }
            return this.vmTraces[txHash];
        }
        if (cb) {
            cb('unable to retrieve traces ' + txHash, null);
        }
    }
    getStorageAt(address, position, blockNumber, cb) {
        console.log(`GET STORAGE AT`);
        // we don't use the range params here
        address = (0, util_1.toChecksumAddress)(address);
        blockNumber = blockNumber === 'latest' ? this.vmContext.latestBlockNumber : blockNumber;
        const block = this.vmContext.blocks[blockNumber];
        const txHash = '0x' + block.transactions[block.transactions.length - 1].hash().toString('hex');
        if (this.storageCache['after_' + txHash] && this.storageCache['after_' + txHash][address]) {
            const slot = '0x' + remix_lib_3.hash.keccak((0, util_1.toBuffer)(ethers_1.ethers.utils.hexZeroPad(position, 32))).toString('hex');
            const storage = this.storageCache['after_' + txHash][address];
            return cb(null, storage[slot].value);
        }
        // Before https://github.com/ethereum/remix-project/pull/1703, it used to throw error as
        // 'unable to retrieve storage ' + txIndex + ' ' + address
        cb(null, '0x0');
    }
    storageRangeAt(blockNumber, txIndex, address, start, maxLength, cb) {
        // we don't use the range params here
        address = (0, util_1.toChecksumAddress)(address);
        const block = this.vmContext.blocks[blockNumber];
        const txHash = '0x' + block.transactions[txIndex].hash().toString('hex');
        if (this.storageCache[txHash] && this.storageCache[txHash][address]) {
            const storage = this.storageCache[txHash][address];
            return cb(null, {
                storage: JSON.parse(JSON.stringify(storage)),
                nextKey: null
            });
        }
        // Before https://github.com/ethereum/remix-project/pull/1703, it used to throw error as
        // 'unable to retrieve storage ' + txIndex + ' ' + address
        cb(null, { storage: {} });
    }
    getBlockNumber(cb) { cb(null, 'vm provider'); }
    getTransaction(txHash, cb) {
        if (this.txs[txHash]) {
            if (cb) {
                cb(null, this.txs[txHash]);
            }
            return this.txs[txHash];
        }
        if (cb) {
            cb('unable to retrieve tx ' + txHash, null);
        }
    }
    getTransactionReceipt(txHash, cb) {
        // same as getTransaction but return the created address also
        if (this.txsReceipt[txHash]) {
            if (cb) {
                cb(null, this.txsReceipt[txHash]);
            }
            return this.txsReceipt[txHash];
        }
        if (cb) {
            cb('unable to retrieve txReceipt ' + txHash, null);
        }
    }
    getTransactionFromBlock(blockNumber, txIndex, cb) {
        const mes = 'not supposed to be needed by remix in vmmode';
        console.log(mes);
        if (cb) {
            cb(mes, null);
        }
    }
    preimage(hashedKey, cb) {
        hashedKey = hashedKey.replace('0x', '');
        cb(null, this.sha3Preimages[hashedKey] !== undefined ? this.sha3Preimages[hashedKey].preimage : null);
    }
    getSha3Input(stack, memory) {
        const memoryStart = toHexPaddedString(stack[stack.length - 1]);
        const memoryLength = toHexPaddedString(stack[stack.length - 2]);
        const memStartDec = (new bn_js_1.default(memoryStart.replace('0x', ''), 16)).toString(10);
        const memoryStartInt = parseInt(memStartDec) * 2;
        const memLengthDec = (new bn_js_1.default(memoryLength.replace('0x', ''), 16).toString(10));
        const memoryLengthInt = parseInt(memLengthDec) * 2;
        let i = Math.floor(memoryStartInt / 32);
        const maxIndex = Math.floor(memoryLengthInt / 32) + i;
        if (!memory[i]) {
            return this.emptyFill(memoryLength);
        }
        let sha3Input = memory[i].slice(memoryStartInt - 32 * i);
        i++;
        while (i < maxIndex) {
            sha3Input += memory[i] ? memory[i] : this.emptyFill(32);
            i++;
        }
        if (sha3Input.length < memoryLength) {
            const leftSize = memoryLengthInt - sha3Input.length;
            sha3Input += memory[i] ? memory[i].slice(0, leftSize) : this.emptyFill(leftSize);
        }
        return sha3Input;
    }
    emptyFill(size) {
        return (new Array(size)).join('0');
    }
}
exports.VmProxy = VmProxy;
