import { StyleSheet } from 'react-native'

export var styles = StyleSheet.create({
    outer: {
        flex: 1,
    },
    
    arView: {
        flex: 1,
    },
    
    buttons: {
        height: 90,
        width: 80,
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#000000',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff00',
    },

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
});