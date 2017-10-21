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
      isModalOpen: false,
      balance: 0,
      remainingSubscription: 0,
    }
  }

  componentDidMount() {
    this.getBalance()
    // this.getRemainingSubscription();
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

    const time = Math.round((new Date()).getTime() / 1000)
    this.context.PlanShell.at(this.props.planArray[0].plan).then(instance => {
      instance.getBalanceTimeStamp(this.context.accounts[0], time)
      .then(balance => {
        this.setState({ balance: balance.toString() });
      })
    });

    this.props.setTimeout(this.getBalance, 3000)
  }

  getRemainingSubscription = () => {
    if (!this.props.planArray || !this.props.planArray[0]) {
      this.props.setTimeout(this.getRemainingSubscription, 100)
      return;
    }

/*
    this.context.PlanShell.at(this.props.planArray[0].plan).then( async instance => {
      let time = Math.round((new Date()).getTime() / 1000)
      let days = 0;

      while (true) {
        console.log('days: ' + days)
        time += days * 86400;
        const active = await instance.isActive(this.context.accounts[0], time)
        if (!active) {
          this.setState({ remainingSubscription: days })
          return;
        }
       ++days;
      }
    });
*/
  }

  handleOpen = () => {
    this.setState({ isModalOpen: true })
  }

  handleClose = () => {
    this.setState({ isModalOpen: false })
  }
  render() {
    const fake_days_remaining = Math.round(this.state.balance ? this.state.balance / 1000000000000000000 : 0);
    return (
      <div className='user-sub-widget' style={{cursor:"pointer"}} onClick={this.handleOpen} >
        <h1>Your Subscription</h1>
        <h4>Your Balance: {this.state.balance} weis </h4>
        <h4>Remaining Subscription: {fake_days_remaining} day{fake_days_remaining !== 1 ? 's' : ''} left</h4>
        <RaisedButton label="Configure" onClick={this.handleOpen} />
        <Dialog
          className="preference-dialog"
          autoScrollBodyContent={true}
          contentStyle={{ width: "70%", maxWidth: "none" }}
          open={this.state.isModalOpen}

        >
          <UserUpdate onRequestClose={this.handleClose} />
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
