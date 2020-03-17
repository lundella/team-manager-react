import React, { Component } from 'react';
import 'tui-grid/dist/tui-grid.css';
import axios from 'axios';
import moment from 'moment';

import Grid from '@toast-ui/react-grid';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/fontawesome-free-solid'


class CustomTextEditor {
  constructor(props) {
    const el = document.createElement('input');
    const { maxLength } = props.columnInfo.editor.options;

    el.type = 'text';
    el.maxLength = maxLength;
    el.value = String(props.value);

    this.el = el;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.el.value;
  }

  mounted() {
    this.el.select();
  }
}

export default class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      changeData: [],
      totalBudget: 0,
      totalParticipation: [],
      thisYear: moment().year(),
      projectDataName: {
        name: "과제명",
        number: "계정번호",
        manager: "과제책임자",
        nickname: "별칭",
        number_of_years: "연차",
        date_of_start: "과제시작일",
        date_of_end: "과제종료일",
        payroll_of_regular: "인건비_예산(정)",
        payroll_of_regular_consume: "인건비_흡수(정)",
        payroll_of_regular_balance: "인건비_잔액(정)",
        payroll_of_irregular: "인건비_예산(위촉)",
        payroll_of_irregular_consume: "인건비_흡수(위촉)",
        payroll_of_irregular_balance: "인건비_잔액(위촉)",
        overhead_costs: "간접비",
        type: "타입",
        participation_limit: "참여율"
      },
      projectsData: [],
      projectColumns: [{
        header: '',
        name: 'column'
      }, {
        header: '',
        name: 'value'
      }],
      gridColumnNames: []
    };

    this.getAllData = this.getAllData.bind(this);
    this.makeMonthDataFormat = this.makeMonthDataFormat.bind(this);
    this.makeResearcherListFormat = this.makeResearcherListFormat.bind(this);
    this.makeProjectDuration = this.makeProjectDuration.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    this.getAllData()
    .then(allData => {
      console.log(allData);
      this.setState({
        projectsData: allData
      })
      allData.forEach(data => {
        this.makeProjectDuration(data);
      })
    })
  }
  
  makeMonthDataFormat() {
    let storeDataFormat = {};

    for(var yearIndex = moment().year()-1; yearIndex <= moment().year()+1; yearIndex++) {
      for(var monthIndex = 1; monthIndex <= 12; monthIndex++) {
        let columnName = yearIndex + '-' + (monthIndex < 10? '0'+monthIndex : monthIndex);
        
        storeDataFormat[columnName] = '';
      }
    }

    return storeDataFormat;
  };

  getParticipationData() {
    let participationDataByProject = [];
    return new Promise((resolve, reject) => {
      fetch('http://localhost:4000/resource/researchers')
      .then(data => {
        return data.json();
      }).then(researchers => {
        fetch('http://localhost:4000/resource/participations')
        .then(data => {
          return data.json();
        }).then(participations => {
          let separationDataByProjects = {};
  
          participations.forEach(participation => {
            if(!separationDataByProjects[participation.number]) {
              separationDataByProjects[participation.number] = [];
            }
      
            separationDataByProjects[participation.number].push(participation);      
          })
          
          Object.keys(separationDataByProjects).forEach((projectNumber, index) => {
            let newData = [{projectNumber: projectNumber}];

            researchers.forEach(researcher => {
              let storeData = Object.assign({ name: researcher.name,  id: researcher.id }, this.makeMonthDataFormat());
              separationDataByProjects[projectNumber].forEach(participation => {
                if(researcher.id === participation.id) {
                  storeData[participation.date_year_month] = participation.participation_rate;
                }
              })
              newData.push(storeData);
            })
            
            participationDataByProject.push(newData);
          })
        }).then(_ => {
          resolve(participationDataByProject);
        })
      })
    })
  }

  getProjectsData() {
    return new Promise((resolve, reject) => {
      let projectsInformation = [];
  
      axios.get("http://localhost:4000/resource/projects")
      .then(response => {
        response.data.forEach(project => {
          let projectData = [];
          let projectInfoKeys = Object.keys(this.state.projectDataName);
      
          projectInfoKeys.forEach(key => {
            projectData.push({
              column: this.state.projectDataName[key],
              value: project[key]? ((typeof project[key] === 'number')? project[key].toLocaleString(): project[key]): '-',
              key: key,
              className: key
            });
          })
          projectsInformation.push(projectData);
        });
      }).then(_=>{
        resolve(projectsInformation);
      })
    })
  };

  makeResearcherListFormat() {
    let dataFormatList = [];
    return fetch('http://localhost:4000/resource/researchers')
    .then(data => {
      return data.json();
    }).then(researchers => {
      researchers.forEach(researcher => {
        let storeDataFormat = Object.assign({name: researcher.name,  id: researcher.id}, this.makeMonthDataFormat());

        dataFormatList.push(storeDataFormat);
      })
    }).then(_ =>{
      return dataFormatList;
    })
  };

  async getAllData() {
    let projectsData = await this.getProjectsData();
    let participationData = await this.getParticipationData();
    let emptyFormat = await this.makeResearcherListFormat();

    let returnData = [];

    projectsData.forEach(project => {
      let dataSet = {project: project};
      participationData.forEach(participation => {
        if(project[1].value === participation[0].projectNumber) {
          participation.shift();
          dataSet.participation = participation;
        }
      })
      if(!dataSet.participation) {
        dataSet.participation = [].concat(emptyFormat);
      }
      returnData.push(dataSet);
    })
    return returnData;
  }

  makeProjectDuration(projectData) {
    let projectDuration = {
      date_of_start: '-',
      date_of_end: '-'
    }
    let gridColumns = {};
    let gridColumnNames = [
      {header: '이름', name: 'name'}
    ];

    let __setState = (data) => {
      this.setState(prevState => {return {changeData: [...prevState.changeData, data]}});
    };

    projectData.project.forEach(information => {
      if(projectDuration[information.key]) {
        projectDuration[information.key] = moment(information.value.substring(0, 7));
      }
    })
  
    for(var yearIndex = this.state.thisYear-1; yearIndex <= this.state.thisYear+1; yearIndex++) {
      gridColumns[yearIndex] = [];
  
      for(var monthIndex = 1; monthIndex <= 12; monthIndex++) {
        let columnName = yearIndex + '-' + (monthIndex < 10? '0'+monthIndex : monthIndex);
        gridColumns[yearIndex].push(columnName);
        gridColumnNames.push({
          header: monthIndex +'월',
          name: columnName,
          className: columnName,
          onAfterChange(ev) {
            __setState({
              number: projectData.project[1].value,
              id: projectData.participation[ev.rowKey].id,
              date_year_month: columnName,
              participation_rate: ev.value
            });
          },
          editor: {
            type: CustomTextEditor,
            options: {
              maxLength: 10
            }
          }
        })
      }
    }

    this.setState({
      gridColumnNames: gridColumnNames,
      participationGridSet: {
        height: 50,
        complexColumns: [{
            header: this.state.thisYear-1 + '년',
            name: (this.state.thisYear-1).toString(),
            childNames: gridColumns[this.state.thisYear-1]
          }, {
            header: this.state.thisYear + '년',
            name: this.state.thisYear.toString(),
            childNames: gridColumns[this.state.thisYear]
          }, {
            header: this.state.thisYear+1 + '년',
            name: (this.state.thisYear+1).toString(),
            childNames: gridColumns[this.state.thisYear+1]
        }]
      }
    })
  }

  saveData() {
    if(!this.state.changeData.length) return;
  
    return fetch('http://localhost:4000/resource/participations', {
      method: 'post',
      body: JSON.stringify(this.state.changeData),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    }).then(response => {
      return response;
    }).catch(e => {
      return e
    })
  }
  
  render() {
    return (
      <div>
        <div className="total-area">
          <div className="control-wrapper">
            <div className="store-control-wrapper">
              <Button onClick={this.changeData}>저장</Button>
              <Button>복구</Button>
            </div>
            <div className="year-control-wrapper">
              <Button className="year-control" onClick={console.log(this)}>prev</Button>
              <div id="this-year">{this.state.thisYear}</div>
              <Button className="year-control">next</Button>
            </div>
          </div>
          <Container fluid>
            <Row>
              <Col className="information">
                <Grid
                  data={this.state.totalBudget}
                  columns={[{
                      header: '',
                      name: 'column'
                    }, {
                      header: '',
                      name: 'value'
                  }]}
                  header={{
                    complexColumns: [{
                      header: '프로젝트 정보',
                      name: 'project_information',
                      childNames: ['column', 'value'],
                      hideChildHeaders: true
                    }],
                    height: 30}
                  }
                />
              </Col>
              <Col>
                <Grid
                  data={this.state.totalParticipation}
                  columns={this.state.gridColumnNames}
                  header={this.state.participationGridSet}
                />
              </Col>
            </Row>
          </Container>
        </div>

        <Container fluid>
          {
            this.state.projectsData.map((project, index) => {
              console.log(project.participation)
              return <Row key={index}>
                <Col className="information">
                  <Grid
                    data={project.project}
                    columns={[{
                        header: '',
                        name: 'column'
                      }, {
                        header: '',
                        name: 'value'
                    }]}
                    header={{
                      complexColumns: [{
                        header: '프로젝트 정보',
                        name: 'project_information',
                        childNames: ['column', 'value'],
                        hideChildHeaders: true
                      }],
                      height: 30}
                    }
                  />
                </Col>
                <Col>
                  <Grid
                      data={project.participation}
                      columns={this.state.gridColumnNames}
                      header={this.state.participationGridSet}
                    />
                </Col>
              </Row>
            })
          }
        </Container>
      </div>
    )
  }
}

