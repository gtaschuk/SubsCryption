import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { addBalance } from '../../actions/userActions'
import SubscryptionPlot from '../../components/SubscryptionPlot'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'

class PayUpFront extends Component {
    constructor(props) {
        super(props)
        this.state = {
            w: 0, h: 0, s: 0, b: 0, months: "", areaAmount: 0, etherAmount: 0
        }
    }

    componentDidMount() {
        this.context.PlanShell.at(this.props.planArray[0].plan).then(planInstance => {
            var w, h, s, b;
            planInstance.w().
                then(_w => {
                    w = _w.toNumber();
                    return planInstance.h()
                }
                ).
                then(_h => {
                    h = _h.toNumber();
                    return planInstance.s()
                }
                ).
                then(_s => {
                    s = _s.toNumber();
                    return planInstance.b()
                }
                ).
                then(_b => {
                    b = _b.toNumber();
                    this.setState(Object.assign({}, this.state, {
                        w: w,
                        h: h,
                        s: s,
                        b: b
                    }))
                }
                )
        })
    }

    changeMonths = (event) => {
        this.setState(Object.assign({}, this.state, {
            months: event.target.value
        }))
        this.context.PlanShell.at(this.props.planArray[0].plan).then(planInstance => {
            var etherAmount;
            var areaAmount;
            planInstance.getPrepayAmount(this.context.accounts[0], parseFloat(this.state.months) * 30 * 24 * 60 * 60).then(amount => {
                etherAmount = this.context.web3.fromWei(amount, "ether").toNumber();
                return planInstance.calculateArea(0, parseFloat(this.state.months) * 30 * 24 * 60 * 60)
            }).then(area => {
                areaAmount = this.context.web3.fromWei(area, "ether").toNumber();
                this.setState(Object.assign({}, this.state, { etherAmount: etherAmount, areaAmount: areaAmount }))
            })
        })
    }

    payUpfront = () => {
        this.context.PlanShell.at(this.props.planArray[0].plan).then(planInstance => {
            planInstance.payUpfront(this.state.months*30*24*3600,{from:this.context.accounts[0],value:this.context.web3.toWei(this.state.etherAmount+0.0001,"ether")}).then(
                tx=>{
                    this.props.onRequestClose();
                }
            )
        })
    }

    render = () => {
        const style = {
            paper: {
                padding: "20px"
            }
        }
        return (
            <div>
                <Paper style={style.paper} zDepth={3} >
                    <SubscryptionPlot h={this.state.h} w={this.state.w / 10000000} s={this.state.s} b={this.state.b} upfront={parseInt(this.state.months)}></SubscryptionPlot>
                </Paper>
                <div style={{ textAlign: "center" }}>
                    <TextField
                        floatingLabelText="Select months to pay"
                        onChange={this.changeMonths.bind(this)}
                        value={this.state.months}
                    /><br /></div>
                {this.state.etherAmount ? <p style={{ color: "white", textAlign: "center" }}>
                    You are saving {100 - Math.floor(100 * (this.state.etherAmount / this.state.areaAmount))} % !!!
                    </p> : <p></p>}
                <RaisedButton
                    label='Pay upfront'
                    primary={true}
                    fullWidth={true}
                    disabled={false}
                    onClick={this.payUpfront.bind(this)} />
            </div>
        )
    }
}


PayUpFront.contextTypes = {
    instanceLoaded: PropTypes.bool,
    accounts: PropTypes.array,
    web3: PropTypes.object,
    hubInstance: PropTypes.object,
    PlanShell: PropTypes.func,
}
const mapStateToProps = state => ({
    planArray: state.plans.planArray
})

export default connect(mapStateToProps)(PayUpFront)


