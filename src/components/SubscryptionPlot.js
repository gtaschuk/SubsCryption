import React, { Component } from 'react'
import ReactFlot from 'react-flot';
require('../../node_modules/flot-axislabels/jquery.flot.axislabels.js');

class SubscryptionPlot extends Component {

  getValue(t) {
    return parseFloat(this.props.h) * (1 - ((parseFloat(this.props.w) * (t - parseFloat(this.props.s))) / (1 + parseFloat(this.props.w) * Math.abs(t - parseFloat(this.props.s))))) + parseFloat(this.props.b)
  }

  getData() {
    var data = [];
    var startMonth = 0;
    var endMonth = 12;
    var secondsInMonth = 30 * 24 * 60 * 60;
    for (var i = startMonth; i <= endMonth * 5; i++) {
      data.push([i / 5, this.getValue(secondsInMonth*i / 5)/1000]);
    }
    return data;
  }

  render() {
    var options = {
      series: {
        lines: {
          show: true
        },
        points: {
          show: false
        }
      },
      grid: {
        hoverable: false,
        clickable: false,
        backgroundColor: { colors: ["#fff", "#eee"] },
        borderWidth: {
          top: 1,
          right: 1,
          bottom: 2,
          left: 2
        }
      },
      xaxes: [{
        axisLabel: 'Time (months)',
      }],
      yaxes: [{
        position: 'left',
        axisLabel: 'Price Ξ',
      }]
    }

    var data = [{ lines: { show: true, fill: true }, label: ' Price chart', data: this.getData() }];

    return (
      <div>
        <ReactFlot id="subscryption-chart" options={options} data={data} width="100%" height="500px" />
      </div>
    )
  }
}

export default SubscryptionPlot
