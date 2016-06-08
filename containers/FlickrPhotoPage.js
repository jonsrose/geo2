import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getFlickrPhotoObject } from '../reducers'
import LeftNavCommon from './LeftNavCommon'
import FlatButton from 'material-ui/FlatButton'
import { navToFlickrPhoto } from '../actions'


class FlickrPhotoPage extends Component {

  createMarkup(text) {
    return {__html: text}
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { flickrPhoto } = this.props

    if (flickrPhoto) {
      const { prev, next } = flickrPhoto

      let imageUrl

      if (this.props.zoomed) {
        imageUrl = flickrPhoto.urlL
      } else {
        imageUrl = flickrPhoto.urlM
      }

      return (
            <div>
              <div>
                <LeftNavCommon />
                {flickrPhoto.prev && <FlatButton label="Prev" primary={true} onTouchTap={this.props.navToFlickrPhoto.bind(this, prev.id, prev.index )}/>}
                {flickrPhoto.next && <FlatButton label="Next" primary={true} onTouchTap={this.props.navToFlickrPhoto.bind(this, next.id, next.index )}/>}
              </div>
              <img className={'responsive-image'} src={imageUrl} />
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
  coordinatesString: PropTypes.string,
  navToFlickrPhoto: PropTypes.func,
  zoomed: PropTypes.bool
}

function mapStateToProps(state) {
  return {
    flickrPhoto: getFlickrPhotoObject(state),
    coordinatesString: state.coordinatesString,
    zoomed: state.zoom
  }
}

export default connect(mapStateToProps, { navToFlickrPhoto })(FlickrPhotoPage)
