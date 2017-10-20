import React, { Component,PropTypes } from 'react'
import SubscryptionPlot from '../../components/SubscryptionPlot'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'material-ui/Slider';

class Home extends Component {

  constructor() {
    super();
    this.state = { h: 0.45, w: 0.3, s: 4 * 30 * 24 * 60 * 60, b: 0.2 };
  }

  widthChange(event, value) {
    var state = this.state;
    state.w = value
    this.setState(state);
  }

  heightChange(event, value) {
    var state = this.state;
    state.h = value
    this.setState(state);
  }

  startChange(event, value) {
    var state = this.state;
    state.s = value;
    this.setState(state);
  }

  endChange(event, value) {
    var state = this.state;
    state.b = value;
    this.setState(state);
  }

  deploy(){
    this.context.planRegistryInstance.createNewPlan(this.context.accounts[0],{from:this.context.accounts[0]}).then(tx=>console.log(tx));
  }

  render() {
    const style = {
      heading:{
        paddingTop:"30px"
      },
      form: {
        paddingLeft: "50px"
      },
      formContainer: {
        display: 'inline-block',
        width: '100%',
        textAlign: 'center',
        marginRight: '20px',
        field: {
          width: "500px"
        },
        button: {
          marginTop: "50px",
          marginBottom: "100px"
        }
      },
      valueField: {
        margin: '5px',
        width: "100px"
      },
      verticalSlider: {
        padding: "20px",
        maxHeight: "600px",
      },
      horizontalSlider: {
        padding: "20px"
      },
      plotContainer: {
        flex: "1",
        display: "flex",
        flexDirection: "column"
      },
      configContainer: {
        display: "flex",
        flexDirection: "row"
      }
    }
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1 style={style.heading}>Deploy a subscryption system</h1>
            <p>This tool allows you to configure your subscryption system:</p>
            <div style={style.configContainer}  >
              <Slider style={style.verticalSlider} value={this.state.h} onChange={this.heightChange.bind(this)} axis="y" />

              <div style={style.plotContainer}>
                <Slider style={style.horizontalSlider} axis="x" value={this.state.w} onChange={this.widthChange.bind(this)} />
                <SubscryptionPlot h={this.state.h * 1000} w={this.state.w / 2000000} s={this.state.s} b={this.state.b * 1000}></SubscryptionPlot>
                <Slider style={style.horizontalSlider} min={0} max={12 * 30 * 24 * 60 * 60} axis="x" value={this.state.s} onChange={this.startChange.bind(this)} />
              </div>

              <Slider style={style.verticalSlider} axis="y" onChange={this.endChange.bind(this)} value={this.state.b} />
            </div>

            <div style={style.formContainer}>
              <h2>More about your subscryption</h2>
              <p>We need a little more data about your service:</p>
              <TextField
                style={style.formContainer.field}
                hintText="Name"
                floatingLabelText="Service name"
              /><br />
              <TextField
                style={style.formContainer.field}
                hintText="Description"
                floatingLabelText="Description"
              /><br />
              <RaisedButton style={style.formContainer.button} onClick={this.deploy.bind(this)} label="DEPLOY INSTANCE" primary={true} />
            </div>
          </div>
        </div>
      </main>
    )
  }
}

Home.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  planRegistryInstance: PropTypes.object,
  PlanShell: PropTypes.func,
}

export default Home
