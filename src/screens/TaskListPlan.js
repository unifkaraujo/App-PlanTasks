import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Platform, Alert, StatusBar } from 'react-native' 

// Componentes
import TaskPlan from '../components/TaskPlan'
import AddTaskPlan from './AddTaskPlan'

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
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

/* Biblioteca de icones do fontawesome, adicionando manualmente a biblioteca, pois referenciando diretamente não estava funcionando */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCreativeCommonsRemix, fab } from '@fortawesome/free-brands-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
library.add(fab, faCheck, faEye, faEyeSlash, faPlus, faTrash, faBars, faSave)
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

// Mensagem personalizada
import Toast from 'react-native-toast-message';

// Banco de dados
import { resetaDatabase, getTasks, toggleTask, addTask, deleteTask, savePlan, criaCampo, imprimeSqlite } from '../data/database';

const initialState = {
    showAddTask: false,
    tasks: [], 
    di: new Date(), 
    showDatePicker: false,
    df: new Date(), 
    showDatePicker2: false
}

export default class TaskListPlan extends Component {

    state = {
        ...initialState,
    }

    componentDidMount = async () => {
        // sempre que o foco mudar para essa aba, atualizo os registros
        this.focusListener = this.props.navigation.addListener('focus', this.atualizaCorBar);
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
    
    addTask = async newTask => {
        
        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }

        const tasks = this.state.tasks
        tasks.push(newTask)
        this.setState({ tasks, showAddTask: false })

    }

    deleteTask = async taskId => {
        let tasks = this.state.tasks
        // aqui remover o item com id tasksid
        console.log('tasks', tasks)
        this.setState(tasks)
    }

    deletaDatabase = () => {
        resetaDatabase()
    }

    savePlan = async () => {


        Alert.alert(
            'Confirmação',
            'Deseja realmente salvar as tasks adicionadas?',
            [
              {
                text: 'Sim',
                onPress: async () => {
                    const diFormated = moment(this.state.di).format('YYYY-MM-DD');
                    const dfFormated = moment(this.state.df).format('YYYY-MM-DD');
                
                    const startDate = moment(diFormated);
                    const endDate = moment(dfFormated);
                    const currentDate = startDate.clone();
                
                    while (currentDate.isSameOrBefore(endDate)) {
                        const currentDateFormatted = currentDate.format('YYYY-MM-DD');
                
                        for (let item of this.state.tasks) {
                            console.log(`Data atual: ${currentDateFormatted}, Descrição atual: ${item.desc}`);
                            await savePlan(currentDateFormatted, item.desc);
                        }
                
                        currentDate.add(1, 'days');
                    }

                    this.setState({tasks:[]})
                    this.showToastAprov();
                }
              },
              { text: 'Não', onPress: () => console.log('A operação foi cancelada') },
            ]
          )

    };

    showToastAprov = () => {
        Toast.show({
          type: 'success',
          text1: 'Tasks registradas com sucesso!',
        });
      }

    getDatePicker = () => {
        
        let datePicker = <DateTimePicker value={this.state.di}
                onChange={(_, di) => this.setState( { di, showDatePicker: false } ) }
                mode='date' 
            />

        const dateString = moment(this.state.di).format('DD/MM/YYYY')      

        if (Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>

                        <Text style={styles.subtitleDate}> 
                            {dateString}
                        </Text>

                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker}
                </View>
            )
        }
        return datePicker 
    }

    getDatePicker2 = () => {
        
        let datePicker = <DateTimePicker value={this.state.df}
                    onChange={(_, df) => this.setState( { df, showDatePicker2: false } ) }
                    mode='date' />

        const dateString = moment(this.state.df).format('DD/MM/YYYY')      

        if (Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ showDatePicker2: true })}>

                        <Text style={styles.subtitleDate}> 
                            {dateString}
                        </Text>

                    </TouchableOpacity>
                    {this.state.showDatePicker2 && datePicker}
                </View>
            )
        }
        return datePicker 
    }

    getImage = () => {
        return weekImage
    }

    getColor = () => {
        return commonStyles.colors.plan
    }

    getTitle = () => {
        return 'Planejamento'
    }

    render() {

        return (

            <View style={styles.container}>

                <AddTaskPlan isVisible={this.state.showAddTask} 
                    onCancel={() => this.setState({ showAddTask: false }) }
                    onSave={this.addTask} />

                <ImageBackground source={this.getImage()}
                    style={styles.background} >
                    
                    <View style={styles.iconBar} >

                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <FontAwesomeIcon icon='fa-bars'
                                size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>

                    </View>
                
                    <View style={styles.titleBar} >
                        <Text style={styles.title}> {this.getTitle()} </Text>
                        <View style={{flexDirection: 'row',}} >
                            <Text style={[styles.subtitleMargin, styles.subtitle]}> De </Text>
                            <TouchableOpacity>
                                {this.getDatePicker()}
                            </TouchableOpacity>
                            <Text style={styles.subtitle}> até </Text>
                            <TouchableOpacity>
                                {this.getDatePicker2()}
                            </TouchableOpacity>
                        </View>
                    </View>
                
                </ImageBackground>

               <View style={styles.taskList}>
                    <FlatList data={this.state.tasks}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({item}) => <TaskPlan {...item} onToggleTask = {this.toggleTask} onDelete = {this.deleteTask} /> }
                    />
               </View>

               <View >

                    <TouchableOpacity style={[styles.addButton, {backgroundColor: this.getColor()}]}
                        activeOpacity={0.7}
                        onPress={() => this.setState( {showAddTask: true} )}>
                        <FontAwesomeIcon icon="fa-plus" size={20} color={commonStyles.colors.secondary} />
                    </TouchableOpacity>
                
                    <TouchableOpacity style={[styles.saveButton, {backgroundColor: this.getColor()}]}
                        activeOpacity={0.7}
                        onPress={() => this.savePlan()}>
                        <FontAwesomeIcon icon="fa-save" size={30} color='white' />
                    </TouchableOpacity>
               
               </View>

               <Toast position='bottom' />

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
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitleMargin: {
        marginLeft: 20,
        marginBottom: 30
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
    },
    subtitleDate: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        color: '#FFB463',
        textDecorationLine: 'underline'
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
        bottom: 90,
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
        alignItems: 'center',
        marginTop: 10
    },
})