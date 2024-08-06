import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, StatusBar } from 'react-native';

// Navegação
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

// Componentes
import Auth from './screens/Auth';
import TaskList from './screens/TaskList';
import AuthOrApp from './screens/AuthOrApp';
import TaskListPlan from './screens/TaskListPlan';

// Estilização
import commonStyles from './commonStyles'
import { Gravatar } from 'react-native-gravatar';
import Ionicons from 'react-native-vector-icons/Ionicons'

// Banco de dados e AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeDatabase } from './data/database';

// Data
import moment from 'moment'
import 'moment/locale/pt-br'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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

const TodayComponent = props => <TaskList title='Hoje' daysAhead={0} {...props} />;
const TomorrowComponent = props => <TaskList title='Amanhã' daysAhead={1} {...props} />;
const Day3Component = props => <TaskList title='Dia 3' daysAhead={2} {...props} />;
const Day4Component = props => <TaskList title='Dia 4' daysAhead={3} {...props} />;
const Day5Component = props => <TaskList title='Dia 5' daysAhead={4} {...props} />;
const OpenTasksComponent = props => <TaskList title='OpenTasks' daysAhead={30} {...props} />;

const menuRoutes = {
  Plan: {
    name: 'Plan',
    component: TaskListPlan,
    options: {
      title: 'Planejamento'
    }
  },
  Today: {
    name: 'Today',
    component: TodayComponent,
    options: {
      title: 'Hoje'
    }
  },
  Tomorrow: {
    name: 'Tomorrow',
    component: TomorrowComponent,
    options: {
      title: 'Amanhã'
    }
  },
  Day3: {
    name: 'Day3',
    component: Day3Component,
    options: {
      title: 'Dia 3'
    }
  },
  Day4: {
    name: 'Day4',
    component: Day4Component,
    options: {
      title: 'Dia 4'
    }
  },
  Day5: {
    name: 'Day5',
    component: Day5Component,
    options: {
      title: 'Dia 5'
    }
  },
  OpenTasks: {
    name: 'OpenTasks',
    component: OpenTasksComponent,
    options: {
      title: 'OpenTasks'
    }
  }
}

const HomeScreen = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="Today" 
      screenOptions={{ 
        headerShown: false,
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen {...menuRoutes.Plan} />
      <Drawer.Screen {...menuRoutes.Today} />
      <Drawer.Screen {...menuRoutes.Tomorrow} />
      <Drawer.Screen {...menuRoutes.Day3} />
      <Drawer.Screen {...menuRoutes.Day4} />
      <Drawer.Screen {...menuRoutes.Day5} />
      <Drawer.Screen {...menuRoutes.OpenTasks} />
    </Drawer.Navigator>
  );
};
const CustomDrawerContent = (props) => {

  const logout = () => {
    alert('Funcionalidade não disponível nessa versão')
    /*
    AsyncStorage.removeItem('userData')
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'AuthOrApp' }],
    });*/
  }

  const [selectedItem, setSelectedItem] = React.useState('Today');

  const retornaCorSel = () => {

    if (selectedItem === 'Plan') {
      return commonStyles.colors.plan
    } 
    if (selectedItem === 'Today') {
      return commonStyles.colors.today
    }
    if (selectedItem === 'OpenTasks') {
      return commonStyles.colors.month
    } 
    else {
      return commonStyles.colors.others
    }
    
  }

  return (
    <DrawerContentScrollView {...props} style={{marginTop: -4}}>
      <View style={[styles.drawerHeader, {backgroundColor: retornaCorSel()}]}>
        <Gravatar style={styles.avatar} options={{ parameters: { size: '100', d: 'mm' }, secure: true }} />
        <Text style={styles.drawerHeaderText}> Anônimo </Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name='exit' size={30} color='white' style={{marginTop: 1}}/>
        </TouchableOpacity>
      </View>
      <DrawerItem
        label="Planejamento"
        onPress={() => {
          setSelectedItem('Plan');
          props.navigation.navigate('Plan');
        }}
        labelStyle={{ fontSize: 17, fontWeight: selectedItem === 'Plan' ? 'bold' : 'normal', color: selectedItem === 'Plan' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
      <DrawerItem
        label={`Hoje - ${retornaDataFormatada(0).data}`}
        onPress={() => {
          setSelectedItem('Today');
          props.navigation.navigate('Today');
        }}
        labelStyle={{ fontSize: 17, fontWeight: selectedItem === 'Today' ? 'bold' : 'normal', color: selectedItem === 'Today' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
      <DrawerItem
        label={`Amanhã - ${retornaDataFormatada(1).data}`}
        onPress={() => {
          setSelectedItem('Tomorrow');
          props.navigation.navigate('Tomorrow');
        }}
        labelStyle={{ fontSize: 17, fontWeight: selectedItem === 'Tomorrow' ? 'bold' : 'normal', color: selectedItem === 'Tomorrow' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
      <DrawerItem
        label={`${retornaDataFormatada(2).diaSemana} - ${retornaDataFormatada(2).data}`}
        onPress={() => {
          setSelectedItem('Day3');
          props.navigation.navigate('Day3');
        }}
        labelStyle={{ fontSize: 17, fontWeight: selectedItem === 'Day3' ? 'bold' : 'normal', color: selectedItem === 'Day3' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
      <DrawerItem
        label={`${retornaDataFormatada(3).diaSemana} - ${retornaDataFormatada(3).data}`}
        onPress={() => {
          setSelectedItem('Day4');
          props.navigation.navigate('Day4');
        }}
        labelStyle={{ fontSize: 17, fontWeight: selectedItem === 'Day4' ? 'bold' : 'normal', color: selectedItem === 'Day4' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
      <DrawerItem
        label={`${retornaDataFormatada(4).diaSemana} - ${retornaDataFormatada(4).data}`}
        onPress={() => {
          setSelectedItem('Day5');
          props.navigation.navigate('Day5');
        }}
        labelStyle={{ fontSize: 17, fontWeight: selectedItem === 'Day5' ? 'bold' : 'normal', color: selectedItem === 'Day5' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
      <DrawerItem
        label="Tasks em aberto"
        onPress={() => {
          setSelectedItem('OpenTasks');
          props.navigation.navigate('OpenTasks');
        }}
        labelStyle={{ fontSize: 17, fontWeight: selectedItem === 'OpenTasks' ? 'bold' : 'normal', color: selectedItem === 'OpenTasks' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
    </DrawerContentScrollView>
  );
};

const mainRoutes = {
  AuthOrApp: {
    name: 'AuthOrApp',
    component: AuthOrApp
  },
  Auth: {
    name: 'Auth',
    component: Auth
  },
  Home: {
    name: 'Home',
    component: HomeScreen
  }
}

const App = () => {

  // Assim que o componente é criado, inicializamos o banco de dados
  useEffect(() => {
    initializeDatabase();

    // Define a cor da barra de status
    StatusBar.setBackgroundColor('#C9742E');
    StatusBar.setBarStyle('light-content');

  }, []);

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        {/* inicial é AuthOrApp} - voltar */}
        <Stack.Screen {...mainRoutes.AuthOrApp} /> 
        <Stack.Screen {...mainRoutes.Auth} />
        <Stack.Screen {...mainRoutes.Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  drawerHeader: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 1
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

});
