import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getFlickrPhotoObject } from '../reducers'
import FlatButton from 'material-ui/FlatButton'

class FlickrPhotoPage extends Component {

  createMarkup(text) {
    return {__html: text}
  }

  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.flickrPhoto) {
      const flickrLink = `https://www.flickr.com/photos/${this.props.flickrPhoto.owner}/${this.props.flickrPhoto.id}`
      return (
        <div>
          <img src={this.props.flickrPhoto.urlM} width={256}/>
          <div style={{padding:5}} dangerouslySetInnerHTML={this.createMarkup(this.props.flickrPhoto.title)} />
        </div>
      )
    } else {
      return null
    }

  }
}

FlickrPhotoPage.propTypes = {
  flickrPhoto: PropTypes.object
}

function mapStateToProps(state) {
  return {
    flickrPhoto: getFlickrPhotoObject(state)
  }
}

export default connect(mapStateToProps, null)(FlickrPhotoPage)
