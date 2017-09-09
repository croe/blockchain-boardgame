pragma solidity ^0.4.4;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {

	mapping (address => uint) balances;
	mapping (address => mapping(address => uint)) assets;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	function MetaCoin() {
		balances[tx.origin] = 10000;
		assets[tx.origin][0] = 20;
		assets[tx.origin][1] = 30;
		assets[tx.origin][2] = 40;
		assets[tx.origin][3] = 50;
		assets[tx.origin][4] = 60;
		assets[tx.origin][5] = 70;
	}

	function sendCoin(address receiver, uint amount) returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		Transfer(msg.sender, receiver, amount);
		return true;
	}

	function getBalanceInEth(address addr) returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) returns(uint) {
		return balances[addr];
	}

	function getAssetBalance(address addr, uint index) returns(uint) {
		if(index == 0) return assets[addr][0];
		if(index == 1) return assets[addr][1];
		if(index == 2) return assets[addr][2];
		if(index == 3) return assets[addr][3];
		if(index == 4) return assets[addr][4];
		if(index == 5) return assets[addr][5];
	}
}
