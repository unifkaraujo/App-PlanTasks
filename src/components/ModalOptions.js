import React, { Component } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Modal, Text, TouchableOpacity, TextInput, Platform } from 'react-native'

/*import Icons from '@react-native-vector-icons/octicons';*/
import Ionicons from 'react-native-vector-icons/Ionicons'

// Componente baseado em classe
export default class ModalOptions extends Component {
    
    render() {

        return (
            <Modal transparent={true} visible={this.props.visible}
                onRequestClose={this.props.onRequestClose} >

                <TouchableWithoutFeedback 
                    onPress={this.props.onRequestClose}>
                    
                    <View style={styles.closeUp}> 
                    </View>

                </TouchableWithoutFeedback>

                <View style={styles.modal}>

                    <View style={[styles.box, {backgroundColor: this.props.color}]}> 

                        <View style={styles.spaceBox}> 
                            <TouchableOpacity onPress={() => {
                                this.props.onMarcarTodos()}
                            }>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}> 
                                    <Text style={styles.boxText}> Marcar todos </Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                        <View style={styles.spaceBox}> 
                            <TouchableOpacity onPress={() => {
                                this.props.onDesmarcarTodos()}
                            }>
                                <View style={{flexDirection: 'row'}}> 
                                    <Text style={styles.boxText}> Desmarcar todos </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.spaceBox}> 
                            <TouchableOpacity onPress={() => {
                                this.props.onDeletarTodos()}
                            }>
                                <View style={{flexDirection: 'row'}}> 
                                    <Text style={styles.boxText}> Deletar todos </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>

                <TouchableWithoutFeedback 
                    onPress={this.props.onRequestClose}>
                    
                    <View style={styles.closeDown}> 
                    </View>

                </TouchableWithoutFeedback>

            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    closeUp: {
        height: 140
    },
    closeDown: {
        flex: 1
    },
    modal: {
        alignItems: 'flex-end',
        paddingRight: 10,
        paddingTop: 60
    },
    box: {
        alignItems: 'flex-start',
        backgroundColor: '#ECA457',
        borderRadius: 10,
        padding: 5,
    },
    boxText: {
        color: 'white',
        fontSize: 16,
    },
    spaceBox: {
        padding: 5,
        flexDirection: 'row'
    }
})