import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Blockies from 'react-blockies';

import { spacing, typography } from 'material-ui/styles';
import { white, blue600 } from 'material-ui/styles/colors';
import Assessment from 'material-ui/svg-icons/action/assessment';

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
      },
      logo: {
        cursor: 'pointer',
        fontSize: 22,
        color: typography.textFullWhite,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        fontWeight: typography.fontWeightLight,
        backgroundColor: 'rgb(0, 188, 212)',
        paddingLeft: 40,
        height: 64,
      },
      menuItem: {
        color: white,
        fontSize: 14
      },
      avatar: {
        div: {
          padding: '22px 0 20px 15px',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)), url(' + require('./images/material_bg.png') + ')',
          height: 45
        },
        icon: {
          float: 'left',
          display: 'block',
          marginRight: 15,
        },
        span: {
          paddingTop: 12,
          display: 'block',
          color: 'white',
          fontWeight: 300,
          textShadow: '1px 1px #444',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '170px',
          overflow: 'hidden'
        }
      }
    };

    return (
      <div className="App">

        <Drawer open={this.state.open}>
          <div style={styles.logo}>
            Suscryption
      </div>
          <div style={styles.avatar.div}>
            <div style={styles.avatar.icon} className="blockies-circular">
              <Blockies
                scale={5}
                seed={this.context.accounts[0]}
              />
            </div>
            <span style={styles.avatar.span}>{this.context.accounts[0]}</span>
          </div>
          <MenuItem containerElement={<Link to="/admin" />} leftIcon={<Assessment />}>Home</MenuItem>
          <MenuItem containerElement={<Link to="/admin/dashboard" />} leftIcon={<Assessment />}>Dashboard</MenuItem>
        </Drawer>
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
