import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Blockies from 'react-blockies';
import Identicon from './components/Identicon'

import { spacing, typography } from 'material-ui/styles';
import { white, blue600 } from 'material-ui/styles/colors';
import Assessment from 'material-ui/svg-icons/action/assessment';
import SettingsApplications from 'material-ui/svg-icons/action/settings-applications';
import AppDrawer from './components/AppDrawer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'



class App extends Component {


  constructor(props) {
    super(props);
    this.state = { open: true };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    const paddingLeftDrawerOpen = 256;

    const styles = {
      appBar: {
        position: 'fixed',
        top: 0,
        overflow: 'hidden'
      },
      container: {
        paddingLeft: this.state.open ? paddingLeftDrawerOpen : 0
      }
    };

    return (
      <div className="App">

        <AppDrawer open={this.state.open}></AppDrawer>
        <div style={styles.container}>
          <AppBar
            style={styles.appBar}
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonTouchTap={this.handleToggle}
          />
          {this.props.children}
        </div>

      </div>
    );
  }
}

App.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  planRegistryInstance: PropTypes.object,
  PlanShell: PropTypes.func,
}

export default App
