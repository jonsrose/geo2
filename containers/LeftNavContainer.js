import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { zoom, unzoom } from '../actions'
import Paper from 'material-ui/Paper'

class LeftNavContainer extends Component {


  render() {
    return (
    <Paper style={{position: 'fixed', left:0, top:0, right:0, bottom: 0}}>
      <div style={{position: 'fixed', top: 0, bottom:0, overflowY:'auto', right:0, left: 0}}>
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
