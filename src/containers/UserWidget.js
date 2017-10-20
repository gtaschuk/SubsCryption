import React, { Component } from 'react'
import UserUpdate from './UserUpdate'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

class UserWidget extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalOpen : false
    }
  }

  handleOpen = () => {
    this.setState({isModalOpen: true})
  }

  handleClose = () => {
    this.setState({isModalOpen: false})
  }
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={true}
        onClick={this.handleClose}
      />,
    ]

    return (
      <div className='user-sub-widget'>
        <h1>Your Subscription</h1>
        <h4>Your Balance:</h4>
        <h4>Remaining Subscription:</h4>
        <RaisedButton label="Modal Dialog" onClick={this.handleOpen} />
        <Dialog
          actions={actions}
          modal={true}
          open={this.state.isModalOpen}
        >
          <UserUpdate/>
        </Dialog>
      </div>
    )
    // title="Dialog With Actions"
  }
}

export default UserWidget
