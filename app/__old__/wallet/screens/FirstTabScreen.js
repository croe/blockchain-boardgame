import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';

// import web3 objects
const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://192.168.245.240:8545'));

export default class FirstTabScreen extends Component {
  static navigatorButtons = {
    leftButtons: [{
      id: 'menu'
    }],
    rightButtons: [
      {
        title: 'Edit',
        id: 'edit'
      },
      {
        id: 'add'
      }
    ]
  };
  static navigatorStyle = {
    navBarBackgroundColor: '#3b5998',
    navBarTextColor: '#fff',
    navBarSubtitleTextColor: '#ff0000',
    navBarButtonColor: '#ffffff',
    statusBarTextColorScheme: 'light',
    tabBarBackgroundColor: '#4dbce9',
    tabBarButtonColor: '#ffffff',
    tabBarSelectedButtonColor: '#ffff00'
  };

  state = {
    balance: null
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  getBalance(){
    web3.eth.getCoinbase((err, coinbase) => {
      const balance = web3.eth.getBalance(coinbase, (err2, balance) => {
        // console.log('Accounts', web3.eth.getAccounts);
        // console.log('defaultAccount', web3.eth.defaultAccount);
        console.log('coinbase: ' + coinbase);
        console.log('balance: ' + web3.fromWei(balance, 'ether') + ' ETH');
        this.setState({balance});
      })
    });

    let abi = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "getBalanceInEth",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "receiver",
            "type": "address"
          },
          {
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "sendCoin",
        "outputs": [
          {
            "name": "sufficient",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "getBalance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_from",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "_to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      }
    ];
    const MetaCoin = web3.eth.contract(abi);
    const MetaCoinInstance = MetaCoin.at(web3.currentProvider);
    console.log(MetaCoinInstance)

    web3.eth.getAccounts((err3, accounts)=> {

    })
    // const Result = myContractInstance.getBalance.call(coinbase, {from: coinbase}).then(function(value) {
    //   console.log(value.valueOf());
    // }).catch(function(e) {
    //   console.log(e, "Error getting balance; see log.");
    // });
  }

  // instantiateContract(){
  //   const contract = require('truffle-contract');
  //   const MetaCoin = contract(MetaCoinContract)
  //   MetaCoin.setProvider(web3.currentProvider);
  //
  //   let MetaCoinInstance;
  //
  //   web3.eth.getAccounts((err4, accounts) => {
  //     MetaCoin.deployed().then((instance) => {
  //       MetaCoinInstance = instance;
  //       return MetaCoinInstance.getBalance()
  //     }).then((result) => {
  //       console.log(result);
  //     })
  //   })
  // }

  onNavigatorEvent(event) {
    if (event.id === 'menu') {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true
      });
    }
    if (event.id === 'edit') {
      Alert.alert('NavBar', 'Edit button pressed');
    }
    if (event.id === 'add') {
      Alert.alert('NavBar', 'Add button pressed');
    }
  }

  render() {
    return (
      <View style={{flex: 1, padding: 20}}>
        <TouchableOpacity onPress={ this.onPushPress.bind(this) }>
          <Text style={styles.button}>Push Plain Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ this.getBalance.bind(this) }>
          <Text style={styles.button}>Get Balance</Text>
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={ this.instantiateContract.bind(this) }>*/}
          {/*<Text style={styles.button}>Connect Contract</Text>*/}
        {/*</TouchableOpacity>*/}
      </View>
    );
  }

  onPushPress() {
    this.props.navigator.push({
      title: "More",
      screen: "example.PushedScreen"
    });
  }

  onPushStyledPress() {
    this.props.navigator.push({
      title: "Styled",
      screen: "example.StyledScreen"
    });
  }

  onModalPress() {
    this.props.navigator.showModal({
      title: "Modal",
      screen: "example.ModalScreen"
    });
  }

  onLightBoxPress() {
    this.props.navigator.showLightBox({
      screen: "example.LightBoxScreen",
      style: {
        backgroundBlur: "dark"
      },
      passProps: {
        greeting: 'hey there'
      },
    });
  }

  onInAppNotificationPress() {
    this.props.navigator.showInAppNotification({
      screen: "example.NotificationScreen"
    });
  }

  onStartSingleScreenApp() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'example.FirstTabScreen'
      }
    });
  }
}

const styles = StyleSheet.create({
  button: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    color: 'blue'
  }
});