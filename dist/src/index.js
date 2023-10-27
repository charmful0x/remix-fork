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
var provider_1 = require("./provider");
Object.defineProperty(exports, "Provider", { enumerable: true, get: function () { return provider_1.Provider; } });
Object.defineProperty(exports, "extend", { enumerable: true, get: function () { return provider_1.extend; } });
const provider_2 = require("./provider");
const assert_1 = __importDefault(require("assert"));
const web3_1 = __importDefault(require("web3"));
const web3 = new web3_1.default();
// const provider = new Provider({
//   fork: 'shanghai'
// });
// const server = new Server({
//   provider
// })
// server.start("127.0.0.1", 3000)
// const app = server.getApp();
// const host = 'localhost'; // Change to your desired host
// const port = 3000; // Change to your desired port
// app.listen(port, host, () => {
//   log('Remix Simulator listening on http://' + host + ':' + port);
//   if (!server.rpcOnly) {
//     log('http json-rpc is deprecated and disabled by default. To enable it, use --rpc');
//   }
// });
// ... Rest of your code
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new provider_2.Provider({ fork: 'shanghai' });
        yield provider.init();
        yield provider.start("http://localhost", 3000);
        web3.setProvider(provider);
        const accounts = yield web3.eth.getAccounts();
        console.log(accounts);
        let receipt = yield web3.eth.sendTransaction({
            from: accounts[0],
            gas: 1000000,
            data: '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea2646970667358221220bfa7ddc6d937b635c7a8ad020080923800f04f6b0a685c47330306fd5267626b64736f6c63430008150033'
        });
        console.log(receipt);
        const storageAddress = receipt.contractAddress;
        console.log(storageAddress);
        const receiptPull = yield web3.eth.getTransactionReceipt(receipt.transactionHash);
        assert_1.default.equal(receiptPull.contractAddress, receipt.contractAddress);
        receipt = yield web3.eth.sendTransaction({
            from: accounts[0],
            to: storageAddress,
            gas: 1000000,
            data: '0x6057361d000000000000000000000000000000000000000000000000000000000000000e'
        });
        console.log(receipt);
        const value = yield web3.eth.call({
            from: accounts[0],
            to: storageAddress,
            data: '0x2e64cec1'
        });
        assert_1.default.notEqual(value, 15);
        assert_1.default.equal(value, 14);
        console.log(value);
    });
}
// test()
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const logs_1 = require("./utils/logs");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //       const accounts: string[] = await web3.eth.getAccounts()
    // // console.log(accounts)
    // let receipt = await web3.eth.sendTransaction({
    //   from: accounts[0],
    //   gas: 1000000,
    //   data: '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea2646970667358221220bfa7ddc6d937b635c7a8ad020080923800f04f6b0a685c47330306fd5267626b64736f6c63430008150033'
    // })
    // console.log(receipt)
    // const storageAddress = receiptPull.contractAddress
    // // console.log(storageAddress)
    // const receiptPull = await web3.eth.getTransactionReceipt(receipt.transactionHash)
    // console.log("contractAddress: ", receiptPull.contractAddress)
    // assert.equal(receiptPull.contractAddress, receipt.contractAddress)
    //  receipt = await web3.eth.sendTransaction({
    //   from: accounts[0],
    //   to: storageAddress,
    //   gas: 1000000,
    //   data: '0x6057361d000000000000000000000000000000000000000000000000000000000000000e'
    // })
    // console.log(receipt)
    // const value1 = await web3.eth.call({
    //   from: accounts[0],
    //   to: storageAddress,
    //   data: '0x371303c0'
    // })
    // console.log(`\nVALUE\n`)
    // console.log(value1)
    // // assert.notEqual(value, 15)
    // // assert.equal(value, 14)
    // res.send('Welcome to remix-simulator')
    const accounts = yield web3.eth.getAccounts();
    // console.log(accounts)
    let receipt = yield web3.eth.sendTransaction({
        from: accounts[0],
        gas: 1000000,
        data: '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea2646970667358221220bfa7ddc6d937b635c7a8ad020080923800f04f6b0a685c47330306fd5267626b64736f6c63430008150033'
    });
    console.log(receipt);
    const storageAddress = receipt.contractAddress;
    console.log(storageAddress);
    const receiptPull = yield web3.eth.getTransactionReceipt(receipt.transactionHash);
    assert_1.default.equal(receiptPull.contractAddress, receipt.contractAddress);
    receipt = yield web3.eth.sendTransaction({
        from: accounts[0],
        to: storageAddress,
        gas: 1000000,
        data: '0x6057361d000000000000000000000000000000000000000000000000000000000000000e'
    });
    console.log(receipt);
    const value = yield web3.eth.call({
        from: accounts[0],
        to: storageAddress,
        data: '0x2e64cec1'
    });
    assert_1.default.notEqual(value, 15);
    assert_1.default.equal(value, 14);
    console.log(value);
    res.send('Welcome to remix-simulator');
}));
app.get('/trigger/:contract_address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contract_address } = req.params;
    const accounts = yield web3.eth.getAccounts();
    const storageAddress = contract_address;
    console.log(`\nINTERACTING WITH: ${storageAddress}\n`);
    // const receiptPull = await web3.eth.getTransactionReceipt(receipt.transactionHash)
    let receipt = yield web3.eth.sendTransaction({
        from: accounts[0],
        to: storageAddress,
        gas: 1000000,
        data: '0x6057361d000000000000000000000000000000000000000000000000000000000000000e'
    });
    console.log(receipt);
    const value = yield web3.eth.call({
        from: accounts[0],
        to: storageAddress,
        data: '0x2e64cec1'
    });
    assert_1.default.notEqual(value, 15);
    assert_1.default.equal(value, 14);
    console.log(value);
    res.send('Welcome to remix-simulator');
}));
app.get('/erc20', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //       const accounts: string[] = await web3.eth.getAccounts()
    // console.log(accounts)
    // let receipt = await web3.eth.sendTransaction({
    //   from: accounts[0],
    //   gas: 1000000,
    //   data: '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea2646970667358221220bfa7ddc6d937b635c7a8ad020080923800f04f6b0a685c47330306fd5267626b64736f6c63430008150033'
    // })
    // console.log(receipt)
    // const storageAddress = receiptPull.contractAddress
    // // console.log(storageAddress)
    // const receiptPull = await web3.eth.getTransactionReceipt(receipt.transactionHash)
    // console.log("contractAddress: ", receiptPull.contractAddress)
    // assert.equal(receiptPull.contractAddress, receipt.contractAddress)
    //  receipt = await web3.eth.sendTransaction({
    //   from: accounts[0],
    //   to: storageAddress,
    //   gas: 1000000,
    //   data: '0x6057361d000000000000000000000000000000000000000000000000000000000000000e'
    // })
    // console.log(receipt)
    // const value1 = await web3.eth.call({
    //   from: accounts[0],
    //   to: storageAddress,
    //   data: '0x371303c0'
    // })
    // console.log(`\nVALUE\n`)
    // console.log(value1)
    // // assert.notEqual(value, 15)
    // // assert.equal(value, 14)
    // res.send('Welcome to remix-simulator')
    const accounts = yield web3.eth.getAccounts();
    console.log(accounts);
    let receipt = yield web3.eth.sendTransaction({
        from: accounts[0],
        gas: 1000000,
        data: '0x608060405234801562000010575f80fd5b506040516200166f3803806200166f8339818101604052810190620000369190620003cb565b6040518060400160405280600481526020017f476f6c64000000000000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f474c4400000000000000000000000000000000000000000000000000000000008152508160039081620000b3919062000656565b508060049081620000c5919062000656565b505050620000da3382620000e160201b60201c565b5062000866565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160362000154575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016200014b91906200077d565b60405180910390fd5b620001675f83836200016b60201b60201c565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603620001bf578060025f828254620001b29190620007c5565b9250508190555062000290565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050818110156200024b578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401620002429392919062000810565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620002d9578060025f828254039250508190555062000323565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200038291906200084b565b60405180910390a3505050565b5f80fd5b5f819050919050565b620003a78162000393565b8114620003b2575f80fd5b50565b5f81519050620003c5816200039c565b92915050565b5f60208284031215620003e357620003e26200038f565b5b5f620003f284828501620003b5565b91505092915050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806200047757607f821691505b6020821081036200048d576200048c62000432565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620004f17fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620004b4565b620004fd8683620004b4565b95508019841693508086168417925050509392505050565b5f819050919050565b5f6200053e62000538620005328462000393565b62000515565b62000393565b9050919050565b5f819050919050565b62000559836200051e565b62000571620005688262000545565b848454620004c0565b825550505050565b5f90565b6200058762000579565b620005948184846200054e565b505050565b5b81811015620005bb57620005af5f826200057d565b6001810190506200059a565b5050565b601f8211156200060a57620005d48162000493565b620005df84620004a5565b81016020851015620005ef578190505b62000607620005fe85620004a5565b83018262000599565b50505b505050565b5f82821c905092915050565b5f6200062c5f19846008026200060f565b1980831691505092915050565b5f6200064683836200061b565b9150826002028217905092915050565b6200066182620003fb565b67ffffffffffffffff8111156200067d576200067c62000405565b5b6200068982546200045f565b62000696828285620005bf565b5f60209050601f831160018114620006cc575f8415620006b7578287015190505b620006c3858262000639565b86555062000732565b601f198416620006dc8662000493565b5f5b828110156200070557848901518255600182019150602085019450602081019050620006de565b8683101562000725578489015162000721601f8916826200061b565b8355505b6001600288020188555050505b505050505050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f62000765826200073a565b9050919050565b620007778162000759565b82525050565b5f602082019050620007925f8301846200076c565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f620007d18262000393565b9150620007de8362000393565b9250828201905080821115620007f957620007f862000798565b5b92915050565b6200080a8162000393565b82525050565b5f606082019050620008255f8301866200076c565b620008346020830185620007ff565b620008436040830184620007ff565b949350505050565b5f602082019050620008605f830184620007ff565b92915050565b610dfb80620008745f395ff3fe608060405234801561000f575f80fd5b5060043610610091575f3560e01c8063313ce56711610064578063313ce5671461013157806370a082311461014f57806395d89b411461017f578063a9059cbb1461019d578063dd62ed3e146101cd57610091565b806306fdde0314610095578063095ea7b3146100b357806318160ddd146100e357806323b872dd14610101575b5f80fd5b61009d6101fd565b6040516100aa9190610a74565b60405180910390f35b6100cd60048036038101906100c89190610b25565b61028d565b6040516100da9190610b7d565b60405180910390f35b6100eb6102af565b6040516100f89190610ba5565b60405180910390f35b61011b60048036038101906101169190610bbe565b6102b8565b6040516101289190610b7d565b60405180910390f35b6101396102e6565b6040516101469190610c29565b60405180910390f35b61016960048036038101906101649190610c42565b6102ee565b6040516101769190610ba5565b60405180910390f35b610187610333565b6040516101949190610a74565b60405180910390f35b6101b760048036038101906101b29190610b25565b6103c3565b6040516101c49190610b7d565b60405180910390f35b6101e760048036038101906101e29190610c6d565b6103e5565b6040516101f49190610ba5565b60405180910390f35b60606003805461020c90610cd8565b80601f016020809104026020016040519081016040528092919081815260200182805461023890610cd8565b80156102835780601f1061025a57610100808354040283529160200191610283565b820191905f5260205f20905b81548152906001019060200180831161026657829003601f168201915b5050505050905090565b5f80610297610467565b90506102a481858561046e565b600191505092915050565b5f600254905090565b5f806102c2610467565b90506102cf858285610480565b6102da858585610512565b60019150509392505050565b5f6012905090565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b60606004805461034290610cd8565b80601f016020809104026020016040519081016040528092919081815260200182805461036e90610cd8565b80156103b95780601f10610390576101008083540402835291602001916103b9565b820191905f5260205f20905b81548152906001019060200180831161039c57829003601f168201915b5050505050905090565b5f806103cd610467565b90506103da818585610512565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b5f33905090565b61047b8383836001610602565b505050565b5f61048b84846103e5565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461050c57818110156104fd578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016104f493929190610d17565b60405180910390fd5b61050b84848484035f610602565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610582575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016105799190610d4c565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036105f2575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016105e99190610d4c565b60405180910390fd5b6105fd8383836107d1565b505050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610672575f6040517fe602df050000000000000000000000000000000000000000000000000000000081526004016106699190610d4c565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036106e2575f6040517f94280d620000000000000000000000000000000000000000000000000000000081526004016106d99190610d4c565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f208190555080156107cb578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516107c29190610ba5565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610821578060025f8282546108159190610d92565b925050819055506108ef565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050818110156108aa578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016108a193929190610d17565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610936578060025f8282540392505081905550610980565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516109dd9190610ba5565b60405180910390a3505050565b5f81519050919050565b5f82825260208201905092915050565b5f5b83811015610a21578082015181840152602081019050610a06565b5f8484015250505050565b5f601f19601f8301169050919050565b5f610a46826109ea565b610a5081856109f4565b9350610a60818560208601610a04565b610a6981610a2c565b840191505092915050565b5f6020820190508181035f830152610a8c8184610a3c565b905092915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610ac182610a98565b9050919050565b610ad181610ab7565b8114610adb575f80fd5b50565b5f81359050610aec81610ac8565b92915050565b5f819050919050565b610b0481610af2565b8114610b0e575f80fd5b50565b5f81359050610b1f81610afb565b92915050565b5f8060408385031215610b3b57610b3a610a94565b5b5f610b4885828601610ade565b9250506020610b5985828601610b11565b9150509250929050565b5f8115159050919050565b610b7781610b63565b82525050565b5f602082019050610b905f830184610b6e565b92915050565b610b9f81610af2565b82525050565b5f602082019050610bb85f830184610b96565b92915050565b5f805f60608486031215610bd557610bd4610a94565b5b5f610be286828701610ade565b9350506020610bf386828701610ade565b9250506040610c0486828701610b11565b9150509250925092565b5f60ff82169050919050565b610c2381610c0e565b82525050565b5f602082019050610c3c5f830184610c1a565b92915050565b5f60208284031215610c5757610c56610a94565b5b5f610c6484828501610ade565b91505092915050565b5f8060408385031215610c8357610c82610a94565b5b5f610c9085828601610ade565b9250506020610ca185828601610ade565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680610cef57607f821691505b602082108103610d0257610d01610cab565b5b50919050565b610d1181610ab7565b82525050565b5f606082019050610d2a5f830186610d08565b610d376020830185610b96565b610d446040830184610b96565b949350505050565b5f602082019050610d5f5f830184610d08565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610d9c82610af2565b9150610da783610af2565b9250828201905080821115610dbf57610dbe610d65565b5b9291505056fea264697066735822122086086da2d235b135b40b070ebb2a178bff8c15fe57e45aa19e67f4dc59dd098064736f6c634300081500330000000000000000000000000000000000000000000000000000000005f5e100'
    });
    console.log(receipt);
    const storageAddress = receipt.contractAddress;
    console.log(storageAddress);
    const receiptPull = yield web3.eth.getTransactionReceipt(receipt.transactionHash);
    assert_1.default.equal(receiptPull.contractAddress, receipt.contractAddress);
    // receipt = await web3.eth.sendTransaction({
    //   from: accounts[0],
    //   to: storageAddress,
    //   gas: 1000000,
    //   data: '0x6057361d000000000000000000000000000000000000000000000000000000000000000e'
    // })
    // console.log(receipt)
    // assert.notEqual(value, 15)
    // assert.equal(value, 14)
    // console.log(value)
    res.send('Welcome to remix-simulator');
}));
app.get('/erc20/txs/:contract_address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contract_address } = req.params;
    const accounts = yield web3.eth.getAccounts();
    const storageAddress = contract_address;
    console.log(`\nINTERACTING WITH: ${storageAddress}\n`);
    // const receiptPull = await web3.eth.getTransactionReceipt(receipt.transactionHash)
    const value = yield web3.eth.call({
        from: accounts[0],
        to: storageAddress,
        data: '0x18160ddd'
    });
    console.log(`TOTAL SUPPLY: ${value}`);
    const value1 = yield web3.eth.call({
        from: accounts[0],
        to: storageAddress,
        data: '0x06fdde03'
    });
    console.log(`NAME: ${value1}`);
    res.send('Welcome to remix-simulator');
    const value2 = yield web3.eth.call({
        from: accounts[0],
        to: storageAddress,
        data: '0x70a082310000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc4'
    });
    console.log(`BALANCE OF 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4: ${value2}`);
    // let receipt = await web3.eth.sendTransaction({
    //   from: accounts[0],
    //   gas: 1000000,
    //   data: '0x095ea7b30000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc40000000000000000000000000000000000000000000000000000000000000064'
    // })
    // console.log(`APPROVE 100 TOKENS: ${receipt}`)
    // receipt = await web3.eth.sendTransaction({
    //   from: accounts[0],
    //   gas: 1000000,
    //   data: '0xa9059cbb000000000000000000000000197f818c1313dc58b32d88078ecdfb40ea8226140000000000000000000000000000000000000000000000000000000000000045'
    // })
    // console.log(`SEND 69 TOKENS to 0x197f818c1313dc58b32d88078ecdfb40ea822614: ${receipt}`)
    // const value3 = await web3.eth.call({
    //   from: accounts[0],
    //   to: storageAddress,
    //   data: '0x70a08231000000000000000000000000197f818c1313dc58b32d88078ecdfb40ea822614'
    // })
    // console.log(`BALANCE OF 0x197f818c1313dc58b32d88078ecdfb40ea822614: ${value2}`);
    res.send('Welcome to remix-simulator');
}));
app.get('/erc20/transact/:contract_address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contract_address } = req.params;
    const accounts = yield web3.eth.getAccounts();
    const storageAddress = contract_address;
    console.log(`\nINTERACTING WITH: ${storageAddress}\n`);
    // const receiptPull = await web3.eth.getTransactionReceipt(receipt.transactionHash)
    // const value = await web3.eth.call({
    //   from: accounts[0],
    //   to: storageAddress,
    //   data: '0x18160ddd'
    // })
    // console.log(`TOTAL SUPPLY: ${value}`)
    // const value1 = await web3.eth.call({
    //   from: accounts[0],
    //   to: storageAddress,
    //   data: '0x06fdde03'
    // })
    // console.log(`NAME: ${value1}`)
    // res.send('Welcome to remix-simulator') 
    // const value2 = await web3.eth.call({
    //   from: accounts[0],
    //   to: storageAddress,
    //   data: '0x70a082310000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc4'
    // })
    // console.log(`BALANCE OF 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4: ${value2}`);
    let receipt = yield web3.eth.sendTransaction({
        from: accounts[0],
        gas: 10000000,
        to: storageAddress,
        data: '0x095ea7b30000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc40000000000000000000000000000000000000000000000000000000000000064'
    });
    console.log(`APPROVE 100 TOKENS: ${receipt}`);
    receipt = yield web3.eth.sendTransaction({
        from: accounts[0],
        gas: 10000000,
        to: storageAddress,
        data: '0xa9059cbb000000000000000000000000197f818c1313dc58b32d88078ecdfb40ea8226140000000000000000000000000000000000000000000000000000000000000045'
    });
    console.log(`SEND 69 TOKENS to 0x197f818c1313dc58b32d88078ecdfb40ea822614: ${receipt}`);
    const value3 = yield web3.eth.call({
        from: accounts[0],
        to: storageAddress,
        data: '0x70a08231000000000000000000000000197f818c1313dc58b32d88078ecdfb40ea822614'
    });
    console.log(`BALANCE OF 0x197f818c1313dc58b32d88078ecdfb40ea822614: ${value3}`);
    res.send('Welcome to remix-simulator');
}));
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new provider_2.Provider({ fork: 'shanghai' });
    yield provider.init();
    web3.setProvider(provider);
    (0, logs_1.log)('Remix Simulator listening');
}));
