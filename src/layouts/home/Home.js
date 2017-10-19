import React, { Component } from 'react'
import SubscryptionPlot from '../../components/SubscryptionPlot'
import TextField from 'material-ui/TextField';

class Home extends Component {

  constructor(){
    super();
    this.state = {h:1,w:1,s:5,b:1};
  }

  render() {
    const style = {
      valueField: {
        margin: '5px'
      }
    }
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Deploy a subscryption system</h1>
            <p>This tool allows you to configure your subscryption system!</p>
            <SubscryptionPlot h={this.state.h} w={this.state.w} s={this.state.s} b={this.state.b}></SubscryptionPlot>
            <TextField
              style={style.valueField}
              hintText="Width"
              errorText="This field is required"
            />
            <TextField
              style={style.valueField}
              hintText="Height"
              errorText="This field is required"
            />
            <TextField
              style={style.valueField}
              hintText="Start time"
              errorText="This field is required"
            />
            <TextField
              style={style.valueField}
              hintText="End value"
              errorText="This field is required"
            />
          </div>
        </div>
      </main>
    )
  }
}

export default Home
