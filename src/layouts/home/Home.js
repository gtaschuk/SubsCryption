import React, { Component } from 'react'
import SubscryptionPlot from '../../components/SubscryptionPlot'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Deploy a subscryption system</h1>
            <p>This tool allows you to configure your subscryption system!</p>
            <Subscryption-plot></Subscryption-plot>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
