import React, { Component } from 'react'
import UserUpdate from './UserUpdate'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import ReactTimeout from 'react-timeout'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDisabled, setEnabled } from '../actions'

class UserWidget extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalOpen : false,
      balance: 0
    }
  }

  componentDidMount() {
    this.getBalance()
  }

  getBalance = () => {

    if (this.props.websiteIsActive) {
      this.props.dispatch(setDisabled())
    } else {
      this.props.dispatch(setEnabled())
    }
    if (!this.props.planArray || !this.props.planArray[0]) {
      this.props.setTimeout(this.getBalance, 100)
      return;
    }

    this.context.PlanShell.at(this.props.planArray[0].plan).then( instance => {
      const time = Math.round((new Date()).getTime() / 1000)
      return instance.getBalanceTimeStamp(this.context.accounts[0], time)
    })
    .then(balance => {
      this.setState({ balance: balance.toString() });
    })

    this.props.setTimeout(this.getBalance, 3000)
  }

  handleOpen = () => {
    this.setState({isModalOpen: true})
  }

  handleClose = () => {
    this.setState({isModalOpen: false})
  }
  render() {
    return (
      <div className='user-sub-widget'>
        <h1>Your Subscription</h1>
        <h4>Your Balance: {this.state.balance} weis </h4>
        <h4>Remaining Subscription:</h4>
        <RaisedButton label="Configure" onClick={this.handleOpen} />
        <Dialog
          className="preference-dialog"
          open={this.state.isModalOpen}
          onRequestClose={this.handleClose}
        >
          <UserUpdate/>
        </Dialog>
      </div>
    )
  }
}

UserWidget.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  hubInstance: PropTypes.object,
  PlanShell: PropTypes.func,
}

const mapStateToProps = (state) => ({
  planArray: state.plans.planArray,
  websiteIsActive: state.plans.websiteIsActive,
})

export default ReactTimeout(connect(mapStateToProps)(UserWidget))
