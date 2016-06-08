import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { zoom, unzoom } from '../actions'
import FlatButton from 'material-ui/FlatButton'
import { browserHistory } from 'react-router'

class LeftNavCommon extends Component {
  mapInfo() {
    this.navigateToMap(this.props.coordinatesString)
  }

  navigateToMap(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }

  render() {
    return (
    <span>
      {!this.props.zoomed && <FlatButton label="Close" primary={true} onTouchTap={this.mapInfo.bind(this)} />}
      {!this.props.zoomed && <FlatButton label="Zoom" primary={true} onTouchTap={this.props.zoom.bind(this)} />}
      {this.props.zoomed && <FlatButton label="Close" primary={true} onTouchTap={this.props.unzoom.bind(this)} />}
      { this.props.children }
    </span>
  )
  }
}

LeftNavCommon.propTypes = {
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

export default connect(mapStateToProps, { zoom, unzoom })(LeftNavCommon)
