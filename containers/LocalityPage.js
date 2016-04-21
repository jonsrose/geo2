import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getLocalityObject} from '../reducers'
import Paper from 'material-ui/lib/paper'
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
    // sole.log('renderlocality')
    // sole.log(this.props.localityText)
    return (
      <Paper style={{position: 'absolute', left:0, top:0, right:0, bottom: 0, overflow:'auto', padding:10}}>
      <div dangerouslySetInnerHTML={this.createMarkup(this.props.localityText)} />
      </Paper>

    )
  }
}

LocalityPage.propTypes = {
  localityObject: PropTypes.object
}

function mapStateToProps(state) {
  return {
    localityText: getLocalityObject(state) ? getLocalityObject(state).extract : null
  }
}

export default connect(mapStateToProps, null)(LocalityPage)
