import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useEffect, useState } from 'react'
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FilterTable, Table } from 'src/component'
import { getUser } from 'src/resource/administrator'
import routes from 'src/routes'

const ListUser = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [{ route }] = matchRoutes(routes, location)
  const [listTable, setListTable] = useState([])
  const [pagination, setPagination] = useState({
    activePage: 1,
    limitPage: 10,
  })
  const [totalPage, setTotalPage] = useState(1)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    let _data = await getUser(pagination)
    if (_data) {
      setTotalPage(_data.grand_total ? _data.grand_total : 1)
      setListTable([..._data.data])
    }
  }

  useEffect(() => {
    loadData()
    console.log('pagination', pagination)
  }, [pagination])

  const handleClickAdd = () => {
    navigate(`${route.path}/create`)
  }
  const handleClickRow = (id, action) => {
    if (action == 'delete') {
      return toast.success(`Delete id ${id} successfully`)
    }
    navigate(`${route.path}/${action}/${id}`)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Default</strong>
            <span className="float-end">
              <CButton size="sm" variant="outline" color="success" onClick={() => handleClickAdd()}>
                <CIcon key={0} icon={cilPlus} className="text-dark" />
              </CButton>
            </span>
          </CCardHeader>
          <CCardBody>
            <FilterTable onChange={(objFilter) => setPagination({ ...pagination, ...objFilter })} />
            <Table
              columns={fields()}
              items={listTable}
              activePage={pagination.activePage}
              totalPage={totalPage}
              onPageChange={(page) => setPagination({ ...page })}
              pageActive={7}
              onClickAction={(id, action) => handleClickRow(id, action)}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ListUser

const fields = () => {
  return [
    {
      key: 'user_name',
      label: 'Name',
    },
    {
      key: 'user_email',
      label: 'Email',
    },
    {
      key: 'user_department_name',
      label: 'Department',
    },
    {
      key: 'user_section_name',
      label: 'Section',
    },
    {
      key: 'user_id',
      label: 'Action',
      action: ['update', 'read', 'delete'],
    },
  ]
}
