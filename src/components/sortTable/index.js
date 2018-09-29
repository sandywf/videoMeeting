/**
 * Higher-order component - this component works is drag-replace sort
 * change to the component react-sortable(https://www.npmjs.com/package/react-sortable)
 * modify by shr 2018-07-20
 * */

import React from 'react'

/**
 * @param {array} items
 * @param {number} indexFrom
 * @param {number} indexTo
 * @returns {array}
 */
function swapArrayElements(items, indexFrom, indexTo) {
  var item = items[indexTo]
  items[indexTo] = items[indexFrom]
  items[indexFrom] = item
  return items
}

let draggingIndex = null
let passDomList = []

export function SortableComposition(Component) {

  return class Sortable extends React.Component {

    sortEnd = e => {
      e.preventDefault()

      const overEl = e.currentTarget
      const indexDragged = Number(overEl.dataset.id)

      let { items } = this.props
      let lastId = passDomList[passDomList.length - 1]

      if (indexDragged !== lastId) {
        items = swapArrayElements(items, lastId, indexDragged)
        draggingIndex = lastId
        this.props.onSortItems(items)
      }

      // 完成之后 清空数据
      draggingIndex = null
      passDomList = []
    }

    dragEnter = e => {
      e.preventDefault();

      const overEl = e.currentTarget
      const indexDragged = Number(overEl.dataset.id)

      // 每次碰撞将当前元素的data-id push到passDom中
      passDomList.push(indexDragged)
    }

    render() {
      let newProps = Object.assign({}, this.props)
      delete newProps.onSortItems
      const { sortId, ...props } = newProps
      return (
        <Component
          draggable
          onDragEnter={this.dragEnter}
          onDragEnd={this.sortEnd}
          data-id={sortId}
          {...props}
        />
      )
    }
  }
}
