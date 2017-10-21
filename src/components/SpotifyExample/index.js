import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import MusicPlayer from './MusicPlayer'
import UserWidget from '../../containers/UserWidget'
import playlist from './playlist'

class SpotifyExample extends Component {
	
	constructor(props){
		super(props);
		this.state = {isSubscribed:"0px"};
	}

  render() {
    return (
      <div className={'website-container'}>
        <h1>Fake Spotify</h1>
        <MusicPlayer playlist={playlist} isBlurred={this.props.websiteIsActive? "0px" : "10px"} isActive={this.props.websiteIsActive} />
        <UserWidget />
      </div>
    )
  }
}

SpotifyExample.contextTypes = {
    instanceLoaded: PropTypes.bool,
    accounts: PropTypes.array,
    web3: PropTypes.object,
    planRegistryInstance: PropTypes.object,
    PlanShell: PropTypes.func,
}

const mapStateToProps = state => {
    return {
    	planArray: state.plans.planArray,
    	websiteIsActive: state.plans.websiteIsActive,
    }
}

export default connect(
    mapStateToProps
)(SpotifyExample)