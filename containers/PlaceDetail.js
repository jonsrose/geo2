import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getCountryObject} from '../reducers'
import Paper from 'material-ui/lib/paper'
import FlatButton from 'material-ui/lib/flat-button'
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




class PlaceDetail extends Component {
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
      <Paper style={{position: 'absolute', left:0, top:0, right:0, bottom: 0}}>
        <div style={{position: 'absolute', left: 0, top:0, height:44}}>
          <FlatButton label="Back to map" primary={true} onTouchTap={this.mapInfo.bind(this)} />
        </div>
        <div style={{position: 'absolute', top: 44, bottom:0, overflow:'auto', paddingLeft:10, paddingRight:10}} dangerouslySetInnerHTML={this.createMarkup(this.props.countryText)}>
          {this.props.children}
        </div>
      </Paper>
    )
  }
}




export default connect(mapStateToProps, null)(CountryPage)
