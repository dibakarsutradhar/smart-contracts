// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Encoding {
    function combineStrings() public pure returns (string memory) {
        return string(abi.encodePacked("Hello ", "world"));
    }

    // When we send a transaction, it is "compiled" down to bytecode and sent in a "data" object of the transaction.
    // That data object now governs how future transactions will interact with it.
    // For example: https://rinkeby.etherscan.io/tx/0x924f592458b0e37ee17024f9c826b97697455cd97f6946b802bc42296e77ae43

    // Now, in order to read and understand these bytes, you need a special reader.
    // This is supposed to be a new contract? How can you tell?
    // Let's compile this contract in hardhat or remix, and you'll see the the "bytecode" output - that's that will be sent when
    // creating a contract.

    // This bytecode represents exactly the low level computer instructions to make our contract happen.
    // These low level instructions are spread out into soemthing call opcodes.

    // An opcode is going to be 2 characters that represents some special instruction, and also optionally has an input

    // You can see a list of there here:
    // https://www.evm.codes/
    // Or here:
    // https://github.com/crytic/evm-opcodes

    // This opcode reader is sometimes abstractly called the EVM - or the ethereum virtual machine.
    // The EVM basically represents all the instructions a computer needs to be able to read.
    // Any language that can compile down to bytecode with these opcodes is considered EVM compatible
    // Which is why so many blockchains are able to do this - you just get them to be able to understand the EVM and presto! Solidity smart contracts work on those blockchains.

    // Now, just the binary can be hard to read, so why not press the `assembly` button? You'll get the binary translated into
    // the opcodes and inputs for us!
    // We aren't going to go much deeper into opcodes, but they are important to know to understand how to build more complex apps.

    // How does this relate back to what we are talking about?
    // Well let's look at this encoding stuff

    // In this function, we encode the number one to what it'll look like in binary
    // Or put another way, we ABI encode it.
}
