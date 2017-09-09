import React, {Component} from 'react'
import {findDOMNode} from "react-dom"
import QRreader from 'react-qr-reader'

import './css/oswald.css'
import './css/open-sans.css'
import './css/ionic.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delay: 100,
      result: 'No result'
    }

    this.handleScan = this.handleScan.bind(this)
  }

  handleScan(data){
    this.setState({
      result: data
    })
  }
  handleError(err) {
    console.log(err)
  }

  componentWillMount(){
  }

  onClickSendCoin() {
    let it = this;
    let val = findDOMNode(it.refs.sendValue).value;
    it.props.setSendCoin(it.props._it, val);
  }

  onClickSaveMessage() {
    let it = this;
    if (it.props.isHandshake) {
      it.props.socketIns.emit('msg send', 'test message2!');
    } else {
      console.log('Can not connect WebSocket!');
    }
  }

  onClickDeleteDB() {
    let it = this;
    if (it.props.isHandshake) {
      console.log('deleteDB')
      it.props.socketIns.emit('deleteDB');
    } else {
      console.log('Can not connect WebSocket!');
    }
  }

  render() {
    const previewStyle = {
      heigth: 240,
      width: 320
    }

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by
                default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.props.coinValue}</p>
              <input ref="sendPlayer" type="text" defaultValue=""/>
              <input ref="sendValue" type="text" defaultValue="0"/>
              <button onClick={this.onClickSendCoin.bind(this)}>SendCoin!</button>
              <button onClick={this.onClickSaveMessage.bind(this)}>SaveMessage!</button>
              <button onClick={this.onClickDeleteDB.bind(this)}>DeleteDB</button>
            </div>
            <div className="pure-u-1-1">
              <QRreader
                delay={this.state.delay}
                style={previewStyle}
                onError={this.handleError}
                onScan={this.handleScan}
              />
              <p>{this.state.result}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
