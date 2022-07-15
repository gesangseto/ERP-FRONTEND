import { cilArrowLeft, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow } from '@coreui/react'
import { TextInput } from 'src/component'
import routes from 'src/routes'
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom'

const FormUser = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [{ route }] = matchRoutes(routes, location)

  const handleClickBack = () => {
    navigate(-1)
  }
  const handleClickSave = () => {
    console.log('SAVE')
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Validation</strong> <small>Server side</small>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <TextInput
                  title="Name"
                  onChange={(e) => console.log(e.target.value)}
                  value={'14'}
                />
              </CCol>
              <CCol md={6}>
                <TextInput
                  title="Email"
                  onChange={(e) => console.log(e.target.value)}
                  value={'14'}
                />
              </CCol>
              <CCol md={6}>
                <TextInput
                  title="Password"
                  onChange={(e) => console.log(e.target.value)}
                  value={'14'}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <TextInput
                  title="Department"
                  onChange={(e) => console.log(e.target.value)}
                  value={'14'}
                />
              </CCol>
              <CCol md={6}>
                <TextInput
                  title="Section"
                  onChange={(e) => console.log(e.target.value)}
                  value={'14'}
                />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <div className="float-end">
              <CButton size="sm" variant="outline" color="danger" onClick={() => handleClickBack()}>
                <CIcon icon={cilArrowLeft} />
              </CButton>
              &nbsp;
              <CButton
                size="sm"
                variant="outline"
                color="success"
                onClick={() => handleClickSave()}
              >
                <CIcon icon={cilSave} />
              </CButton>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default FormUser
