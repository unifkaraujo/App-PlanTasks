import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Platform, Alert, StatusBar } from 'react-native' 

// Componentes
import Task from '../components/Task'
import AddTask from './AddTask'
import ModalOptions from '../components/ModalOptions'

// Estilização
import todayImage from '../../assets/assets/imgs/today.jpg'
import tomorrowImage from '../../assets/assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/assets/imgs/week.jpg'
import monthImage from '../../assets/assets/imgs/month.jpg'
import commonStyles from '../commonStyles'

// API + AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

// Data
import moment from 'moment'
import 'moment/locale/pt-br'

/* Biblioteca de icones do fontawesome, adicionando manualmente a biblioteca, pois referenciando diretamente não estava funcionando */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCreativeCommonsRemix, fab } from '@fortawesome/free-brands-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
library.add(fab, faCheck, faEye, faEyeSlash, faPlus, faTrash, faBars)
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Mensagem de erro padronizada
import { showError } from '../common'

// Banco de dados
import { resetaDatabase, getTasks, getOpenTasks, toggleTask, addTask, deleteTask, imprimeSqlite, dropDatabase, criaCampo } from '../data/database';

const initialState = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: [],
    showOptions: false
}

const retornaDataFormatada = (addData) => {
    data = moment().add(addData, 'days')
    let diaSemana = data.format('dddd')
  
    // Remover a palavra "feira" se estiver presente
    if (diaSemana.includes('-feira')) {
      diaSemana = diaSemana.replace('-feira', '').trim();
    }
  
    diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)
  
    return {
      data: data.format('DD/MM/YYYY'),
      diaSemana: diaSemana
    };
  }

export default class TaskList extends Component {

    state = {
        ...initialState
    }

    componentDidMount = async () => {
        // Recuperando algumas variaveis de estado armazenadas no AsyncStorage (localmente)
        const stateString = await AsyncStorage.getItem('tasksState')
        const savedState = JSON.parse(stateString) || initialState
        this.setState({
            showDoneTasks: savedState.showDoneTask
        }, this.filterTasks)

        this.loadTasks()

        // sempre que o foco mudar para essa aba, atualizo os registros
        this.focusListener = this.props.navigation.addListener('focus', this.loadTasks);

    }

    componentWillUnmount() {

        // Liberando espaço dos eventos
        if (this.focusListener) {
          this.focusListener();
        }

    }

    atualizaCorBar = async() => {
        // atualizo a cor da barra superior
        // Define a cor da barra de status
        StatusBar.setBackgroundColor(this.getColor());
        StatusBar.setBarStyle('light-content');
    }
    
    
    loadTasks = async() => {

        this.atualizaCorBar()

        const maxDate = 
            moment()
            .add({ days: this.props.daysAhead })
            .format('YYYY-MM-DD')

        try {

            var tasks
            if (this.props.daysAhead == 30) {
                tasks = await getOpenTasks(maxDate);
            } else {
                tasks = await getTasks(maxDate);
            }
    
            this.setState({ tasks }, this.filterTasks)
        } catch (error) {
            console.error('Error loading tasks: ', error);
        }

    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }

    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({ visibleTasks })

