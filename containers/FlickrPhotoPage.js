import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getFlickrPhotoObject } from '../reducers'

class FlickrPhotoPage extends Component {

  createMarkup(text) {
    // sole.log('createMarkup')
    // sole.log(text)
    return {__html: text}
  }

  constructor(props) {
    // sole.log('containers/MapPage constructor props:')
    // sole.log(props)
    super(props)
    // this.renderRepo = this.renderRepo.bind(this)
    // this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this)
  }

  render() {
    console.log('renderFlickrPhoto')
    // sole.log(this.props.flickrPhotoText)
    return (
      <div>
      {this.props.flickrPhoto ?
        <img src={this.props.flickrPhoto.urlM} width={380} />
        : null
      }
      <div dangerouslySetInnerHTML={this.createMarkup(this.props.flickrPhoto.title)} />
      <div>
        <a href={'#'} target="_blank">Go to flickr page</a>
      </div>
      </div>
    )
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
