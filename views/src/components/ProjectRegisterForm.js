import React, { Component } from 'react';
import { Button, ButtonGroup, InputGroup, FormControl } from 'react-bootstrap';

export default class ProjectInputForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {columns : [
      { name: '과제명', type: 'text' },
      { name: '계정번호', type: 'text' },
      { name: '과제책임자', type: 'text' },
      { name: '별칭', type: 'text' },
      { name: '연차', type: 'text' },
      { name: '과제시작일', type: 'date' },
      { name: '과제종료일', type: 'date' },
      { name: '인건비_예산(정)', type: 'number' },
      { name: '인건비_예산(위촉)', type: 'number' },
      { name: '간접비', type: 'number' },
      { name: '타입', type: 'text' },
      { name: '참여율', type: 'text' }
    ]};
  }

  render() {
    let columnItems = this.state.columns.map((column, index)=>
      <InputGroup key={index}>
          <InputGroup.Prepend column sm={2}>
            <InputGroup.Text>{column.name}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl type={column.type} />
      </InputGroup>
    )

    return (
      <div className="ui project-form">
        <h3 className="ui title">과제 정보</h3>
        {columnItems}

        <ButtonGroup>
          <Button variant="primary">저장</Button>
          <Button variant="primary">취소</Button>
        </ButtonGroup>
      </div>
    )
  }
}