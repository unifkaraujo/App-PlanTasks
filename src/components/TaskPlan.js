import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'

// Estilização
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import commonStyles from '../commonStyles'
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler'


export default props => {

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right}
                onPress={() => props.onDelete && props.onDelete(props.id)}>
                <FontAwesomeIcon icon="fa-trash" size={20} color='#FFF' />
            </TouchableOpacity>
        )
    }

    return (

        <GestureHandlerRootView>
            <Swipeable 
                renderRightActions={getRightContent}
                onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}> 
                
                <View style={styles.container}>

                    <View>
                        <Text style={[styles.desc]}> {props.desc} </Text>
                    </View>

                </View>

            </Swipeable>
        </GestureHandlerRootView>

    )

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#FFF'
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,  
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    excludeIcon: {
        marginLeft: 10
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    }
})