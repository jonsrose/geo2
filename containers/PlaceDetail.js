import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import { browserHistory } from 'react-router'

class PlaceDetail extends Component {
  navigateToMap(coordinatesString) {
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }

  mapInfo() {
    this.navigateToMap(this.props.coordinatesString)
  }


  createMarkup(text) {
    return {__html: text}
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Paper style={{position: 'fixed', left:0, top:0, right:0, bottom: 0}}>
        <div style={{position: 'fixed', top: 0, bottom:0, overflowY:'auto'}}>
          <FlatButton label="Back" primary={true} onTouchTap={this.mapInfo.bind(this)} />
          {this.props.children}
        </div>
      </Paper>
    )
  }
}

PlaceDetail.propTypes = {
  coordinatesString: PropTypes.string
}

function mapStateToProps(state) {
  return {
    coordinatesString: state.coordinatesString
  }
}

export default connect(mapStateToProps, null)(PlaceDetail)
