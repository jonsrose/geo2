import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getLocalityObject} from '../reducers'
// import { loadUser, loadStarred } from '../actions'
// import User from '../components/User'
// import Repo from '../components/Repo'
// import List from '../components/List'
// import zip from 'lodash/zip'

/*
function loadData(props) {
  // sole.log('loadData')
  const { login } = props
  props.loadUser(login, [ 'name' ])
  props.loadStarred(login)
}
*/

class LocalityPage extends Component {

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
    console.log('renderlocality')
    // sole.log(this.props.localityText)
    if (this.props.locality) {
      return (
        <div>
          {this.props.localityThumbnail &&
            <img src={this.props.localityThumbnail.source} width={this.props.localityThumbnail.width} height={this.props.localityThumbnail.height}/>
          }
          <div dangerouslySetInnerHTML={this.createMarkup(this.props.localityText)} />
          <div>
            <a href={`https://en.wikipedia.org/wiki/${encodeURI(this.props.locality.title)}`} target="_blank">Go to wikipedia page</a>
          </div>
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
