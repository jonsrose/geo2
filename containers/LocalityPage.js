import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getLocalityObject} from '../reducers'

class LocalityPage extends Component {

  createMarkup(text) {
    return {__html: text}
  }

  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.locality) {
      const link = `https://en.wikipedia.org/wiki/${encodeURI(this.props.locality.title)}`
      return (
        <div>
          {this.props.localityThumbnail &&
            <img src={this.props.localityThumbnail.source} width={this.props.localityThumbnail.width} height={this.props.localityThumbnail.height}/>
          }
          <div style={{padding:5}} dangerouslySetInnerHTML={this.createMarkup(this.props.localityText)} />
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
  localityThumbnail: PropTypes.object
}

function mapStateToProps(state) {
  return {
    locality: getLocalityObject(state),
    localityText: getLocalityObject(state) ? getLocalityObject(state).extract : null,
    localityThumbnail: getLocalityObject(state) ? getLocalityObject(state).thumbnail : null
  }
}

export default connect(mapStateToProps, null)(LocalityPage)
