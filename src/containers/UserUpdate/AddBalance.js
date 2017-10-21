import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { addBalance } from '../../actions/userActions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class AddBalance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amount : 0,
      amountError : '',
    }

  }
  setAmount = (event, amount) => {
    this.setState({ ...this.state, amount: (amount>0)? amount : 0 })
  }
  submitSetAmount = () => {
    const {
      web3,
      PlanShell,
      accounts,
    } = this.context
    const {
      planArray,
    } = this.props
    const {
      amount,
    } = this.state
    console.log('plannn', planArray[0].plan)
    console.log('Add PlanShell', PlanShell)
    // TODO:: hard coding this now, not checking for null.
    const planInstance = PlanShell.at(planArray[0].plan)
    addBalance(planInstance, accounts[0], web3.toWei(amount, 'ether'))
    this.props.onRequestClose();
  }
  render() {
    const {
      amount,
      amountError,
    } = this.state

    return (
      <div>
        <TextField
          floatingLabelText='Update amount (in Ether)'
          hintText='Input the amount you wish to deposit in Ether.'
          type='number'
          value={amount}
          onChange={this.setAmount}
          errorText={amountError}
          fullWidth={true}
        /><br />
        <RaisedButton
          label='Set'
          primary={true}
          fullWidth={true}
          disabled={false}
          onClick={this.submitSetAmount}/>
      </div>
    )
  }
}

AddBalance.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  hubInstance: PropTypes.object,
  PlanShell: PropTypes.func,
}

const mapStateToProps = state => ({
  planArray: state.plans.planArray
})

export default connect(mapStateToProps)(AddBalance)
