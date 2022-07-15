import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'

import { cilCircle } from '@coreui/icons'

import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { CBadge } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { name, badge, icon, ...rest } = item
    return (
      <CNavItem
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </CNavItem>
    )
  }

  // useEffect(() => {
  //   console.log('items=>', items)
  // }, [items])

  const navGroup = (item, index) => {
    const { name, icon, to, ...rest } = item
    return (
      <CNavGroup
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </CNavGroup>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
