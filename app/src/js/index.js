import React, {Component} from 'react'
import {Link} from 'react-router';
import {findDOMNode} from "react-dom"
import QRreader from 'react-qr-reader'
import Modal from 'react-modal'
import swal from 'sweetalert'
import numeral from 'numeral'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
      dispModalIsOpen: false,
      initModalIsOpen: false,
      buyerModalIsOpen: false,
      sellerModalIsOpen: false,
      controlModalIsOpen: false
    }

    this.playerInitHandleScan = this.playerInitHandleScan.bind(this)
    this.buyerHandleScan = this.buyerHandleScan.bind(this)
    this.sellHandleScan = this.sellHandleScan.bind(this)
  }

  componentDidMount() {
    let it = this;
    console.log(it.getNumeralNum(1.234))
  }

  sellHandleScan(data){
    // TODO: ほんとは二重購入防止のコードを入れたい
    let it = this;
    let assetName;
    let aName = [];
    let json = JSON.parse(data);
    if (data !== null && json.x === 2) {
      if (json.a[0] === 0) { assetName = 'WEAPONかBOMB'; aName[0]='WEAPON'; aName[1]='BOMB'; }
      else if (json.a[0] === 2) { assetName = 'DRUGかFAKEBILLS'; aName[0]='DRUG'; aName[1]='FAKEBILLS'; }
      else if (json.a[0] === 4) { assetName = 'JEWELRYかARTS'; aName[0]='JEWELRY'; aName[1]='ARTS'; }
      console.log(json);
      swal({
        title: "トレードを行いますか？",
        text: assetName + 'を' + json.m + '個⇄' +json.v+'コイン',
        icon: "info",
        buttons: true,
        dangerMode: true
      })
        .then((agree) => {
          if (agree) {
            // どちらのアセットを売りに出すか？

            swal({
              title: "どちらのアセットを売却しますか？",
              icon: "info",
              buttons: {
                cancel: "キャンセル",
                pat1: {
                  text: aName[0],
                  value: "pat1"
                },
                pat2: {
                  text: aName[1],
                  value: "pat2"
                }
              }
            }).then((value)=>{
              switch (value) {
                case "pat1":
                  if (it.props.assetValue[json.a[0]] >= json.m) {
                    it.props.setSendCoin(it.props._it, json.p, it.props.player, json.v);
                    it.props.setSendAsset(it.props._it, it.props.player, json.p, json.m, json.a[0]);
                    swal("売却完了しました！", {
                      icon: "success",
                    }).then(()=>{
                      it.props.getPlayerCoinBalanse(it.props._it);
                      // it.props.getPlayerAssetsBalance(it.props._it);
                      it.closeSellerModal()
                    })
                  } else {
                    swal("キャンセルしました。");
                  }
                  break;
                case "pat2":
                  if (it.props.assetValue[json.a[1]] >= json.m) {
                    it.props.setSendCoin(it.props._it, json.p, it.props.player, json.v);
                    it.props.setSendAsset(it.props._it, it.props.player, json.p, json.m, json.a[1]);
                    swal("売却完了しました！", {
                      icon: "success",
                    }).then(()=>{
                      it.props.getPlayerCoinBalanse(it.props._it);
                      // it.props.getPlayerAssetsBalance(it.props._it);
                      it.closeSellerModal()
                    })
                  } else {
                    swal("キャンセルしました。");
                  }
                  break;
                default:
                  it.closeSellerModal()
              }
            })
          } else {
            swal("キャンセルしました。");
          }
        });
    }

  }
  buyerHandleScan(data){
    // TODO: ほんとは二重購入防止のコードを入れたい
    let it = this;
    let assetName;
    let json = JSON.parse(data);
    if (data !== null && json.x === 3) {
      if (json.a === 0) { assetName = 'WEAPON' }
      else if (json.a === 1) { assetName = 'BOMB' }
      else if (json.a === 2) { assetName = 'DRUG' }
      else if (json.a === 3) { assetName = 'FAKEBILLS' }
      else if (json.a === 4) { assetName = 'JEWELRY' }
      else if (json.a === 5) { assetName = 'ARTS' }
      console.log(json);
      swal({
        title: "この資産を買い付けますか？",
        text: assetName + '価格: ' + json.v,
        icon: "info",
        buttons: true,
        dangerMode: true
      })
        .then((agree) => {
          if (agree) {
            // 残高確認＆相手のアセット残高確認
            if (it.props.coinValue >= json.v) {
              it.props.setSendCoin(it.props._it, it.props.player, json.p, json.v);
              it.props.setSendAsset(it.props._it, json.p, it.props.player, json.m, json.a);
              swal("購入完了しました！", {
                icon: "success",
              }).then(()=>{
                it.props.getPlayerCoinBalanse(it.props._it);
                // it.props.getPlayerAssetsBalance(it.props._it);
                it.closeBuyerModal()
              })
            }
          } else {
            swal("キャンセルしました。");
          }
        });
    }
  }
  playerInitHandleScan(data){
    let it = this;
    let player;
    let json = JSON.parse(data);
    if (data !== null) {
      console.log(json);
      if (json.p === 1) { player = 'Alice' }
      else if (json.p === 2) { player = 'Bob' }
      else if (json.p === 3) { player = 'Carol' }
      else if (json.p === 4) { player = 'Dave' }
      else if (json.p === 5) { player = 'Ellen' }
      else if (json.p === 6) { player = 'Frank' }
      else if (json.p === 7) { player = 'Grace' }
      else if (json.p === 8) { player = 'Olivia' }
      if (json.x === 1){
        swal({
          title: "このプレイヤーを登録しますか？",
          text: player,
          icon: "info",
          buttons: true,
          dangerMode: true,
          html: true
        })
          .then((agree) => {
            if (agree) {
              /**
               * Web3
               */
              /*
              it.props.setInitPlayer(it.props._it, json.p);
              it.props.getPlayerCoinBalanse(it.props._it);
              it.props.getPlayerAssetsBalance(it.props._it);
              */

              /**
               * Node server
               */
              it.props.socketIns.emit('init player', json.p);
              it.props.socketIns.emit('msg update');
              swal("登録しました！", {
                icon: "success",
              }).then(()=>{
                it.closeInitModal();
              })
            } else {
              swal("キャンセルしました。");
            }
          });
      }
      this.setState({
        result: data
      })
    }
  }

  handleError(err) {
    console.log(err)
  }

  onClickSendCoin() {
    let it = this;
    let val = findDOMNode(it.refs.sendValue).value;
    let pla = findDOMNode(it.refs.sendPlayer).value;
    it.props.setSendCoin(it.props._it, it.props.player, pla, val);
  }

  onClickSendAsset(){
    let it = this;
    let valA = findDOMNode(it.refs.sendValueA).value;
    let plaA = findDOMNode(it.refs.sendPlayerA).value;
    let indA = findDOMNode(it.refs.sendIndexA).value;
    it.props.setSendAsset(it.props._it, it.props.player, plaA, valA, indA);
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

  onClickDeleteMarket(){
    let it = this;
    if (it.props.isHandshake) {
      console.log('deleteDB')
      it.props.socketIns.emit('msg reset market');
    } else {
      console.log('Can not connect WebSocket!');
    }
  }

  onClickCreateDB() {
    let it = this;
    if (it.props.isHandshake) {
      console.log('create userDB');
      it.props.socketIns.emit('init userdb');
    } else {
      console.log('Can not connetct Websocket!');
    }

  }

  openCtrlModal(){ this.setState({ controlModalIsOpen: true })}
  closeCtrlModal(){ this.setState({ controlModalIsOpen: false })}

  openDispModal(){ this.setState({ dispModalIsOpen: true })}
  closeDispModal(){ this.setState({ dispModalIsOpen: false })}

  openInitModal(){ this.setState({ initModalIsOpen: true })}
  closeInitModal(){ this.setState({ initModalIsOpen: false })}

  openBuyerModal(){ this.setState({ buyerModalIsOpen: true })}
  closeBuyerModal(){ this.setState({ buyerModalIsOpen: false })}

  openSellerModal(){ this.setState({ sellerModalIsOpen: true })}
  closeSellerModal(){ this.setState({ sellerModalIsOpen: false })}

  onSubmitDisplay(){
    let it = this;
    let assetName;
    let asset = findDOMNode(it.refs.mdispasset).value;
    let amount = findDOMNode(it.refs.mdispamount).value;
    let value = findDOMNode(it.refs.mdispvalue).value;
    if (asset === '0'){ assetName = 'WEAPON';
    } else if (asset === '1'){ assetName = 'BOMB';
    } else if (asset === '2'){ assetName = 'DRUG';
    } else if (asset === '3'){ assetName = 'FAKEBILLS';
    } else if (asset === '4'){ assetName = 'JEWELRY';
    } else if (asset === '5'){ assetName = 'ARTS';}

    let txt1 = "アセット: "+assetName +'\n';
    let txt2 = "個数: "+amount+'\n';
    let txt3 = "価格: "+value;
    let txt =txt1 + txt2 +txt3;

    swal({
      title: "この内容でよろしければOKを押してください。",
      text: txt,
      icon: "info",
      buttons: true,
      dangerMode: true,
      html: true
    })
      .then((agree) => {
        if (agree && amount <= it.props.assetValue[asset]) {
          let dispinfo = {
            p: it.props.player,
            a: asset,
            m: amount,
            v: value,
            so: false,
            ca: false
          }
          if (it.props.isHandshake) {
            it.props.socketIns.emit('msg send', dispinfo);
            swal("出品しました！", {
              icon: "success",
            }).then(()=>{
              asset = 0;
              value = 0;
              amount = 0;
              it.closeDispModal();
            });
          } else {
            console.log('Can not connect WebSocket!');
            swal("出品をキャンセルしました");
          }
        } else {
          swal("出品をキャンセルしました");
        }
      });
  }

  MdispAssetHandleChange(event){
    this.setState({dispAsset: event.target.value})
  }
  MdispAmountHandleChange(event){
    this.setState({dispAmount: event.target.value})
  }
  MdispValueHandleChange(event){
    this.setState({dispValue: event.target.value})
  }

  buyMAssetHandleClick(event, item){
    let it = this;
    swal({
      title: "本当にこの商品を購入しますか？",
      icon: "info",
      buttons: true,
      dangerMode: true
    })
      .then((agree) => {
        if (agree) {
          // 自分の残高確認
          // 相手のアセット残高確認
          // 購入相手が自分である場合・・・？（処理上は問題ないが・・）

          if (it.props.coinValue > item.value && !item.isSoldout && !item.isCancel) {
            it.props.setSendCoin(it.props._it, it.props.player, item.player, item.value);
            it.props.setSendAsset(it.props._it, item.player, it.props.player, item.amount, item.asset);
            swal("購入完了しました！", {
              icon: "success",
            }).then(()=>{
              it.props.getPlayerCoinBalanse(it.props._it);
              // it.props.getPlayerAssetsBalance(it.props._it);
              // 表示を消す（売り切れ処理）
              it.props.socketIns.emit('msg soldout', item._id);
            })
          }
        } else {
          swal("キャンセルしました。");
        }
      });
  }

  playerName(){
    let it = this;
    if (it.props.player === 0) { return 'Owner' }
    else if (it.props.player === 1) { return 'Alice' }
    else if (it.props.player === 2) { return 'Bob' }
    else if (it.props.player === 3) { return 'Carol'}
    else if (it.props.player === 4) { return 'Dave' }
    else if (it.props.player === 5) { return 'Ellen'}
    else if (it.props.player === 6) { return 'Frank'}
    else if (it.props.player === 7) { return 'Grace'}
    else if (it.props.player === 8) { return 'Olivia'}

  }

  getNumeralNum(val){
    let _v = numeral(val)
    return _v.value();
  }

  render() {
    const previewStyle = {
      heigth: 240,
      width: 320
    }

    const customStyles = {
      overlay : {//ovelayの色を変える
        background: 'rgba(0,0,0, .4)'
      },
      content : {
        top : '50%',
        left : '50%',
        right : 'auto',
        bottom : 'auto',
        marginRight : '-50%',
        transform : 'translate(-50%, -50%)',
        width : '72%',//openしているコンテンツの幅を変える,
        zIndex: '100'
      }
    };

    let market = this.props.masset.map((item,i)=>{
      if (!item.isSoldout && !item.isCancel && item.amount > 0) {
        let assetName;
        if (item.asset === 0){ assetName = 'weapon';
        } else if (item.asset === 1){ assetName = 'bomb';
        } else if (item.asset === 2){ assetName = 'drug';
        } else if (item.asset === 3){ assetName = 'fakebills';
        } else if (item.asset === 4){ assetName = 'jewelry';
        } else if (item.asset === 5){ assetName = 'arts';}

        let ifme;
        if (item.player === this.props.player){
          ifme = 'self';
        }
        return (
          <li key={i} className={ifme} onClick={e => this.buyMAssetHandleClick(e, item)}><div className={"inner " + assetName}>{item.amount} / {item.value}</div></li>
        )
      }
    })

    return (
      <div className="app">
        <main className="container">
          <div>
            {/*<h1>{this.playerName()}'s Wallet</h1>*/}
            {/*<button className="btn_next">Next turn</button>*/}
            <div className="coin_balance" onClick={this.openCtrlModal.bind(this)}>{this.props.coinValue}</div>
            <ul className="assets_balance">
              <li>{this.getNumeralNum(this.props.assetValue[0])}</li>
              <li>{this.props.assetValue[1]}</li>
              <li>{this.props.assetValue[2]}</li>
              <li>{this.props.assetValue[3]}</li>
              <li>{this.props.assetValue[4]}</li>
              <li>{this.props.assetValue[5]}</li>
            </ul>
          </div>
          <div>
            <h1>Market</h1>
            <ul className="market_list">
              {market}
            </ul>
            <div className="pure-g">
              {/*<div className="pure-u-1-1">*/}
              {/*<input ref="sendPlayer" type="text" defaultValue=""/>*/}
              {/*<input ref="sendValue" type="text" defaultValue="0"/>*/}
              {/*<button className="pure-button" onClick={this.onClickSendCoin.bind(this)}>1</button>*/}
              {/*</div>*/}
              {/*<div className="pure-u-1-1">*/}
              {/*<input ref="sendPlayerA" type="text" defaultValue=""/>*/}
              {/*<input ref="sendValueA" type="text" defaultValue="0"/>*/}
              {/*<input ref="sendIndexA" type="text" defaultValue="0"/>*/}
              {/*<button className="pure-button" onClick={this.onClickSendAsset.bind(this)}>4</button>*/}
              {/*</div>*/}
            </div>
            <Modal
              isOpen={this.state.controlModalIsOpen}
              style={customStyles}
              contentLabel="Buttons"
            >
              <button onClick={this.openDispModal.bind(this)}>アセットを出品する</button>
              <button onClick={this.openBuyerModal.bind(this)}>アセットの買い付け</button>
              <button onClick={this.openSellerModal.bind(this)}>オープンマーケットで売る</button>
              <button onClick={this.openInitModal.bind(this)}>プレイヤー登録</button>
              <button onClick={this.onClickDeleteDB.bind(this)}>DB-RM</button>
              <button onClick={this.onClickCreateDB.bind(this)}>DB-CR</button>
              <button onClick={this.closeCtrlModal.bind(this)}>閉じる</button>
            </Modal>
            <Modal
              isOpen={this.state.dispModalIsOpen}
              style={customStyles}
              contentLabel="Modal"
            >
              <h1>マーケットに出品</h1>
              <p>
                どのアセットを出品しますか？<br/>
                <select ref="mdispasset">
                  <option value="0">WEAPON</option>
                  <option value="1">BOMB</option>
                  <option value="2">DRUG</option>
                  <option value="3">FAKEBILLS</option>
                  <option value="4">JEWELRY</option>
                  <option value="5">ARTS</option>
                </select></p>

              <p>
                いくつ出品しますか？（上限６）<br/>
                <input ref="mdispamount" type="number"/>
              </p>

              <p>
                いくらで販売しますか？<br/>
                <input ref="mdispvalue" type="number" value={this.state.dispValue}/>
              </p>

              <button className="pure-button" onClick={this.onSubmitDisplay.bind(this)}>この内容で出品</button>
              <button className="pure-button" onClick={this.closeDispModal.bind(this)}>閉じる</button>
            </Modal>
            <Modal
              isOpen={this.state.initModalIsOpen}
              style={customStyles}
              contentLabel="Player Init"
            >
              <h1>プレイヤーの登録</h1>
              <QRreader
                delay={this.state.delay}
                style={previewStyle}
                onError={this.handleError}
                onScan={this.playerInitHandleScan}
                facingMode={'rear'}
              />
              <button className="pure-button" onClick={this.closeInitModal.bind(this)}>閉じる</button>
            </Modal>
            <Modal
              isOpen={this.state.buyerModalIsOpen}
              style={customStyles}
              contentLabel="Buyer"
            >
              <h1>アセットの買い付け</h1>
              <QRreader
                delay={this.state.delay}
                style={previewStyle}
                onError={this.handleError}
                onScan={this.buyerHandleScan}
                facingMode={'front'}
              />
              <button className="pure-button" onClick={this.closeBuyerModal.bind(this)}>閉じる</button>
            </Modal>
            <Modal
              isOpen={this.state.sellerModalIsOpen}
              style={customStyles}
              contentLabel="Seller"
            >
              <h1>オープンマーケットで売る</h1>
              <QRreader
                delay={this.state.delay}
                style={previewStyle}
                onError={this.handleError}
                onScan={this.sellHandleScan}
                facingMode={'front'}
              />
              <button className="pure-button" onClick={this.closeSellerModal.bind(this)}>閉じる</button>
            </Modal>
          </div>
        </main>
      </div>
    );
  }
}

export default Index

// TODO: プレイヤー情報の保持（オーナーのQRが必要）、store.jsを使う
// TODO: オープンマーケットでアセットを消費してしまった時の、マーケットに残る情報から購入できないようにする
// -> キャンセル機能の設定
// -> アセット側の数量を確認した上での取引
// TODO: アセット買い付け時の二重払いを制限　ユニークキーを保持・確認
