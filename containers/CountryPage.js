import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getCountryObject} from '../reducers'
import { browserHistory } from 'react-router'

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
  navigateToMap(coordinatesString) {
    console.log('navigateToMap')
    browserHistory.push(`/coordinates/${coordinatesString}`)
  }

  mapInfo() {
    this.navigateToMap(this.props.coordinatesString)
  }


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
        <div dangerouslySetInnerHTML={this.createMarkup(this.props.countryText)} />
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
