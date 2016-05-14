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
    // https://github.com/twbs/bootstrap/issues/7501
    document.body.style.overflow='hidden'
    document.body.style.position='fixed'
    return (
      <Paper style={{position: 'absolute', left:0, top:0, right:0, bottom: 0}}>
        <div style={{position: 'absolute', top: 0, bottom:0, overflow:'auto'}}>
          {this.props.children}
          <FlatButton label="Back" primary={true} onTouchTap={this.mapInfo.bind(this)} />
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
