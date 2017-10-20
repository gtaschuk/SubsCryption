import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { cyan600, pink600, purple600, orange600 } from 'material-ui/styles/colors';
import Assessment from 'material-ui/svg-icons/action/assessment';
import Face from 'material-ui/svg-icons/action/face';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import Dollar from 'material-ui/svg-icons/editor/attach-money';
import InfoBox from '../../components/InfoBox';

class Plan extends Component {
    constructor(props, context) {
        super(props)
        this.state = {};
    }

    componentDidMount() {
        var props = this.props;
        var context = this.context;
        props.loadPlan(props.params.planAddress, context).then(planInstance => {
            var planObject = { address: props.params.planAddress };
            planInstance.name().then(name => {
                planObject.name = name;
                return planInstance.planDescription();
            }).then(description => {
                planObject.planDescription = description;
                return planInstance.calculatePlanBalance();
            }).then(balance => {
                planObject.balance = context.web3.fromWei(balance, "ether").toNumber();
                return planInstance.getSubscribersCount({ gas: 3000000 });
            }).then(subscriberCount => {
                planObject.subscriberCount = subscriberCount.toNumber();
                var promises = [];
                for (var i = 0; i < planObject.subscriberCount; i++) {
                    promises.push(planInstance.subscribers(i));
                }
                return Promise.all(promises);
            }).then(subscribers => {
                return Promise.all(subscribers.map(addrr => planInstance.subscribersInfo(addrr)));
            }).then(info => {
                console.log(info);
                this.setState(Object.assign({}, this.state, { plan: planObject }));
            })
        })
    }

    render() {
        return (
            <main className="container">
                {this.state.plan ?
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1 style={{ paddingTop: "20px" }}>{this.state.plan.name}</h1>
                            <h3>Address: {this.state.plan.address}</h3>
                            <p>{this.state.plan.planDescription}</p>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                                    <InfoBox Icon={Dollar}
                                        color={pink600}
                                        title="Current balance"
                                        value={this.state.plan.balance + " Ξ"}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                                    <InfoBox Icon={Face}
                                        color={orange600}
                                        title="Plan members"
                                        value={"" + this.state.plan.subscriberCount}
                                    />
                                </div>

                                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                                    <InfoBox Icon={Assessment}
                                        color={purple600}
                                        title="Subscription length"
                                        value="460"
                                    />
                                </div>
                            </div>
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