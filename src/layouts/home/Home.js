import React, { Component, PropTypes } from 'react'
import SubscryptionPlot from '../../components/SubscryptionPlot'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';

class Home extends Component {

  constructor() {
    super();
    this.state = { h: 450, w: 6, s: 4 * 30 * 24 * 60 * 60, b: 200 };
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

  nameChange(event) {
    var state = this.state;
    state.name = event.target.value;
    this.setState(state);
  }

  descriptionChange(event) {
    var state = this.state;
    state.description = event.target.value;
    this.setState(state);
  }

  deploy() {
    this.context.planRegistryInstance.createNewPlan(this.state.h
      , this.state.w
      , this.state.s
      , this.state.b
      , this.state.name
      , this.state.description
      , this.context.accounts[0]
      , { from: this.context.accounts[0],gas:3000000 })
      .then(tx => console.log(tx));
  }

  render() {
    const style = {
      heading: {
        paddingTop: "30px"
      },
      form: {
        paddingLeft: "50px"
      },
      formContainer: {
        display: 'inline-block',
        width: '100%',
        marginBottom: "100px",
        textAlign: 'center',
        marginRight: '20px',
        field: {
          width: "500px"
        },
        paper: {
          paddingTop: "30px",
        },
        button: {
          marginTop: "50px",
          marginBottom: "40px"
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
            <p>This tool allows you to deploy a new subscryption system to incentivice your users to stay in you platform 🚀</p>
            <p>First, configure it to the prices of your service:</p>
            <div style={style.configContainer}  >
              <Slider max={1000} style={style.verticalSlider} value={this.state.h} onChange={this.heightChange.bind(this)} axis="y" />

              <div style={style.plotContainer}>
                <Slider style={style.horizontalSlider} axis="x" max={15} value={this.state.w} onChange={this.widthChange.bind(this)} />
                <SubscryptionPlot h={this.state.h} w={this.state.w / 10000000} s={this.state.s} b={this.state.b}></SubscryptionPlot>
                <Slider style={style.horizontalSlider} min={0} max={12 * 30 * 24 * 60 * 60} axis="x" value={this.state.s} onChange={this.startChange.bind(this)} />
              </div>

              <Slider style={style.verticalSlider} max={1000} axis="y" onChange={this.endChange.bind(this)} value={this.state.b} />
            </div>


            <div style={style.formContainer}>
              <Paper style={style.formContainer.paper} zDepth={3} >
                <h2>More about your subscryption</h2>
                <p>We need a little more data about your service:</p>
                <TextField
                  style={style.formContainer.field}
                  hintText="Name"
                  onChange={this.nameChange.bind(this)}
                  value={this.state.name}
                  floatingLabelText="Service name"
                /><br />
                <TextField
                  style={style.formContainer.field}
                  hintText="Service description"
                  onChange={this.descriptionChange.bind(this)}
                  value={this.state.description}
                  floatingLabelText="Description"
                /><br />
                <RaisedButton style={style.formContainer.button} onClick={this.deploy.bind(this)} label="DEPLOY INSTANCE" primary={true} />
              </Paper>
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
