import React, { Component } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Modal, Text, TouchableOpacity, TextInput, Platform } from 'react-native'

// Estilização
import commonStyles from '../commonStyles'

// Data
import moment from 'moment'

const initialState = { desc: '' }

// Componente baseado em classe
export default class AddTaskPlan extends Component {

    state = {
        ...initialState
    }

    save = () => {

        const newTask = {
            desc: this.state.desc,
            id: Math.random()
        }

        this.props.onSave && this.props.onSave(newTask)
        this.setState({ ...initialState })

    }
    
    render() {
        return (
            <Modal transparent={true} visible={this.props.isVisible}
                onRequestClose={this.props.onCancel}>

                <TouchableWithoutFeedback 
                    onPress={this.props.onCancel}>
                    
                    <View style={styles.background}> 
                    </View>

                </TouchableWithoutFeedback>

                <View style={styles.container}> 
                    <Text style={styles.header}> Nova Tarefa </Text>
                    <TextInput style={styles.input} 
                    placeholder='Informe a Descrição...'
                    onChangeText={desc => this.setState( { desc: desc } )}
                    value={this.state.desc}
                    />
                    
                    <View style={styles.buttons}> 

                    <TouchableOpacity onPress={this.props.onCancel}> 
                            <Text style={styles.button}> Cancelar </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.save}> 
                            <Text style={styles.button}> Salvar </Text>
                        </TouchableOpacity>
                    
                    </View>                 
                </View>

                <TouchableWithoutFeedback 
                    onPress={this.props.onCancel}>
                    
                    <View style={styles.background}> 
                    </View>

                </TouchableWithoutFeedback>

            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    container: {
        backgroundColor: '#FFF'
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.plan,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6        
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.plan
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15
    }
})