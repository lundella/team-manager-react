/* eslint-disable import/first */

import React, { Component } from 'react';;
import { Link } from "react-router-dom";
import { Button, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/fontawesome-free-solid'

class NavigationBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showBars: false,
      activeItem : "dashboard",
    }

    this.toggleMenu=this.toggleMenu.bind(this);
  }

  toggleMenu() {
    console.log(this.state.showBars);
    this.setState({showBars: !this.state.showBars});
  }

  render() {
    let { showBars } = this.state

    return (
      <header>
        <h1>Team Manager</h1>
        <FontAwesomeIcon icon={faBars} size="2x" onClick={this.toggleMenu}/>
        { showBars && ((<ButtonGroup vertical>
            <Button variant="light">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="light">
              <Link to="/project">Project</Link>
            </Button>
            <Button variant="light">
              <Link to="/researcher">Researcher</Link>
            </Button>
          </ButtonGroup>))
        }

      <div>{this.menuBars}</div>
      </header>
    )
  }
}

export default NavigationBar;