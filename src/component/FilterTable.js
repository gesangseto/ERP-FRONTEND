import { CCol, CFormInput, CInputGroup, CInputGroupText, CRow } from '@coreui/react'
import { useEffect, useState } from 'react'

const FilterTable = (props) => {
  const { onChange } = props
  const [filter, setFilter] = useState({
    search: '',
  })

  const handleSubmitFilter = () => {
    console.log(filter)
  }

  const handleSubmitSearch = (e) => {
    let val = e.target.value
    if (e.type == 'blur' || e.key == 'Enter') {
      setFilter({ ...filter, search: val })
    }
  }

  useEffect(() => {
    if (onChange) {
      onChange(filter)
    }
  }, [filter])

  return (
    <div>
      <CRow>
        <CCol lg={3} md={3} sm={3}>
          {/* <CFormFloating size="sm">
            <CFormInput type="email" id="floatingInput" placeholder="name@example.com" />
            <CFormLabel htmlFor="floatingInput">Email address</CFormLabel>
          </CFormFloating> */}
          <CInputGroup size="sm">
            <CInputGroupText>Search</CInputGroupText>
            <CFormInput
              onKeyDown={(e) => handleSubmitSearch(e)}
              onBlur={(e) => handleSubmitSearch(e)}
            />
          </CInputGroup>
        </CCol>
      </CRow>
    </div>
  )
}

export default FilterTable
