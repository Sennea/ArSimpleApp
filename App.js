import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
} from 'react-native';

import {
  ViroARSceneNavigator
} from 'react-viro';
import HorizontalScrollSection from './js/components/HorizontalScrollSection';

var InitialARScene = require('./js/MainScene');

import {BUTTONS_ARRAY, OBJECT_ARRAY} from './Constants'
import { styles } from './styles';

export default class ViroSample extends Component {
  constructor() {
    super();

    this.onShowObject = this.onShowObject.bind(this);
    this.renderTrackingText = this.renderTrackingText.bind(this);
    this.onTrackingInit = this.onTrackingInit.bind(this);
    this.onLoadStart = this.onLoadStart.bind(this);
    this.onLoadEnd = this.onLoadEnd.bind(this);

    this.state = {
      viroAppProps: {
        displayObject:false, 
        objectSource:OBJECT_ARRAY[0].src, 
        objectScale:OBJECT_ARRAY[0].scale, 
        objectMaterial:OBJECT_ARRAY[0].material, 
        onLoadEnd: this.onLoadEnd, 
        onLoadStart: this.onLoadStart, 
        onTrackingInit:this.onTrackingInit},
      trackingInitialized: false,
      isLoading: false,
    }
  }

  render() {
    return (
      <View style={styles.outer} >
        <ViroARSceneNavigator style={styles.arView}
          initialScene={{scene:InitialARScene, passProps:{displayObject:this.state.displayObject}}}  viroAppProps={this.state.viroAppProps}
        />
        {this.renderTrackingText()}
        {this.state.isLoading &&
          <View style={{position:'absolute', left:0, right:0, top:0, bottom:0, alignItems: 'center', justifyContent:'center'}}>
            <ActivityIndicator size='large' animating={this.state.isLoading} color='#ffffff'/>
          </View>
        }

        <View style={{position: 'absolute',  left: 0, right: 0, bottom: 50, alignItems: 'center'}}>
        <HorizontalScrollSection 
          onShowObject={this.onShowObject}
          BUTTONS_ARRAY={BUTTONS_ARRAY}
        />
        </View>
      </View>
    );
  }

  
onLoadStart() {
  this.setState({
      isLoading: true,
  });
}

onLoadEnd() {
  this.setState({
      isLoading: false,
  });
}

renderTrackingText() {
  if(this.state.trackingInitialized) {
      return (<View style={{position: 'absolute', backgroundColor:"#ffffff22", left: 30, right: 30, top: 30, alignItems: 'center'}}>
      <Text style={{fontSize:12, color:"#ffffff"}}>Tracking initialized.</Text>
      </View>);
  } else {
  return (<View style={{position: 'absolute', backgroundColor:"#ffffff22", left: 30, right: 30, top:30, alignItems: 'center'}}>
      <Text style={{fontSize:12, color:"#ffffff"}}>Waiting for tracking to initialize.</Text>
      </View>);
  }
}

onTrackingInit() {
  this.setState({
      trackingInitialized: true,
  });
}

onShowObject(index, objectName) {
  this.setState({
      viroAppProps:{
          ...this.state.viroAppProps, 
          displayObject: true, 
          displayObjectName: objectName, 
          objectSource:OBJECT_ARRAY[index].src,
          objectScale:OBJECT_ARRAY[index].scale,
          objectMaterial:OBJECT_ARRAY[index].material},
  });
}
}

module.exports = ViroSample
