import React, { Component } from 'react'
import actions from '../redux/actions'
import SvgSaver from 'svgsaver'
import moment from 'moment'

import Background from './Background'

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.canvas = this
  }

  componentDidMount() {
    this.width = window.innerWidth - 300 - 200
    this.height = window.innerHeight

    const object = Snap(this.width, this.height).remove();
    object.appendTo(document.querySelector('#workspace'));
    Object.assign(this, object)
    const keys = Object.keys(Object.getPrototypeOf(object))
    for (let key of keys) {
      this[key] = object[key]
    }

    this.attr({ id: 'canvas' })

    this.background = new Background(this)

    this.mousedown(this.onMouseDown.bind(this))
    this.mousemove(this.onMouseMove.bind(this))
    this.mouseup(this.onMouseUp.bind(this))
    this.dblclick(this.onDoubleClick.bind(this))

  }

  onMouseDown(event) {
    event.preventDefault()
    this.updateMousePosition(event, true)

    if (this.props.active) return false

    if (this.props.mode === 'select' && this.props.path) {
      this.props.path.hideSelectors()
      if (this.props.path.hideControls) {
        this.props.path.hideControls()
      }
      this.updateState({ path: null })
      return false
    }

    if (this.props.mode !== 'path') return false

    this.updateState({ active: this, drawing: true })

    if (!this.props.path) {
      const path = new Path(this)
      this.updateState({ path: path })
    }
    this.props.path.initSegment()
  }

  onMouseMove(event) {
    event.preventDefault()
    this.updateMousePosition(event)

    if (this.props.active && this.props.active !== this) {
      this.props.active.onMouseMove(event)
      return false
    }

    if (!this.props.drawing) {
      return false
    }
    if (this.props.active === null) {
      this.props.path.drawDraft()
    }
    if (this.props.active === this) {
      this.props.path.updateAnchor()
    }
  }

  onMouseUp(event) {
    event.preventDefault()
    this.updateMousePosition(event)

    if (this.props.active && this.props.active !== this) {
      this.props.active.onMouseUp(event)
      this.updateState({ active: null })
      return false
    }

    if (this.props.active === this) {
      this.updateState({ active: null })
      this.props.path.addSegment()
    }
  }

  onDoubleClick(event) {
    event.preventDefault()
    this.updateMousePosition(event)

    switch (this.props.mode) {
      case 'select':
        break
      case 'path':
        this.props.path.finish()
        break
      default:
        break
    }

    this.updateState({
      active: null,
      drawing: false,
      mode: 'select',
      // path: null
    })
  }

  updateMousePosition(event, start = false) {
    const m = (Snap.matrix(this.node.getScreenCTM())).invert()
    const ex = event.clientX
    const ey = event.clientY
    const point = {
      x: m.x(ex, ey) - this.props.offsetX,
      y: m.y(ex, ey) - this.props.offsetY
    }
    if (start) {
      this.updateState({ point: point, start: point })
    } else {
      this.updateState({ point: point })
    }
  }

  updateState(state) {
    this.props.store.dispatch(actions.updateState(state))
  }


  render() {
    return (
      <div>
        <div id="workspace"></div>
        <div id="save-buttons" className="ui buttons">
        </div>
      </div>
    )
  }
}

export default Canvas