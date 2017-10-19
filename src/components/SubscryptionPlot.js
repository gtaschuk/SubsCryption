import React, { Component } from 'react'
import ReactFlot from 'react-flot';

class SubscryptionPlot extends Component {
  render() {
    var options = {
      series: {
        lines: {
          show: true
        },
        points: {
          show: true
        }
      },
      grid: {
        hoverable: false,
        clickable: false
      }
    } 

    var data = [{label:'test',data:[[0,0],[0,1],[1,3],[3,5]]}];

    return (
      <div> HOLAAA
      <ReactFlot id="subscryption-chart" options={options} data={data} width="50%" height="100px" />
      </div>
    )
  }
}

export default SubscryptionPlot
