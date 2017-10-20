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
    return (
      <div className='user-sub-widget'>
        <h1>Your Subscription</h1>
        <h4>Your Balance:</h4>
        <h4>Remaining Subscription:</h4>
        <RaisedButton label="Modal Dialog" onClick={this.handleOpen} />
        <Dialog
          className="preference-dialog"
          open={this.state.isModalOpen}
          onRequestClose={this.handleClose}
        >
          <UserUpdate/>
        </Dialog>
      </div>
    )
  }
}

export default UserWidget
