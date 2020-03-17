import React, { Component } from 'react';
import ProjectInputForm from '../components/ProjectRegisterForm';
import Grid from '@toast-ui/react-grid';
import axios from 'axios'

export default class Project extends Component {
  constructor(props) {
    super(props)

    this.state = {
      projectData : "",
      projectColumns: [
        { header: '과제명', type: 'text', name: 'name', width: 200 },
        { header: '계정번호', type: 'text', name: 'number' },
        { header: '과제책임자', type: 'text', name: 'manager', width: 100 },
        { header: '별칭', type: 'text', name: 'nickname', width: 150 },
        { header: '연차', type: 'text', name: 'number_of_years', width: 40 },
        { header: '과제시작일', type: 'date', name: 'date_of_start', width: 100 },
        { header: '과제종료일', type: 'date', name: 'date_of_end' },
        { header: '인건비_예산(정)', type: 'number', name: 'payroll_of_regular' },
        { header: '인건비_예산(위촉)', type: 'number', name: 'payroll_of_irregular' },
        { header: '간접비', type: 'number', name: 'overhead_costs' },
        { header: '타입', type: 'text', name: 'type' },
        { header: '참여율', type: 'text', name: 'participation_limit' }
      ]
    }
  }

  componentDidMount() {
    axios.get('http://localhost:4000/resource/projects')
    .then(response => {
      this.setState({
        projectData: response.data
      })
    })
  }
  render() {
    return (
      <div>
        <div>Project Page</div>
        <div className="project-list">
          <Grid
            data={this.state.projectData}
            columns={this.state.projectColumns}
            rowHeight={25}
            rowHeaders={['rowNum']}
            columnOptions={{resizable: true}}
          />
        </div>

        <ProjectInputForm ></ProjectInputForm>
      </div>
    )
  }
}