        // Armazenando apenas a variavel de estados que exibe/oculta as tasks finalizadas
        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }

    toggleTask = async (taskId, doneAt) => {
        try {
            doneAt = doneAt ? null : moment().format('YYYY-MM-DD')
            await toggleTask(taskId, doneAt)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
    }

    addTask = async newTask => {

        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }

       try {
        // Formatando a data que sera salva na task para : YYYY-MM-DD        
        const formattedDate = moment(newTask.date).format('YYYY-MM-DD') 

        await addTask(newTask.desc, formattedDate)
        this.setState({ showAddTask: false }, this.loadTasks)
       } catch(e) {
            showError(e)
       }
    }

    deleteTask = async taskId => {
        try {
            await deleteTask(taskId)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
    }

    deletarTodos = async () => {

        for (let item of this.state.visibleTasks) {

            try {
                await deleteTask(item.id)
                this.loadTasks()
            } catch(e) {
                showError(e)
            }
           
        }

    }

    marcarTodos = async (option) => {

        for (let item of this.state.visibleTasks) {

            if (!item.doneAt && option=='T') {
                const doneAt = moment().format('YYYY-MM-DD')
                try {
                    await toggleTask(item.id, doneAt)
                    this.loadTasks()
                } catch(e) {
                    showError(e)
                }
            } else if (item.doneAt && option=='F') {
                const doneAt = null
                try {
                    await toggleTask(item.id, doneAt)
                    this.loadTasks()
                } catch(e) {
                    showError(e)
                }
            }
           
        }

    }

    getImage = () => {
        switch(this.props.daysAhead) {
            case 0: return tomorrowImage
            case 30: return monthImage
            default: return todayImage
        }
    }

    getColor = () => {
        switch(this.props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 30: return commonStyles.colors.month
            default: return commonStyles.colors.others
        }
    }

    getTitle = () => {
        if (this.props.daysAhead == 30) {
            return 'Em aberto'
        } else {
            return retornaDataFormatada(this.props.daysAhead).diaSemana
        }
        
        /*
        switch(this.props.daysAhead) {
            case 0: return 'Hoje'
            case 1: return 'Amanhã'
            case 7: return 'Semana'
            default: return 'Mês'
        }*/
    }

    render() {

        var today = ''
        if (this.props.daysAhead == 30) {
            today = ''
        } else {
            today = moment().add({days: this.props.daysAhead}).locale('pt-br').format('ddd, D [de] MMMM')
        }

        return (

            <View style={styles.container}>

                <AddTask isVisible={this.state.showAddTask} 
                    onCancel={() => this.setState({ showAddTask: false }) }
                    onSave={this.addTask} 
                    color={ this.getColor() }
                    />
                
                <ModalOptions transparent={true} 
                    visible={this.state.showOptions}
                    onRequestClose={() => this.setState({ showOptions: false }) } 
                    onMarcarTodos={() => this.marcarTodos('T') } 
                    onDesmarcarTodos={() => this.marcarTodos('F') } 
                    onDeletarTodos={() => this.deletarTodos() }
                    color={ this.getColor() }
                />

                <ImageBackground source={this.getImage()}
                    style={styles.background} >
                    
                    <View style={styles.iconBar} >

                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <FontAwesomeIcon icon='fa-bars'
                                size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.toggleFilter}>
                            <FontAwesomeIcon icon={this.state.showDoneTasks ? 'fa-eye' : 'fa-eye-slash'} 
                                size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                
                    <View style={styles.titleBar} >
                        <Text style={styles.title}> {this.getTitle()} </Text>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: 15}}>
                        
                            <Text style={styles.subtitle}> {today} </Text>
                            <View style={{flexDirection: 'row'}}> 

                                <View > 
                                    <TouchableOpacity style={[]}
                                        activeOpacity={0.7}
                                        onPress={() => this.setState( {showOptions: !this.state.showOptions} )}>
                                        <Ionicons name="ellipsis-vertical" size={30} color='white' />
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>
                    </View>

                </ImageBackground>

               <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks}
                        keyExtractor={item => item.id.toString()}
                        // desestrutura o item (que é o elemento que armazena individualmente os valores do array)
                        // passa o spread de cada item para criar uma Task
                        // o spread serve para enviar todos os parametros de uma vez só 
                        renderItem={({item}) => <Task {...item} onToggleTask = {this.toggleTask} onDelete = {this.deleteTask} /> }
                    />
               </View>

               <View >

                    <TouchableOpacity style={[styles.addButton, {backgroundColor: this.getColor()}]}
                        activeOpacity={0.7}
                        onPress={() => this.setState( {showAddTask: true} )}>
                        <FontAwesomeIcon icon="fa-plus" size={20} color={commonStyles.colors.secondary} />
                    </TouchableOpacity>
               
               </View>

            </View>

        )

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        height: 220
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center' 
    },
    saveButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center' 
    }
})