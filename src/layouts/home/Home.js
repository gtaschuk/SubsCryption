import React, { Component } from 'react'
import SubscryptionPlot from '../../components/SubscryptionPlot'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class Home extends Component {

  constructor() {
    super();
    this.state = { h: 0.45, w: 0.8, s: 4, b: 0.2 };
  }

  widthChange(event) {
    var state = this.state;
    state.w = event.target.value
    this.setState(state);
  }

  heightChange(event) {
    var state = this.state;
    state.h = event.target.value
    this.setState(state);
  }

  startChange(event) {
    var state = this.state;
    state.s = event.target.value
    this.setState(state);
  }

  endChange(event) {
    var state = this.state;
    state.b = event.target.value
    this.setState(state);
  }

  render() {
    const style = {
      form: {
        paddingLeft: "50px"
      },
      formContainer: {
        display: 'inline-block',
        marginRight: '20px'
      },
      valueField: {
        margin: '5px',
        width: "100px"
      }
    }
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Deploy a subscryption system</h1>
            <p>This tool allows you to configure your subscryption system:</p>
            <SubscryptionPlot h={this.state.h} w={this.state.w} s={this.state.s} b={this.state.b}></SubscryptionPlot>
            <div style={style.form}>
              <div style={style.formContainer}>
                <span>Slope: </span>
                <TextField
                  style={style.valueField}
                  value={this.state.w}
                  hintText="Slope"
                  onChange={this.widthChange.bind(this)}
                />
              </div>
              <div style={style.formContainer}>
                <span>Height: </span>
                <TextField
                  style={style.valueField}
                  value={this.state.h}
                  hintText="Height"
                  onChange={this.heightChange.bind(this)}
                />
              </div>
              <div style={style.formContainer}>
                <span>Start: </span>
                <TextField
                  style={style.valueField}
                  value={this.state.s}
                  hintText="Start time"
                  onChange={this.startChange.bind(this)}
                />
              </div>
              <div style={style.formContainer}>
                <span>End value: </span>
                <TextField
                  style={style.valueField}
                  value={this.state.b}
                  hintText="End value"
                  onChange={this.endChange.bind(this)}
                />
              </div>
            </div>
            <div>
            <h2>More about your subscryption</h2>
            <p>We need a little more data about your service:</p>
              <TextField
                hintText="Hint Text"
                floatingLabelText="Floating Label Text"
              /><br />
              <RaisedButton label="DEPLOY" primary={true}  />
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
