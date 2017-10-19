import React, { Component } from 'react'
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <div className="App">
        <AppBar
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.handleToggle}
        />
        <Drawer open={this.state.open}>
          <AppBar onClick={this.handleToggle}
            title="Subscription"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
           
          />
          <MenuItem  containerElement={<Link to="/" />}>Home</MenuItem>
          <MenuItem  containerElement={<Link to="/dashboard" />}>Dashboard</MenuItem>
        </Drawer>
        {this.props.children}
      </div>
    );
  }
}

export default App
