import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, TextInput } from 'react-native'

// Estilização
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import commonStyles from '../commonStyles'
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler'

// Data
import moment from 'moment'
import 'moment/locale/pt-br'
import { updateObs } from '../data/database';


export default props => {

    const [selectedItem, setSelectedItem] = React.useState(props.obs);

    const doneOrNotStyle = props.doneAt != null ?
        { textDecorationLine: 'line-through' } : {}

    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right}
                onPress={() => props.onDelete && props.onDelete(props.id)}>
                <FontAwesomeIcon icon="fa-trash" size={20} color='#FFF' />
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return (
            <View style={styles.left}> 
                 <FontAwesomeIcon icon="fa-trash" size={20} color='#FFF' style={styles.excludeIcon}/>
                 <Text style={styles.excludeText}> Excluir </Text>
            </View>
        )
    }

    const changeObs = (desc) => {
        setSelectedItem(desc)
        updateObs(props.id, desc)
    }

    return (

        <GestureHandlerRootView>
            <Swipeable 
                renderRightActions={getRightContent}
                renderLeftActions={getLeftContent}
                onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}> 
                

                <View style={styles.container}>

                    <TouchableWithoutFeedback 
                        onPress={() => props.onToggleTask(props.id, props.doneAt)}>
                        <View style={styles.checkContainer}> 
                            {getCheckView(props.doneAt)}
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={{flex: 1}}>
                        <Text style={[styles.desc, doneOrNotStyle]}> {props.desc} </Text>
                        <Text style={styles.date}> {formattedDate} </Text>
                    </View>

                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <TextInput 
                        placeholder='Observação'
                        placeholderTextColor={'#B5B5B5'}
                        onChangeText={desc => changeObs(desc) }
                        value={selectedItem}
                        />
                    </View>

                </View>

            </Swipeable>
        </GestureHandlerRootView>

    )

}

function getCheckView(doneAt) {

    if(doneAt) {
        return (
            <View style={styles.done}>
                <FontAwesomeIcon icon="fa-check" size={20} color='#FFF' />
            </View>
        )
    } else {
        return (
            <View style={styles.pending}></View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#FFF'
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555',
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center'
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
    },
})