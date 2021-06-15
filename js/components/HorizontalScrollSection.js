import React, {Component} from 'react';
import {
    ScrollView,
    Image,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';

export default class HorizontalScrollSection extends Component {
    render() {
        const { BUTTONS_ARRAY, onShowObject } = this.props;
        return (
            <ScrollView horizontal={true} style={styles.container}>
                {BUTTONS_ARRAY.map((image, index) => {
                    return <TouchableHighlight key={index}  
                                onPress={() => onShowObject(index, String(image))} 
                                style={styles.buttonStyle}>
                                <Image style={styles.imageStyle} source={image} />
                            </TouchableHighlight>
                })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        width: '100%',
    },
    
    buttonStyle: {
        flex: 1,
        width: 100,
        backgroundColor: '#e1edeb',
        borderColor: '#43bfbb',
        borderRadius: 5,
        borderWidth: 2,
        overflow: 'hidden',
        alignItems: 'center',
        position: 'relative',
    },
    
    imageStyle: {
        flex: 1,
        resizeMode: 'contain',
    }
})