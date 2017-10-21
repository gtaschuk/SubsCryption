import React, { Component } from 'react'
import UserUpdate from './UserUpdate'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import ReactTimeout from 'react-timeout'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class UserWidget extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalOpen : false,
      balance: 0
    }
  }

  componentDidMount() {
    this.props.setTimeout(this.getBalance, 100)
  }

  getBalance = () => {
    this.context.PlanShell.at(this.props.planArray[0].plan).then( instance => {
      const time = Math.round((new Date()).getTime() / 1000)
      console.log('the time is:', time)
      // return instance.getBalance(this.context.accounts[0])
      console.log('this.context.accounts[0]')
      console.log(this.context.accounts[0])
      console.log('this.context.accounts[0]')
      return instance.getBalanceTimeStamp(this.context.accounts[0], time)
      // return instance.getBalanceTimeStamp(this.context.accounts[0], time, {gas: 3000000})
    })
    .then(balance => {
      this.setState({ balance: balance.toString() });
      // const ethBalance = this.context.web3.fromWei(balance,'finney')

      // console.log(ethBalance)
      // console.log(parseInt(ethBalance.toString()))
      // // this.setState()
    })

    this.props.setTimeout(this.getBalance, 1000)
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
        <h4>Your Balance: {this.state.balance}</h4>
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
  planArray: state.plans.planArray
})

export default ReactTimeout(connect(mapStateToProps)(UserWidget))
