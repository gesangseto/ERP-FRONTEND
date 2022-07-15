import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { TextInput } from 'src/component'
import { loginUser, menuUser } from 'src/resource/oauth'

const requiredData = {
  user_name: false,
  user_password: false,
}

const Login = () => {
  let navigate = useNavigate()
  // const history = useHistory()
  const [formData, setFormData] = useState({
    user_name: '',
    user_password: '',
  })
  const [error, setError] = useState({ ...requiredData })
  const [initialLoad, setInitialLoad] = useState(true)
  const [loading, setLoading] = useState(false)

  const loginApi = async () => {
    setLoading(true)
    if (await loginUser(formData)) {
      let profile = JSON.parse(localStorage.getItem('profile'))
      await menuUser({ user_section_id: profile.section_id })
      toast.success(`Welcome ${profile.user_name}`)
      navigate(`/dashboard`)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!initialLoad) validation()
    console.log(formData)
  }, [formData])

  const validation = () => {
    let is_error = false
    let err = { ...requiredData }
    for (const it in requiredData) {
      if (!formData[it]) {
        is_error = true
        err[it] = `${it} is required!`
      }
    }
    setError({ ...err })
    if (is_error) {
      return false
    }
    return true
  }

  const handleClickLogin = () => {
    console.log(formData)
    setInitialLoad(false)
    if (!validation()) return
    loginApi()
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <TextInput
                      title="User"
                      grouping={'true'}
                      invalid={error.user_name}
                      value={formData.user_name}
                      onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                    />
                    <TextInput
                      title="Password"
                      grouping={'true'}
                      invalid={error.user_password}
                      value={formData.user_password}
                      onChange={(e) => setFormData({ ...formData, user_password: e.target.value })}
                    />
                    <CRow className="mt-3">
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={() => handleClickLogin()}
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
