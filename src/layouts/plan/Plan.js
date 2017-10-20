import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Plan extends Component {
    constructor(props, context) {
        super(props)
        this.state = {};
        props.loadPlan(props.params.planAddress, context).then(planInstance => {
            var planObject = {};
            planInstance.name().then(name => {
                planObject.name = name;
                return planInstance.planDescription();
            }).then(description => {
                planObject.planDescription = description;
                return planInstance.subscribers();
            }).then(addresses => {
                planObject.users = addresses;
                return planInstance.upfrontPayments();
            }).then(balance => {
                planObject.balance = context.web3.fromWei(balance, "ether");
                this.setState({ plan: planObject });
            })
        })
    }

    render() {
        return (
            <main className="container">
                {this.state.plan ?
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>{this.state.plan.name}</h1>
                            <h3>Address: {this.state.plan.address}</h3>
                            <p>{this.state.plan.planDescription}</p>
                        </div>
                    </div> : null}
            </main>
        )
    }
}

Plan.contextTypes = {
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
        loadPlan: (address, context) => {
            return context.PlanShell.at(address);
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Plan)