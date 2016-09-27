import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getLocalityObject} from '../reducers'
import LeftNavCommon from './LeftNavCommon'
import FlatButton from 'material-ui/FlatButton'
import { navTolocality } from '../actions'

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
      const {locality} = this.props

      const { prev, next } = locality

      return (
        <div>
          <div>
            <LeftNavCommon />

            {locality.prev && <FlatButton label="Prev" primary={true} onTouchTap={this.props.navTolocality.bind(this, prev.id, prev.index )}/>}
            {!locality.prev && <FlatButton label="Prev" disabled={true}/>}

            {locality.next && <FlatButton label="Next" primary={true} onTouchTap={this.props.navTolocality.bind(this, next.id, next.index )}/>}
            {!locality.next && <FlatButton label="Next" disabled={true}/>}


          </div>
          {this.props.localityThumbnail &&
            <a href={link} target="_blank"><img className={'responsive-image'} src={this.props.localityThumbnail.source} /></a>
          }
          <div>
            <a href={link} target="_blank">Go to wikipedia page</a>		
          </div>
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
  localityThumbnail: PropTypes.object,
  coordinatesString: PropTypes.string,
  navTolocality: PropTypes.func
}

function mapStateToProps(state) {
  return {
    locality: getLocalityObject(state),
    localityText: getLocalityObject(state) ? getLocalityObject(state).extract : null,
    localityThumbnail: getLocalityObject(state) ? getLocalityObject(state).thumbnail : null,
    coordinatesString: state.coordinatesString
  }
}

export default connect(mapStateToProps, { navTolocality })(LocalityPage)
