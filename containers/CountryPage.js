import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getCountryObject} from '../reducers'
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





class CountryPage extends Component {

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
    // sole.log('rendercountry')
    // sole.log(this.props.countryText)
    return (
      <Paper style={{position: 'absolute', left:0, top:0, width:400, bottom: 0, overflow:'auto', padding:20, margin:30}}>
      <div dangerouslySetInnerHTML={this.createMarkup(this.props.countryText)} />
      </Paper>

    )
  }
}



CountryPage.propTypes = {
  countryObject: PropTypes.object
}

function mapStateToProps(state) {
  return {
    countryText: getCountryObject(state) ? getCountryObject(state).extract : null
  }
}

export default connect(mapStateToProps, null)(CountryPage)
