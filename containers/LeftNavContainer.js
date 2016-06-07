import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { zoom } from '../actions'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import { browserHistory } from 'react-router'

class LeftNavContainer extends Component {
  mapInfo() {
    this.navigateToMap(this.props.coordinatesString)
  }

  navigateToMap(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }

  render() {
    return (
    <Paper style={{position: 'fixed', left:0, top:0, right:0, bottom: 0}}>
      <div style={{position: 'fixed', top: 0, bottom:0, overflowY:'auto'}}>
        <FlatButton label="Back" primary={true} onTouchTap={this.mapInfo.bind(this)} />
        <FlatButton label="Zoom" primary={true} onTouchTap={this.props.zoom.bind(this)} />
        { this.props.children }
      </div>
    </Paper>)
  }
}

LeftNavContainer.propTypes = {
  zoom: PropTypes.func
}



export default connect(null, { zoom })(LeftNavContainer)
