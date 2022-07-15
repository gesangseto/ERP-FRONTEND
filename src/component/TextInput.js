import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import React from 'react'

// routes config

const TextInput = (props) => {
  const { invalid, title, grouping } = props

  return (
    <div>
      {grouping == true ? (
        <CInputGroup className="mt-3">
          <CInputGroupText>{title ?? 'No Title'}</CInputGroupText>
          <CFormInput invalid={invalid ? true : false} {...props} />
        </CInputGroup>
      ) : (
        <CFormInput
          label={title ? title : 'No Title'}
          invalid={invalid ? true : false}
          {...props}
        />
      )}
      {invalid ? (
        <span size="sm" style={{ fontSize: 12, color: 'red' }}>
          {invalid}
        </span>
      ) : null}
    </div>
  )
}

export default TextInput
