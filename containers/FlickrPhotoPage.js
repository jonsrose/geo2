import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getFlickrPhotoObject } from '../reducers'

class FlickrPhotoPage extends Component {

  createMarkup(text) {
    return {__html: text}
  }

  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.flickrPhoto) {
      return (
            <div>
              <img className={'responsive-image'} src={this.props.flickrPhoto.urlM} />
              <div style={{padding:5}} dangerouslySetInnerHTML={this.createMarkup(this.props.flickrPhoto.title)} />
            </div>
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
