import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Plan extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <main className="container">
                {this.props.plan ?
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>{this.props.plan.name}</h1>
                            <p><strong>Congratulations!</strong> If you're seeing this page, you've logged in with your own smart contract successfully.</p>
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
        loadPlan: (address) => {

        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Plan)