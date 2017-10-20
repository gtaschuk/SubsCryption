import React, { Component } from 'react'
import MusicPlayer from './MusicPlayer'
import UserWidget from '../../containers/UserWidget'
import playlist from './playlist'

export default class SpotifyExample extends Component {
  render() {
    return (
      <div>
        <MusicPlayer playlist={playlist} />
        <UserWidget />
      </div>
    )
  }
}
