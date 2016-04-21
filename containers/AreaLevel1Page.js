import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getAreaLevel1Object} from '../reducers'
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





class AreaLevel1Page extends Component {

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
    // sole.log('renderareaLevel1')
    // sole.log(this.props.areaLevel1Text)
    return (
      <Paper style={{position: 'absolute', left:0, top:0, right:0, bottom: 0, overflow:'auto', padding:10}}>
      <div dangerouslySetInnerHTML={this.createMarkup(this.props.areaLevel1Text)} />
      </Paper>
    )
  }
}



AreaLevel1Page.propTypes = {
  areaLevel1Object: PropTypes.object
}

function mapStateToProps(state) {
  return {
    areaLevel1Text: getAreaLevel1Object(state) ? getAreaLevel1Object(state).extract : null
  }
}

export default connect(mapStateToProps, null)(AreaLevel1Page)
