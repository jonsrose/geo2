import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getLocalityObject} from '../reducers'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import { browserHistory } from 'react-router'

class LocalityPage extends Component {

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
    if (this.props.locality) {
      // const link = `https://en.wikipedia.org/wiki/${encodeURI(this.props.locality.title)}`
      return (
        <div>
          <Paper style={{position: 'fixed', left:0, top:0, right:0, bottom: 0}}>
            <div style={{position: 'fixed', top: 0, bottom:0, overflowY:'auto'}}>
              <FlatButton label="Back" primary={true} onTouchTap={this.mapInfo.bind(this)} />
              {this.props.localityThumbnail &&
                <img className={'responsive-image'} src={this.props.localityThumbnail.source} />
              }
              <div style={{padding:5}} dangerouslySetInnerHTML={this.createMarkup(this.props.localityText)} />
            </div>
          </Paper>
        </div>
      )
    } else {
      return null
    }
  }
}

LocalityPage.propTypes = {
  locality: PropTypes.object,
  localityText: PropTypes.string,
  localityThumbnail: PropTypes.object,
  coordinatesString: PropTypes.string
}

function mapStateToProps(state) {
  return {
    locality: getLocalityObject(state),
    localityText: getLocalityObject(state) ? getLocalityObject(state).extract : null,
    localityThumbnail: getLocalityObject(state) ? getLocalityObject(state).thumbnail : null,
    coordinatesString: state.coordinatesString
  }
}

export default connect(mapStateToProps, null)(LocalityPage)
