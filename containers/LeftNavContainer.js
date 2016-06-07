import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { zoom, unzoom } from '../actions'
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
      <div style={{position: 'fixed', top: 0, bottom:0, overflowY:'auto', right:0, left: 0}}>
        {!this.props.zoomed && <FlatButton label="Back" primary={true} onTouchTap={this.mapInfo.bind(this)} />}
        {!this.props.zoomed && <FlatButton label="Zoom" primary={true} onTouchTap={this.props.zoom.bind(this)} />}
        {this.props.zoomed && <FlatButton label="Close" primary={true} onTouchTap={this.props.unzoom.bind(this)} />}
        { this.props.children }
      </div>
    </Paper>)
  }
}

LeftNavContainer.propTypes = {
  zoom: PropTypes.func,
  unzoom: PropTypes.func,
  zoomed: PropTypes.bool,
  coordinatesString: PropTypes.string
}

function mapStateToProps(state) {
  return {
    zoomed: state.zoom,
    coordinatesString: state.coordinatesString
  }
}

export default connect(mapStateToProps, { zoom, unzoom })(LeftNavContainer)
