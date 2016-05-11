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
    console.log('renderFlickrPhoto')

    if (this.props.flickrPhoto) {
      const flickrLink = `https://www.flickr.com/photos/${this.props.flickrPhoto.owner}/${this.props.flickrPhoto.id}`
      return (
        <div>
          <a href={flickrLink} target="_blank"><img src={this.props.flickrPhoto.urlM} width={256}/></a>
          <div dangerouslySetInnerHTML={this.createMarkup(this.props.flickrPhoto.title)} />
          <div>
            <a href={flickrLink} target="_blank">Go to flickr page</a>
          </div>
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
