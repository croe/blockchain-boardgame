// import { default as Web3 } from 'web3';
//
// import React, { Component } from 'react';
// import { Text, View } from 'react-native';
// import { Navigation } from 'react-native-navigation';
//
// class Welcome extends Component {
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>
//           Welcome to React Native!
//         </Text>
//       </View>
//     )
//   }
// }
//
// function registerScreens() {
//   Navigation.registerComponent('example.WelcomeTabScreen', () => Welcome);
// }
// registerScreens();
//
// Navigation.startTabBasedApp({
//   tabs: [
//     {
//       label: 'Welcome',
//       screen: 'example.WelcomeTabScreen',
//       title: 'Welcome'
//     },
//   ]
// });

import {
  Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';

// screen related book keeping
import {registerScreens} from './screens';
registerScreens();


const createTabs = () => {
  let tabs = [
    {
      label: 'One',
      screen: 'example.FirstTabScreen',
      title: 'Screen One'
    },
    {
      label: 'Two',
      screen: 'example.SecondTabScreen',
      title: 'Screen Two',
      navigatorStyle: {
        tabBarBackgroundColor: '#3b5998',
      }
    },
    {
      label: 'Third',
      screen: 'example.ThirdTabScreen',
      title: 'Screen Third',
      navigatorStyle: {
        tabBarBackgroundColor: '#3b5998',
      }
    }
  ];
  if (Platform.OS === 'android') {
    tabs.push({
      label: 'Collapsing',
      screen: 'example.CollapsingTopBarScreen',
      title: 'Collapsing',
    });
  }
  return tabs;
};
// this will start our app
Navigation.startTabBasedApp({
  tabs: createTabs()
});