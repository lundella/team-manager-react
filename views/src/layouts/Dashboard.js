import React, { Component } from 'react';
import 'tui-grid/dist/tui-grid.css';
import Grid from '@toast-ui/react-grid';


export default class Dashboard extends Component {
  render() {
    const data = [
      {id: 1, name: 'Editor'},
      {id: 2, name: 'Grid'},
      {id: 3, name: 'Chart'}
    ];
    
    const columns = [
      {name: 'id', header: 'ID'},
      {name: 'name', header: 'Name'}
    ];
    
    return (
      <div>
        <h1>Dashboard Page</h1>
        <Grid
          data={data}
          columns={columns}
          rowHeight={25}
          bodyHeight={100}
          heightResizable={true}
          rowHeaders={['rowNum']}
        />
      </div>
    )
  }
}

