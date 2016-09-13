import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getPanoramioPhotoObject } from '../reducers'
import LeftNavCommon from './LeftNavCommon'
import FlatButton from 'material-ui/FlatButton'
import { navToPanoramioPhoto } from '../actions'


class PanoramioPhotoPage extends Component {

  createMarkup(text) {
    return {__html: text}
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { panoramioPhoto } = this.props

    if (panoramioPhoto) {
      const { prev, next } = panoramioPhoto

      let imageUrl = panoramioPhoto.photoFileUrl

      return (
            <div>
              <div>
                <LeftNavCommon />
                {panoramioPhoto.prev && <FlatButton label="Prev" primary={true} onTouchTap={this.props.navToPanoramioPhoto.bind(this, prev.id, prev.index )}/>}
                {!panoramioPhoto.prev && <FlatButton label="Prev" disabled={true}/>}

                {panoramioPhoto.next && <FlatButton label="Next" primary={true} onTouchTap={this.props.navToPanoramioPhoto.bind(this, next.id, next.index )}/>}
                {!panoramioPhoto.next && <FlatButton label="Next" disabled={true}/>}
              </div>
              <img className={'responsive-image'} src={imageUrl} />
              <div style={{padding:5}} dangerouslySetInnerHTML={this.createMarkup(this.props.panoramioPhoto.title)} />
            </div>
      )
    } else {
      return null
    }
  }
}

PanoramioPhotoPage.propTypes = {
  panoramioPhoto: PropTypes.object,
  coordinatesString: PropTypes.string,
  navToPanoramioPhoto: PropTypes.func,
  zoomed: PropTypes.bool
}

function mapStateToProps(state) {
  return {
    panoramioPhoto: getPanoramioPhotoObject(state),
    coordinatesString: state.coordinatesString,
    zoomed: state.zoom
  }
}

export default connect(mapStateToProps, { navToPanoramioPhoto })(PanoramioPhotoPage)
