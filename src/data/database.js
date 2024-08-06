// Banco de dados
import SQLite from 'react-native-sqlite-storage';

// Data
import moment from 'moment'
import 'moment/locale/pt-br'


const db = SQLite.openDatabase(
  {
    name: 'tasks.db',
    location: 'default',
  },
  () => {
    console.log('Database opened');
  },
  error => {
    console.log('Error opening database: ', error);
  }
);


export const initializeDatabase = () => {
  db.transaction(tx => {
    
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
        sequencia INTEGER PRIMARY KEY AUTOINCREMENT,
        dataestimada date,
        datafim date,
        descricao varchar(100),
        obs varchar(200)
      );`
    );

    /*tx.executeSql(
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        item TEXT,
        quantity INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );`
    );*/
  });
};


export const testeSqlite = () => {

  let data = new Date()
  data = moment().format('YYYY-MM-DD')

  db.transaction(tx => {
      tx.executeSql(
          'INSERT INTO tasks (descricao, dataestimada, datafim) VALUES (?, ?, ?)',
          ['teste', data, data],
          (tx, results) => {
              console.log('User inserted successfully');
          },
          error => {
              console.log('Error inserting user: ', error);
          }
      );
  });

}

// usando promise para podermos usar o await (primeiro vai tentar resolver a promise e somente depois continuar o código)
export const getTasks = (dataAtual) => {

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks where dataestimada = ?',
        [dataAtual],
        (tx, results) => {
          let tasks = [];
          for (let i = 0; i < results.rows.length; i++) {
            const data = results.rows.item(i)
            tasks.push({
              id: data.sequencia,
              doneAt: data.datafim || null,
              desc: data.descricao,
              estimateAt: data.dataestimada,
              obs: data.obs
            })
          }
          resolve(tasks);
        },
        error => {
          reject(error);
        }
      )
    })
  })
}

export const getOpenTasks = () => {

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks where datafim is null',
        [],
        (tx, results) => {
          let tasks = [];
          for (let i = 0; i < results.rows.length; i++) {
            const data = results.rows.item(i)
            tasks.push({
              id: data.sequencia,
              doneAt: data.datafim || null,
              desc: data.descricao,
              estimateAt: data.dataestimada,
              obs: data.obs
            })
          }
          resolve(tasks);
        },
        error => {
          reject(error);
        }
      )
    })
  })
}

export const updateObs = (id, obs) => {

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'update tasks set obs = ? where sequencia = ?',
        [obs, id],
        (tx, results) => {
          resolve();
        },
        error => {
          reject(error);
        }
      )
    })
  })
}

export const toggleTask = (taskId, doneAt) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE TASKS SET DATAFIM = ? where sequencia = ?',
        [doneAt, taskId],
        (tx, results) => {
          resolve();
        },
        error => {
          reject(error);
        }
      )
    })
  })
}

export const addTask = (desc, estimateAt) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO TASKS (DESCRICAO, DATAESTIMADA) VALUES (?, ?)',
        [desc, estimateAt],
        (tx, results) => {
          resolve();
        },
        error => {
          reject(error);
        }
      )
    })
  })
}

export const deleteTask = (taskId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM TASKS WHERE SEQUENCIA = ?',
        [taskId],
        (tx, results) => {
          resolve();
        },
        error => {
          reject(error);
        }
      )
    })
  })
}

export const savePlan = (date, task) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'insert into tasks (descricao, dataestimada) values (?, ?)',
        [task, date],
        (tx, results) => {
          resolve();
        },
        error => {
          reject(error);
        }
      )
    })
  })
}

export const imprimeSqlite = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM tasks',
      [],
      (tx, results) => {
        let tasks = [];
        for (let i = 0; i < results.rows.length; i++) {
          tasks.push(results.rows.item(i));
        }
        console.log(tasks);
      },
      error => {
        console.log('Error fetching users: ', error);
      }
    );
  });
};


export const resetaDatabase = () => {

  db.transaction(tx => {
      tx.executeSql(
          'delete from tasks'
      );
  });

}

export const dropDatabase = () => {

  db.transaction(tx => {
      tx.executeSql(
          'drop table tasks'
      );
  });

}

export const criaCampo = () => {

  db.transaction(tx => {
      tx.executeSql(
          'alter table tasks add obs varchar(200)'
      );
  });

}

export default db;
