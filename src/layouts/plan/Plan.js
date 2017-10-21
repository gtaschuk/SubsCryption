import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { cyan600, pink600, purple600, orange600 } from 'material-ui/styles/colors';
import Assessment from 'material-ui/svg-icons/action/assessment';
import Face from 'material-ui/svg-icons/action/face';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import Dollar from 'material-ui/svg-icons/editor/attach-money';
import InfoBox from '../../components/InfoBox';
import NewOrders from '../../components/NewOrders';
import BrowserUsage from '../../components/BrowserUsage';

class Plan extends Component {
    constructor(props, context) {
        super(props)
        this.state = {};
    }

    getPlan(address) {
        console.log("Getting plan");
        var props = this.props;
        var context = this.context;
        props.loadPlan(address, context).then(planInstance => {
            planInstance.newUserLog({ fromBlock: 0 }).get((err, users) => {
                console.log("Users:", users);
                var planObject = { address: address };

                planObject.users = users.map(event => {
                    return {
                        address: event.args.subscriber,
                        time: event.blockNumber
                    }
                });
                planObject.userAmountByTime = [];
                var sortedUsers = planObject.users.sort((a, b) => b.time - a.time);
                var maxTime = sortedUsers.map(user => user.time)[0];
                for (var i = 0; i < 10; i++) {
                    planObject.userAmountByTime.push(maxTime * i / 10);
                }
                planObject.userAmountByTime = planObject.userAmountByTime.map((time, index, array) => {
                    return {
                        pv: sortedUsers.filter(user => {
                            return user.time > time && (index === array.length - 1 || user.time < array[index + 1]);
                        }).length
                    }
                })

                Promise.all(planObject.users.map(user => planInstance.isActive(user.address, Date.now() / 1000)))
                    .then(areActive => {
                        planObject.users = planObject.users.map((user, index) => {
                            user.isActive = areActive[index]
                            return user;
                        })
                        return planInstance.name();
                    })
                    .then(name => {
                        planObject.name = name;
                        return planInstance.planDescription();
                    }).then(description => {
                        planObject.planDescription = description;
                        return planInstance.calculatePlanBalance();
                    }).then(balance => {
                        planObject.balance = context.web3.fromWei(balance, "ether").toNumber();
                        return Promise.all(users.map(user => planInstance.subscribersInfo(user.args.subscriber)));
                    }).then(info => {
                        console.log(info);
                        planObject.longTermSubscribers = info.map(array => {
                            return { length: array[2].minus(array[3]).div(60 * 60 * 24).toNumber() };
                        }).filter(data => data.length > 0);
                        this.setState(Object.assign({}, this.state, { plan: planObject }));
                    })
            });
        })
    }

    componentWillReceiveProps(props) {
        if (props.params.planAddress != this.props.params.planAddress) {
            this.setState(Object.assign({}, this.state, { plan: null }));
            this.getPlan(props.params.planAddress);
        }
    }

    componentDidMount() {
        this.getPlan(this.props.params.planAddress)
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
                            <div style={{ paddingBottom: "20px" }} className="row">
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
                                        value={"" + this.state.plan.users.length}
                                    />
                                </div>

                                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                                    <InfoBox Icon={Assessment}
                                        color={purple600}
                                        title="Subscription length (days)"
                                        value={"" + this.state.plan.longTermSubscribers.reduce((prev, curr) => { return prev + curr.length / this.state.plan.longTermSubscribers.length }, 0).toFixed(2)}
                                    />
                                </div>
                            </div>
                            <div style={{ paddingBottom: "20px" }} className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-md m-b-15">
                                    <NewOrders data={this.state.plan.userAmountByTime} />
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
                                    <BrowserUsage data={[
                                        { name: 'Active users', value: this.state.plan.users.filter(user => user.isActive).length, color: cyan600 },
                                        { name: 'Inactive users', value: this.state.plan.users.filter(user => !user.isActive).length, color: pink600 },
                               
                                    ]} />
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