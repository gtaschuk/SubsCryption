import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import getHubInstance from './utils/getHubInstance'
import { connect } from 'react-redux'
import { newPlanCreated } from './actions'

class InstanceWrapper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instanceLoaded: false,
      accounts: null,
      web3: null,
      planRegistryInstance: null,
      PlanShell: null
    }
  }

  // addNewSubscriberListener (operatorContractAddress, operatorUser) {
  //   const { PlanShell } = this.state
  //   if (PlanShell == null) return
  //
  //   PlanShell.at(operatorContractAddress).LogTollBoothAdded(
  //     { sender: operatorUser }, { fromBlock: 0, toBlock: 'latest' }
  //   ).watch ( (err, response) => {
  //   console.log('EVENT LOG(LogTollBoothAdded):', response.args)
  //     const {
  //       sender,
  //       tollBooth,
  //     } = response.args
  //     this.props.dispatch(newTollBoothAdded(
  //       sender,
  //       tollBooth,counts: null,
  //     ))
  //   })
  // }

  componentDidMount() {
    getHubInstance().then(result =>{
      this.setState((prevState, props) => (
        {
          ...this.state,
          instanceLoaded: true,
          accounts: result.accounts,
          web3: result.web3,
          planRegistryInstance: result.planRegistryInstance,
          PlanShell: result.PlanShell,
        })
      )

      // set up listeners on the contract.
      result.planRegistryInstance.LogPlanCreated(
        {}, { fromBlock: 0, toBlock: 'latest' }
      ).watch ( (err, response) => {
        console.log('EVENT LOG(LogPlanCreated):', response.args)

        this.props.addPlan(response.args);
      })

      // TODO:: get this working for removing toll booth operators.
    })
  }

  getChildContext() {
    return this.state
  }

  render() {
    const { children } = this.props
    return (children && this.state.instanceLoaded) ? React.Children.only(children) : <h1>Please wait, loading contracts from web3.</h1>
  }
}

InstanceWrapper.childContextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  planRegistryInstance: PropTypes.object,
  PlanShell: PropTypes.func,
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addPlan : (plan) => dispatch(newPlanCreated(plan))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(InstanceWrapper)
