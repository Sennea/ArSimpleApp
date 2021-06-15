import React from 'react';

import {
    ViroARScene,
    ViroAmbientLight,
    ViroNode,
    ViroQuad,
    ViroSpotLight,
    Viro3DObject,
} from 'react-viro';
import { DEFAULT_OBJECT_POSITION, AR_SCENE_REFERENCE, EXISTING_PLANE_EXTENT_RESULT, FEATURE_POINT_RESULT } from './Constants';
const createReactClass = require('create-react-class');
import TimerMixin from 'react-timer-mixin';

const MainScene = createReactClass({
    mixins: [TimerMixin],

    getInitialState: function() {
    return {
        objPosition: [0,0,0],
        scale: this.props.arSceneNavigator.viroAppProps.objectScale,
        rotation:[0,0,0],
        shouldBillboard : true,
    }
    },

    render: function() {
    return (
        <ViroARScene ref={AR_SCENE_REFERENCE} onTrackingInitialized={this.onTrackInit}>
            <ViroAmbientLight color="#ffffff" intensity={200}/>
            {this.getModel()}
        </ViroARScene>
    );
    },

    getModel() {
        const { displayObject, displayObjectName, objectSource, objectMaterial, objectScale } = this.props.arSceneNavigator.viroAppProps;
        const { shouldBillboard, objPosition, rotation } = this.state;

        const modelArray = [];
        if(!displayObject || displayObjectName === undefined) {
            return;
    }
    let transformBehaviors = {};
    if (shouldBillboard) {
        transformBehaviors.transformBehaviors = shouldBillboard ? "billboardY" : [];
    }

    modelArray.push(
    <ViroNode
        {...transformBehaviors}
        visible={displayObject}
        position={objPosition}
        onDrag={()=>{}}
        ref={this.setARNodeRef}
        scale={objectScale}
        rotation={rotation}
        dragType="FixedToWorld" 
        key={displayObjectName}
        >

        <ViroSpotLight
            innerAngle={5}
            outerAngle={20}
            direction={[0,-1,0]}
            position={[0, 4, 0]}
            color="#ffffff"
            castsShadow={true}
            shadowNearZ={.1}
            shadowFarZ={6}
            shadowMapSize={2048}
            shadowOpacity={.9}
            ref={this.setSpotLightRef}
        />

        <Viro3DObject
            position={[0, 0, 0]}
            source={objectSource}
            type = "OBJ" 
            resources = {objectMaterial} 
            onLoadEnd={this.onLoadEnd} 
            onLoadStart={this.onLoadStart}
            onRotate={this.onRotate}
            onPinch={this.onPinch} 
        />
        <ViroQuad
            rotation={[-90, 0, 0]}
            position={[0, -.001, 0]}
            width={2.5} height={2.5}
            arShadowReceiver={true}
            ignoreEventHandling={true} 
        />

    </ViroNode>
    );
    return modelArray;
    },

    setARNodeRef(component) {
    this.arNodeRef = component;
    },

    setSpotLightRef(component) {
    this.spotLight = component;
    },

    onTrackInit() {
    this.props.arSceneNavigator.viroAppProps.onTrackingInit();
    },

    onRotate(rotateState, rotationFactor, source) {
        const { rotation } = this.state;
        if(rotateState == 3) {
            this.setState({
                rotation : [rotation[0], rotation[1] + rotationFactor, rotation[2]]
            })
            return;
        }

        this.arNodeRef.setNativeProps({rotation:[rotation[0], rotation[1] + rotationFactor, rotation[2]]})
    },

    onPinch(pinchState, scaleFactor, source) {
    const newScale = this.state.scale.map((x)=>{return x * scaleFactor})

    if (pinchState == 3) {
        this.setState({
            scale : newScale
        });
        return;
    }

    this.arNodeRef.setNativeProps({scale:newScale});
    this.spotLight.setNativeProps({shadowFarZ: 6 * newScale[0]});
    },

    onLoadStart() {
    this.setState({
        shouldBillboard : true,
    });
    this.props.arSceneNavigator.viroAppProps.onLoadStart();
    },
    onLoadEnd() {
        this.refs[AR_SCENE_REFERENCE].getCameraOrientationAsync().then((orientation) => {
        this.refs[AR_SCENE_REFERENCE].performARHitTestWithRay(orientation.forward).then((results)=>{
            this.onArHitTestResults(orientation.position, orientation.forward, results);
        })
        });
    this.props.arSceneNavigator.viroAppProps.onLoadEnd();
    },

    onArHitTestResults(position, forward, results) {
    let newPosition = [forward[0] * DEFAULT_OBJECT_POSITION, forward[1]* DEFAULT_OBJECT_POSITION, forward[2]* DEFAULT_OBJECT_POSITION];
    let hitResultPosition = undefined;

    if (results.length > 0) {
        for (const i = 0; i < results.length; i++) {
        let result = results[i];
        if (result.type == EXISTING_PLANE_EXTENT_RESULT) {
            const distance = this.calculateDistance(result.transform.position[0], position[0]); 
                if(distance > .2 && distance < 10) {
            hitResultPosition = result.transform.position;
            break;
            }
        } else if (result.type == FEATURE_POINT_RESULT && !hitResultPosition) {
            const distance = this.calculateDistance(position, result.transform.position);
            if (distance > .2  && distance < 10) {
            hitResultPosition = result.transform.position;
            }
        }}
    }
    if (hitResultPosition) {
        newPosition = hitResultPosition;
    }
    this.setInitialPlacement(newPosition);
    },

    setInitialPlacement(position) {
        this.setState({
            objPosition: position,
        });
        this.setTimeout(() =>{this.updateInitialRotation()}, 200);
    },

    updateInitialRotation() {
    this.arNodeRef.getTransformAsync().then((retDict)=>{
        let rotation = retDict.rotation;
        let yRotation = (rotation[1]);

        if (Math.abs(rotation[0]) > 1 && Math.abs(rotation[2]) > 1) {
            yRotation = 180 - (yRotation);
        }

        this.setState({
            rotation : [0,yRotation,0],
            shouldBillboard : false,
        });
        });
    },

    calculateDistance(vectorOne, vectorTwo) {
    const distance = Math.sqrt(
        Math.pow(vectorOne[0] - vectorTwo[0],2) +
        Math.pow(vectorOne[1] - vectorTwo[1],2) +
        Math.pow(vectorOne[2] - vectorTwo[2],2));
    return distance;
    }
});

module.exports = MainScene;
