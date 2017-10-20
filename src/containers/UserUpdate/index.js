import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import AddBalance from './AddBalance'

const WithdrawBalance = () => {
  return <p>withdraw</p>
}
const PayUpFront = () => {
  return <p>pay upfront</p>
}
class UserWidget extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedItem : null
    }
  }

  setSelectedItem = (item) => this.setState(
    {
      ...this.state,
      selectedItem: (item === this.state.selectedItem)? null : item
    })

  render() {
    const style = {
      margin: 3,
    }
    const {
      selectedItem
    } = this.state

    const displayBody = () => {
      switch (selectedItem) {
        case 'ADD_BALANCE':
          return <AddBalance/>
        case 'WITHDRAW_BALANCE':
          return <WithdrawBalance/>
        case 'PAY_UP_FRONT':
          return <PayUpFront/>
        default:
          return null
      }
    }
    return (
      <div>
        <h1>Update your Preferences</h1>
        <RaisedButton label="Add Balance"
          style={style}
          onClick={() => this.setSelectedItem('ADD_BALANCE')}
          secondary={true}
          disabled={selectedItem === 'ADD_BALANCE'}/>
        <RaisedButton label="Withdraw Balance"
          style={style}
          onClick={() => this.setSelectedItem('WITHDRAW_BALANCE')}
          secondary={true}
          disabled={selectedItem === 'WITHDRAW_BALANCE'}/>
        <RaisedButton label="Pay-Upfront"
          style={style}
          onClick={() => this.setSelectedItem('PAY_UP_FRONT')}
          secondary={true}
          disabled={selectedItem === 'PAY_UP_FRONT'}/>
        {displayBody()}
      </div>
    )
  }
}

export default UserWidget
