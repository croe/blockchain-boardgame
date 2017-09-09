import React, {Component} from "react";
import {render} from "react-dom";
import {browserHistory, Router, Route, IndexRoute, Link} from 'react-router';
import App from './App'
import io from 'socket.io-client';
import getWeb3 from './utils/getWeb3';
import contract from 'truffle-contract';

import MetaCoinContract from '../build/contracts/MetaCoin.json'

// const host = '192.168.1.185'
const host = 'localhost'

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHandshake: false,
      isCompleteInitialize: false,
      socketIns: {},
      player: 0,
      accounts: [],
      coin: '',
      coinInstance: '',
      coinValue: 0,
      assetValue: [],
      web3: null
    }
  }

  componentWillMount() {
    let it = this;

    /**
     * Initialize WebSockets
     * Add Events
     */

    let _socket = io('https://'+host+':3030');
    _socket.on('connect', () => {
      it.setState({
        socketIns: _socket,
        isHandshake: true
      });
      _socket.emit('msg update');
      _socket.on('msg open', (msg) => {
        if (msg.length === 0) {
          console.log('none');
        } else {
          console.log('get message!', msg);
        }
      });
      _socket.on('msg push', (msg) => {
        console.log(msg);
      })
    });

    /**
     * Initialize Web3 Objects
     */

    getWeb3.then(results => {
      it.setState({
        web3: results.web3,
        isLoadWeb3: true
      })
      it.instantiateContract()
    }).catch(() => {
      console.log('Error finding web3.')
    })

    /**
     * Initialize Instascan Objects
     */

  }

  instantiateContract() {
    let it = this;

    /**
     * GET Player Coin Balance
     */
    const metaCoin = contract(MetaCoinContract)
    metaCoin.setProvider(it.state.web3.currentProvider)
    it.setState({coin: metaCoin});

    it.state.web3.eth.getAccounts((err, accounts) => {
      it.state.coin.deployed().then((instance) => {
        it.setState({
          coinInstance: instance,
          accounts: accounts
        });
        it.getPlayerAssetsBalance();
        it.getPlayerCoinBalanse();
      })
    });
  }

  getPlayerCoinBalanse() {
    let it = this;
    it.state.coinInstance.getBalance.call(it.state.accounts[0], {from: it.state.accounts[0]}).then((val) => {
      it.setState({
        coinValue: val.c[0]
      })
    });
  }

  getPlayerAssetsBalance() {
    let it = this;
    let arr = [];
    for (let i = 0; i < 6; i++) {
      it.state.coinInstance.getAssetBalance.call(it.state.accounts[0], i, {from: it.state.accounts[0]}).then((result) => {
        arr[i] = result.c[0]
        if (i === 5) {
          it.setState({assetValue: arr});
        }
      })
    }
  }

  setSendCoin(_this, val) {
    let it = _this;
    it.state.coinInstance.sendCoin(it.state.accounts[1], val, {from: it.state.accounts[0]})
      .then(() => {
        console.log('send complete')
        it.getPlayerCoinBalanse()
      })
  }

  render() {
    return (
      <div>
        {this.props.children && React.cloneElement(this.props.children, {
          _it: this,
          isHandshake: this.state.isHandshake,
          socketIns: this.state.socketIns,
          accounts: this.state.accounts,
          player: this.state.player,
          coin: this.state.coin,
          coinInstance: this.state.coinInstance,
          coinValue: this.state.coinValue,
          assetValue: this.state.assetValue,
          web3: this.state.web3,
          setSendCoin: this.setSendCoin
        })}
      </div>
    )
  }


}

render((
    <Router history={browserHistory}>
      <Route path="/" components={Index}>
        <IndexRoute components={App}/>
      </Route>
    </Router>
  ), document.getElementById('root')
);
