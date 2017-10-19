import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class AdminPanel extends Component {
  render() {
    return (
      <div>
        <h2>Toll Booth</h2>
        <h4>Report Vehicle Exit:</h4>
        <TextField
          floatingLabelText='Vehicle Address'
          hintText='This is the address associated with the vehicle you are allowing to exit.'
          fullWidth={true}
        /><br />
        <TextField
          floatingLabelText='Sectret Key'
          hintText='The secret key that the vehicle locked their deposit with.'
          fullWidth={true}
        /><br />
        <RaisedButton label='Report' primary={true} fullWidth={true} onClick={console.log}/>
      </div>
    )
  }
}

AdminPanel.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  hubInstance: PropTypes.object,
  PlanShell: PropTypes.func,
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(AdminPanel)
