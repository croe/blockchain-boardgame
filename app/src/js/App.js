import React, {Component} from "react";
import {render} from "react-dom";
import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import io from 'socket.io-client';

import Index from './index';


class App extends Component {

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
      coinValue: 100,
      assetValue: [0.0,0.0,0.0,0.0,0.0,0.0],
      web3: null,
      masset: []
    }
  }

  componentWillMount() {
    let it = this;

    /**
     * Initialize WebSockets
     * Add Events
     */

    let _socket = io();

    // let _socket = io('http://localhost:3030/');

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
          it.setState({
            masset: msg
          })
        }
      });
      _socket.on('msg push', (msg) => {
        console.log(msg);
      })
      _socket.on('msg refresh', (msg)=>{
        it.setState({
          masset: msg
        })
      })
      _socket.on('send res', (msg) =>{
        _socket.emit('balance refresh');
      })
      _socket.on('balance res', (msg) => {
        it.setState({
          coinValue: msg[it.state.player].balance,
          assetValue: msg[it.state.player].assetsBalance
        })
      })
      _socket.on('inited player', (msg) => {
        console.log(msg)
        it.setState({
          player: msg.player,
          coinValue: msg.balance,
          assetValue: msg.assetsBalance
        })
      })
    });

  }

  getPlayerCoinBalanse(_this) {
    let it = _this;

    /**
     * Node server
     */
    it.state.socketIns.emit('balance refresh');


  }

  getPlayerAssetsBalance(_this, _player) {
    let it = _this;

    /**
     * Node server
     * getPlayerCoinBalanseに統合
     */

    it.state.socketIns.emit('get asset for market' ,_player);


  }

  setSendCoin(_this,_from, _to, _val) {

    let it = _this;

    /**
     * Node server
     */
    let sendCoinVal = {
      from: _from,
      to: _to,
      val: _val
    }
    it.state.socketIns.emit('send coin', sendCoinVal);

  }

  setSendAsset(_this, _from, _to, _val, _ind) {

    let it = _this;

    /**
     * Node server
     */
    let sendAssetVal = {
      from: _from,
      to: _to,
      val: _val,
      ind: _ind
    }
    it.state.socketIns.emit('send asset', sendAssetVal);
  }

  setInitPlayer(_this, p){
    let it = _this;
    it.setState({
      player: p
    })
  }

  render() {
    return (
      <div className="wrapper">
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
          masset: this.state.masset,
          setSendCoin: this.setSendCoin,
          setSendAsset: this.setSendAsset,
          setInitPlayer: this.setInitPlayer,
          getPlayerCoinBalanse: this.getPlayerCoinBalanse,
          getPlayerAssetsBalance: this.getPlayerAssetsBalance
        })}
      </div>
    )
  }


}

render((
    <Router history={browserHistory}>
      <Route path="/" components={App}>
        <IndexRoute components={Index}/>
        <Route path="/config" component={Index}/>
      </Route>
    </Router>
  ), document.getElementById('root')
);
