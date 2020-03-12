import React, { Component } from 'react';
import { Button, ButtonGroup, InputGroup, Form, FormControl } from 'react-bootstrap';
import axios from 'axios'

export default class ProjectInputForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      columns : [
        { name: '과제명', type: 'text', code: "name" },
        { name: '계정번호', type: 'text', code: "number" },
        { name: '과제책임자', type: 'text', code: "manager" },
        { name: '별칭', type: 'text', code: "nickname" },
        { name: '연차', type: 'text', code: "number_of_years" },
        { name: '과제시작일', type: 'date', code: "date_of_start" },
        { name: '과제종료일', type: 'date', code: "date_of_end" },
        { name: '인건비_예산(정)', type: 'number', code: "payroll_of_regular" },
        { name: '인건비_예산(위촉)', type: 'number', code: "payroll_of_irregular" },
        { name: '간접비', type: 'number', code: "overhead_costs" },
        { name: '타입', type: 'text', code: "type" },
        { name: '참여율', type: 'text', code: "participation_limit" }]
    };

    this.handleChange = this.handleChange.bind(this);
    this.registerProject = this.registerProject.bind(this);
    this.selectFormType = this.selectFormType.bind(this);
  }

  registerProject() {
    let inputData = this.state.columns.reduce((object, column) => {
      let codeName = column.code;
      if(this.state[column.code]) {
        object[codeName] = this.state[column.code];
      }
      return object;
    }, {type:"일반", participation_limit: true});

    console.log(inputData);
    axios.post('http://203.254.173.111:4000/resource/projects', inputData)
    .then(response => {
      console.log(response);
    })
  }

  handleChange(event) {
    console.log(event.target)
    let inputData = {};
    inputData[event.target.name] = event.target.value;

    this.setState(inputData, _=> {
      console.log(this.state);
    });
  }

  selectFormType(column) {
    let result;
    if(column.code === "participation_limit") {
      result = (
        <Form.Control as="select" name={column.code} onChange={this.handleChange}>
          <option>true</option>
          <option>false</option>
        </Form.Control>
        // <Form.Check 
        // type="switch"
        // name={column.code} onChange={this.handleChange} />
      )
    } else if (column.code === "type") {
      result = (
        <Form.Control as="select" name={column.code} onChange={this.handleChange}>
          <option>일반</option>
          <option>예정</option>
        </Form.Control>
      )
    } else {
      result = <Form.Control type={column.type} name={column.code} onChange={this.handleChange} />
    }

    return result;
  }

  render() {
    let columnItems = this.state.columns.map((column, index)=>
      <InputGroup key={index}>
          <InputGroup.Prepend>
            <InputGroup.Text className="column-label">{column.name}</InputGroup.Text>
          </InputGroup.Prepend>
          {this.selectFormType(column)}
      </InputGroup>
    )

    return (
      <div className="project-form">
        <h3 className="title">과제 정보</h3>
        {columnItems}
        <ButtonGroup className="button-area">
          <Button variant="primary" onClick={this.registerProject}>저장</Button>
          <Button variant="secondary">취소</Button>
        </ButtonGroup>
      </div>
    )
  }
}