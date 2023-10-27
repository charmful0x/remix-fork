/* global ethereum */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VMContext = exports.VMCommon = void 0;
const cache_1 = require("@ethereumjs/statemanager/dist/cache");
const remix_lib_1 = require("@remix-project/remix-lib");
const util_1 = require("@ethereumjs/util");
const keccak_1 = require("ethereum-cryptography/keccak");
const rlp_1 = require("rlp");
const ethers_1 = require("ethers");
const remix_lib_2 = require("@remix-project/remix-lib");
const { LogsManager } = remix_lib_2.execution;
const VmProxy_1 = require("./VmProxy");
const vm_1 = require("@ethereumjs/vm");
const common_1 = require("@ethereumjs/common");
const trie_1 = require("@ethereumjs/trie");
const statemanager_1 = require("@ethereumjs/statemanager");
const evm_1 = require("@ethereumjs/evm");
const vm_2 = require("@ethereumjs/vm");
const blockchain_1 = require("@ethereumjs/blockchain");
const block_1 = require("@ethereumjs/block");
const util_2 = require("@ethereumjs/util");
/*
  extend vm state manager and instanciate VM
*/
class StateManagerCommonStorageDump extends statemanager_1.DefaultStateManager {
    constructor(opts = {}) {
        super(opts);
        this.keyHashes = {};
    }
    putContractStorage(address, key, value) {
        this.keyHashes[remix_lib_1.hash.keccak(key).toString('hex')] = (0, util_1.bufferToHex)(key);
        return super.putContractStorage(address, key, value);
    }
    copy() {
        const copyState = new StateManagerCommonStorageDump({
            trie: this._trie.copy(false),
        });
        copyState.keyHashes = this.keyHashes;
        return copyState;
    }
    dumpStorage(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this._getStorageTrie(address)
                    .then((trie) => {
                    const storage = {};
                    const stream = trie.createReadStream();
                    stream.on('data', (val) => {
                        const value = (0, rlp_1.decode)(val.value);
                        storage['0x' + val.key.toString('hex')] = {
                            key: this.keyHashes[val.key.toString('hex')],
                            value: '0x' + value.toString('hex')
                        };
                    });
                    stream.on('end', () => {
                        resolve(storage);
                    });
                })
                    .catch((e) => {
                    reject(e);
                });
            });
        });
    }
}
class CustomEthersStateManager extends StateManagerCommonStorageDump {
    constructor(opts) {
        super(opts);
        if (typeof opts.provider === 'string') {
            this.provider = new ethers_1.ethers.providers.StaticJsonRpcProvider(opts.provider);
        }
        else if (opts.provider instanceof ethers_1.ethers.providers.JsonRpcProvider) {
            this.provider = opts.provider;
        }
        else {
            throw new Error(`valid JsonRpcProvider or url required; got ${opts.provider}`);
        }
        this.blockTag = opts.blockTag;
        /*
         * For a custom StateManager implementation adopt these
         * callbacks passed to the `Cache` instantiated to perform
         * the `get`, `put` and `delete` operations with the
         * desired backend.
         */
        const getCb = (address) => __awaiter(this, void 0, void 0, function* () {
            const rlp = yield this._trie.get(address.buf);
            if (rlp) {
                const ac = util_1.Account.fromRlpSerializedAccount(rlp);
                return ac;
            }
            else {
                const ac = yield this.getAccountFromProvider(address);
                return ac;
            }
        });
        const putCb = (keyBuf, accountRlp) => __awaiter(this, void 0, void 0, function* () {
            const trie = this._trie;
            yield trie.put(keyBuf, accountRlp);
        });
        const deleteCb = (keyBuf) => __awaiter(this, void 0, void 0, function* () {
            const trie = this._trie;
            yield trie.del(keyBuf);
        });
        this._cache = new cache_1.Cache({ getCb, putCb, deleteCb });
    }
    /**
     * Sets the new block tag used when querying the provider and clears the
     * internal cache.
     * @param blockTag - the new block tag to use when querying the provider
     */
    setBlockTag(blockTag) {
        this.blockTag = blockTag === 'earliest' ? blockTag : (0, util_2.bigIntToHex)(blockTag);
    }
    copy() {
        const newState = new CustomEthersStateManager({
            provider: this.provider,
            blockTag: this.blockTag,
            trie: this._trie.copy(false),
        });
        return newState;
    }
    /**
     * Gets the code corresponding to the provided `address`.
     * @param address - Address to get the `code` for
     * @returns {Promise<Buffer>} - Resolves with the code corresponding to the provided address.
     * Returns an empty `Buffer` if the account has no associated code.
     */
    getContractCode(address) {
        const _super = Object.create(null, {
            getContractCode: { get: () => super.getContractCode },
            putContractCode: { get: () => super.putContractCode }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const code = yield _super.getContractCode.call(this, address);
            if (code && code.length > 0)
                return code;
            else {
                const code = (0, util_1.toBuffer)(yield this.provider.getCode(address.toString(), this.blockTag));
                yield _super.putContractCode.call(this, address, code);
                return code;
            }
        });
    }
    /**
     * Gets the storage value associated with the provided `address` and `key`. This method returns
     * the shortest representation of the stored value.
     * @param address -  Address of the account to get the storage for
     * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
     * @returns {Promise<Buffer>} - The storage value for the account
     * corresponding to the provided address at the provided key.
     * If this does not exist an empty `Buffer` is returned.
     */
    getContractStorage(address, key) {
        const _super = Object.create(null, {
            getContractStorage: { get: () => super.getContractStorage },
            putContractStorage: { get: () => super.putContractStorage }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let storage = yield _super.getContractStorage.call(this, address, key);
            if (storage && storage.length > 0)
                return storage;
            else {
                storage = (0, util_1.toBuffer)(yield this.provider.getStorageAt(address.toString(), (0, util_1.bufferToBigInt)(key), this.blockTag));
                yield _super.putContractStorage.call(this, address, key, storage);
                return storage;
            }
        });
    }
    /**
     * Checks if an `account` exists at `address`
     * @param address - Address of the `account` to check
     */
    accountExists(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const localAccount = this._cache.get(address);
            if (!localAccount.isEmpty())
                return true;
            // Get merkle proof for `address` from provider
            const proof = yield this.provider.send('eth_getProof', [address.toString(), [], this.blockTag]);
            const proofBuf = proof.accountProof.map((proofNode) => (0, util_1.toBuffer)(proofNode));
            const trie = new trie_1.Trie({ useKeyHashing: true });
            const verified = yield trie.verifyProof(Buffer.from((0, keccak_1.keccak256)(proofBuf[0])), address.buf, proofBuf);
            // if not verified (i.e. verifyProof returns null), account does not exist
            return verified === null ? false : true;
        });
    }
    /**
     * Retrieves an account from the provider and stores in the local trie
     * @param address Address of account to be retrieved from provider
     * @private
     */
    getAccountFromProvider(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountData = yield this.provider.send('eth_getProof', [
                address.toString(),
                [],
                this.blockTag,
            ]);
            const account = util_1.Account.fromAccountData({
                balance: BigInt(accountData.balance),
                nonce: BigInt(accountData.nonce),
                codeHash: (0, util_1.toBuffer)(accountData.codeHash)
                // storageRoot: toBuffer([]), // we have to remove this in order to force the creation of the Trie in the local state.
            });
            return account;
        });
    }
}
class VMCommon extends common_1.Common {
    /**
     * Override "setHardforkByBlockNumber" to disable updating the original fork state
     *
     * @param blockNumber
     * @param td
     * @param timestamp
     * @returns The name of the HF set
     */
    setHardforkByBlockNumber(blockNumber, td, timestamp) {
        return this.hardfork();
    }
}
exports.VMCommon = VMCommon;
/*
  trigger contextChanged, web3EndpointChanged
*/
class VMContext {
    constructor(fork, nodeUrl, blockNumber) {
        this.blockGasLimitDefault = 4300000;
        this.blockGasLimit = this.blockGasLimitDefault;
        this.currentFork = fork || 'merge';
        this.nodeUrl = nodeUrl;
        this.blockNumber = blockNumber;
        this.blocks = {};
        this.latestBlockNumber = "0x0";
        this.blockByTxHash = {};
        this.txByHash = {};
        this.exeResults = {};
        this.logsManager = new LogsManager();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentVm = yield this.createVm(this.currentFork);
        });
    }
    createVm(hardfork) {
        return __awaiter(this, void 0, void 0, function* () {
            let stateManager;
            if (this.nodeUrl) {
                let block = this.blockNumber;
                if (this.blockNumber === 'latest') {
                    const provider = new ethers_1.ethers.providers.StaticJsonRpcProvider(this.nodeUrl);
                    block = yield provider.getBlockNumber();
                    stateManager = new CustomEthersStateManager({
                        provider: this.nodeUrl,
                        blockTag: '0x' + block.toString(16)
                    });
                }
                else {
                    stateManager = new CustomEthersStateManager({
                        provider: this.nodeUrl,
                        blockTag: '0x' + this.blockNumber.toString(16)
                    });
                }
            }
            else
                stateManager = new StateManagerCommonStorageDump();
            const consensusType = hardfork === 'berlin' || hardfork === 'london' ? common_1.ConsensusType.ProofOfWork : common_1.ConsensusType.ProofOfStake;
            const difficulty = consensusType === common_1.ConsensusType.ProofOfStake ? 0 : 69762765929000;
            const common = new VMCommon({ chain: 'mainnet', hardfork });
            const genesisBlock = block_1.Block.fromBlockData({
                header: {
                    timestamp: (new Date().getTime() / 1000 | 0),
                    number: 0,
                    coinbase: '0x0e9281e9c6a0808672eaba6bd1220e144c9bb07a',
                    difficulty,
                    gasLimit: 8000000
                }
            }, { common, hardforkByBlockNumber: false, hardforkByTTD: undefined });
            const blockchain = yield blockchain_1.Blockchain.create({ common, validateBlocks: false, validateConsensus: false, genesisBlock });
            const eei = new vm_2.EEI(stateManager, common, blockchain);
            const evm = new evm_1.EVM({ common, eei, allowUnlimitedContractSize: true });
            const vm = yield vm_1.VM.create({
                common,
                activatePrecompiles: true,
                hardforkByBlockNumber: false,
                stateManager,
                blockchain,
                evm
            });
            // VmProxy and VMContext are very intricated.
            // VmProxy is used to track the EVM execution (to listen on opcode execution, in order for instance to generate the VM trace)
            const web3vm = new VmProxy_1.VmProxy(this);
            web3vm.setVM(vm);
            this.addBlock(genesisBlock, true);
            return { vm, web3vm, stateManager, common };
        });
    }
    getCurrentFork() {
        return this.currentFork;
    }
    web3() {
        return this.currentVm.web3vm;
    }
    vm() {
        return this.currentVm.vm;
    }
    vmObject() {
        return this.currentVm;
    }
    addBlock(block, genesis) {
        let blockNumber = (0, util_2.bigIntToHex)(block.header.number);
        if (blockNumber === '0x') {
            blockNumber = '0x0';
        }
        this.blocks['0x' + block.hash().toString('hex')] = block;
        this.blocks[blockNumber] = block;
        this.latestBlockNumber = blockNumber;
        if (!genesis)
            this.logsManager.checkBlock(blockNumber, block, this.web3());
    }
    trackTx(txHash, block, tx) {
        this.blockByTxHash[txHash] = block;
        this.txByHash[txHash] = tx;
    }
    trackExecResult(tx, execReult) {
        this.exeResults[tx] = execReult;
    }
}
exports.VMContext = VMContext;
