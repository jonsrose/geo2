import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getFlickrPhotoObject } from '../reducers'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import { browserHistory } from 'react-router'

class FlickrPhotoPage extends Component {

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
    if (this.props.flickrPhoto) {
      return (
        <Paper style={{position: 'fixed', left:0, top:0, right:0, bottom: 0}}>
          <div style={{position: 'fixed', top: 0, bottom:0, overflowY:'auto'}}>
            <FlatButton label="Back" primary={true} onTouchTap={this.mapInfo.bind(this)} />
            <div>
              <img className={'responsive-image'} src={this.props.flickrPhoto.urlM} />
              <div style={{padding:5}} dangerouslySetInnerHTML={this.createMarkup(this.props.flickrPhoto.title)} />
            </div>
          </div>
        </Paper>
      )
    } else {
      return null
    }
  }
}

FlickrPhotoPage.propTypes = {
  flickrPhoto: PropTypes.object,
  coordinatesString: PropTypes.string
}

function mapStateToProps(state) {
  return {
    flickrPhoto: getFlickrPhotoObject(state),
    coordinatesString: state.coordinatesString
  }
}

export default connect(mapStateToProps, null)(FlickrPhotoPage)
