var express = require('express');
var router = express.Router()

var moment = require('moment');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Opqr!234',
  database : 'teammanager'
});
 

router.get('/researchers', (req, res)=> {
  connection.query('SELECT * FROM researcher', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);

    res.send(results);
  });
});

router.get('/projects', (req, res)=> {
  let year = req.query.year? req.query.year: '';
  let startDate = `${year}-01-01`;
  let endDate = `${year}-12-30`;
  let whereClause = ` WHERE date_of_start between \'${startDate}\'and \'${endDate}\' or date_of_end between \'${startDate}\'and \'${endDate}\' order by date_of_end desc`;

  let sql = `SELECT * FROM project `;

  if(year) {
    sql += whereClause;
  }

  connection.query(sql, function (error, results, fields) {
    if (error) throw error;

    res.send(results);
  });
})

router.post('/projects', (req, res) => {
  let body = req.body? req.body: '';
  let registerSql = '';
  let searchProjectSql = `SELECT * FROM project WHERE number='${body.number?body.number: ''}'`;

  let columns = Object.keys(body);
  let columnString = '';
  let valueString = '';

  columns.forEach((column, index) => {
    if(index) {
      columnString += ', ';
      valueString += ', ';
    }
    columnString += column;
    valueString += `'${body[column]}'`;
  })

  registerSql = `INSERT INTO project (${columnString}) VALUES (${valueString});`

  
  connection.query(searchProjectSql, function (error, results, fields) {
    if(error) {
      res.status(500).send('Internal Server Error');
    };

    if(results.length) {
      res.status(409).send('Aready Exist Project'); 
    } else {
      console.log(registerSql);
      connection.query(registerSql, function (error, results, fields) {
        if(error) {
          res.status(500).send('Internal Server Error');
        };
  
        res.status(201).send('Registered Project');
      })
    }
  })
})

router.get('/projects/:number', (req, res)=> {
  let projectNumber = req.params.number;

  let sql = `SELECT * FROM project WHERE number='${projectNumber}'`;

  console.log(projectNumber);
  console.log(sql);

  connection.query(sql, function (error, results, fields) {
    if (error) throw error;

    res.send(results);
  });
})


function asyncQuery(sql) {
  return new Promise((resolve, reject)=>{
    connection.query(sql, function (error, results, fields) {
      if (error) reject();
  
      resolve(results)
    });
  })
}

async function participationTable() {
  let participationQuery = `SELECT participation_rate.number, name, researcher.id, date_year_month, participation_rate, allocation_rate FROM participation_rate LEFT JOIN researcher ON researcher.id = participation_rate.id`;
  let researcherQuery = 'SELECT * FROM researcher';

  let participations = await asyncQuery(participationQuery);
  let researchers = await asyncQuery(researcherQuery);

  let separationDataByProjects = {};

  participations.forEach(participation => {
    if(!separationDataByProjects[participation.number]) {
      separationDataByProjects[participation.number] = [];
    }

    separationDataByProjects[participation.number].push(participation);      
  })

  // Object.keys(separationDataByProjects).forEach(projectNumber => {
  //   researchers.forEach(researcher => {
  //     let storeData = { name: researcher.name };
  //     separationDataByProjects[projectNumber].forEach(participation => {
  //       if(researcher.id === participation.id) {
  //         storeData[participation.date_year_month] = participation.participation_rate;
  //       }
  //     })
  //     resultData.push(storeData);
  //   });
  // })

  // researchers.forEach(researcher => {
  //   let storeData = { name: researcher.name };
  //   separationDataByProjects.forEach(participation => {
  //     if(researcher.id === participation.id) {
  //       storeData[participation.date_year_month] = participation.participation_rate;
  //     }
  //   })
  //   resultData.push(storeData);
  // });

  console.log(separationDataByProjects);
  return separationDataByProjects;
}


router.get('/participations', (req, res)=> {
  let sql = `SELECT participation_rate.number, name, researcher.id, date_year_month, participation_rate FROM participation_rate LEFT JOIN researcher ON researcher.id = participation_rate.id`;
  connection.query(sql, function (error, results, fields) {
    if (error) throw Error;
    console.log('The solution is: ', results);
    
    res.send(results);
  });
})


router.post('/participations', (req, res) => {
  const columns = ['number', 'id', 'date_year_month', 'participation_rate'];
  let body = req.body;
  let insertSql = [];
  let updateSql = [];

  body.forEach((dataSet, inputIndex) => {
    let dataString = '';

    columns.forEach((column, columnIndex) => {
      if(columnIndex) { dataString += ', '; }
      dataString += `'${dataSet[column]}'`;
    });
    insertSql.push(`INSERT INTO participation_rate (number, id, date_year_month, participation_rate) VALUES (${dataString})`);
    updateSql.push(`UPDATE participation_rate SET participation_rate='${dataSet['participation_rate']}' WHERE number='${dataSet['number']}' AND id='${dataSet['id']}' AND date_year_month='${dataSet['date_year_month']}'`);
  })
  
  async function multipleQuery(updateSql, insertSql) {
    let returnValue = {
      inserted: 0,
      updated: 0
    }
    for(let index = 0; index < body.length; index++) {
      let updateResult = await asyncQuery(updateSql[index]);

      if(!updateResult.affectedRows) {
        let insertResult = await asyncQuery(insertSql[index]);
        
        if(insertResult.affectedRows) {
          returnValue.inserted += 1;
        }
      } else {
        returnValue.updated += 1;
      }
    }
    
    return returnValue;
  }

  multipleQuery(updateSql, insertSql)
  .then(result => {
    res.send(result);
  })
})

module.exports = router;