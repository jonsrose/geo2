import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/lib/paper'
import FlatButton from 'material-ui/lib/flat-button'
import { browserHistory } from 'react-router'

class PlaceDetail extends Component {
  navigateToMap(coordinatesString) {
    console.log('navigateToMap')
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
    console.log('renderplaceDetail')
    return (
      <Paper style={{position: 'absolute', left:0, top:0, right:0, bottom: 0}}>
        <div style={{position: 'absolute', left: 0, top:0, height:44}}>
          <FlatButton label="Close" primary={true} onTouchTap={this.mapInfo.bind(this)} />
        </div>
        <div style={{position: 'absolute', top: 44, bottom:0, overflow:'auto', paddingLeft:10, paddingRight:10}}>
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
