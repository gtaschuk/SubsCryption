import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import MusicPlayer from './MusicPlayer'
import UserWidget from '../../containers/UserWidget'
import playlist from './playlist'

class SpotifyExample extends Component {
	
	constructor(props){
		super(props);
		this.state = {isSubscribed:"0px"};

		this.knowIfBlurred = this.knowIfBlurred.bind(this)
	}
	
\

  render() {
    return (
      <div>
        <MusicPlayer playlist={playlist} isBlurred={this.state.isSubscribed} />
        <UserWidget />
      </div>
    )
  }

  knowIfBlurred(){
  	if(this.props.planArray.length>0){
	    this.context.PlanShell.at(this.props.planArray[0].plan)
	    .then(planInstance => {
	    	return planInstance.isActive(this.context.accounts[0], this.context.web3.block.timestamp)    	
	    })
	    .then(isSub=>{
	    	if(isSub == 0)
	    		this.setState({isSubscribed:"10px"});
	    	else
	    		this.setState({isSubscribed:"10px"});
	    })	  		
  	}
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
    	planArray: state.plans.planArray
    }
}

export default connect(
    mapStateToProps
)(SpotifyExample)