import { cilMagnifyingGlass, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

// routes config

const exampleColumns = [
  {
    key: 'id',
    label: '#',
    _props: { scope: 'col', color: 'primary' },
  },
  {
    key: 'class',
    _props: { scope: 'col' },
  },
  {
    key: 'heading_1',
    label: 'Heading',
    _props: { scope: 'col' },
  },
  {
    key: 'id',
    label: 'Action',
    action: ['update', 'read', 'delete'],
  },
]
const exampleItems = [
  {
    id: 1,
    class: 'Mark',
    heading_1: 'Otto',
    _cellProps: { id: { scope: 'row' } },
    heading_2: '@mdo',
  },
  {
    id: 2,
    class: 'Jacob',
    heading_1: 'Thornton',
    heading_2: '@fat',
    _cellProps: { id: { scope: 'row' } },
  },
  {
    id: 3,
    class: 'Larry the Bird',
    heading_2: '@twitter',
    _cellProps: { id: { scope: 'row' }, class: { colSpan: 2 } },
  },
]

const buttonSetting = {
  create: <CIcon key={0} icon={cilPencil} className="text-dark" />,
  read: <CIcon key={1} icon={cilMagnifyingGlass} className="text-dark" />,
  update: <CIcon key={2} icon={cilPencil} className="text-dark" />,
  delete: <CIcon key={3} icon={cilTrash} className="text-dark" />,
}
const buttonColorSetting = {
  create: 'success',
  read: 'info',
  update: 'warning',
  delete: 'danger',
}

const listLimitPage = [10, 20, 50, 100]

const Table = (props) => {
  const {
    columns = exampleColumns,
    items = exampleItems,
    onPageChange,
    onClickAction,
    totalPage = 1,
    activePage = 1,
  } = props
  const [pagination, setPagination] = useState({
    activePage: activePage,
    limitPage: 10,
  })

  const handleClickPage = (i) => {
    let paging = { ...pagination, activePage: i }
    setPagination({ ...paging })
  }

  const handleChangeGoto = (e) => {
    let val = e.target.value
    if (e.type == 'blur' || e.key == 'Enter') {
      if (val > totalPage) {
        return toast.error(`Maximal page is ${totalPage}`)
      } else if (val < 1) {
        val = 1
      }
      setPagination({ ...pagination, activePage: val })
    }
  }
  const handleClickAction = (data, action) => {
    console.log(`onClickAction(${data},${action})`)
    if (onClickAction) {
      onClickAction(data, action)
    }
  }

  useEffect(() => {
    console.log(`onPageChange(${JSON.stringify(pagination)})`)
    if (onPageChange) {
      onPageChange(pagination)
    }
  }, [pagination])

  const renderCell = (item, key, index) => {
    if (key.hasOwnProperty('action') && Array.isArray(key['action'])) {
      return (
        <CTableDataCell key={index}>
          {key.action.map((it, idx) => {
            return (
              <span key={`${index}${idx}`}>
                <CButton
                  size="sm"
                  variant="outline"
                  color={buttonColorSetting[it]}
                  onClick={() => handleClickAction(item[key.key], it)}
                >
                  {buttonSetting[it] && buttonSetting[it]}
                </CButton>
                &nbsp;
              </span>
            )
          })}
        </CTableDataCell>
      )
    } else {
      return (
        <CTableDataCell key={index}>
          {key.color ? <CBadge color="primary">{item[key.key]}</CBadge> : item[key.key]}
        </CTableDataCell>
      )
    }
  }

  const renderRow = (item, index) => {
    return (
      <CTableRow key={index}>{columns.map((key, idxs) => renderCell(item, key, idxs))}</CTableRow>
    )
  }

  return (
    <div>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {columns.map((item, index) => {
              return (
                <CTableHeaderCell key={index} scope="col">
                  {item.label}
                </CTableHeaderCell>
              )
            })}
          </CTableRow>
        </CTableHead>
        <CTableBody>{items.map((item, idx) => renderRow(item, idx))}</CTableBody>
      </CTable>
      {/* PAGINATION */}
      <CRow>
        <CCol lg={4} sm={12} md={4}>
          <CPagination aria-label="Page navigation example" size="sm" className="float-start">
            <div>
              Page {pagination.activePage} of {totalPage}
            </div>
          </CPagination>
        </CCol>
        <CCol lg={8} sm={12} md={8}>
          <CRow className="float-end">
            <CCol lg={8} sm={8} md={8}>
              <CInputGroup size="sm">
                <CInputGroupText>Got to page</CInputGroupText>

                <CFormInput
                  defaultValue={pagination.activePage}
                  type="number"
                  min={1}
                  max={totalPage}
                  onKeyDown={(e) => handleChangeGoto(e)}
                  onBlur={(e) => handleChangeGoto(e)}
                />
                <CDropdown variant="input-group">
                  <CDropdownToggle color="secondary" variant="outline">
                    {pagination.limitPage}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {listLimitPage.map((it, index) => {
                      return (
                        <CDropdownItem
                          key={index}
                          type="button"
                          disabled={it == pagination.limitPage}
                          onClick={() => setPagination({ ...pagination, limitPage: it })}
                        >
                          {it}
                        </CDropdownItem>
                      )
                    })}
                  </CDropdownMenu>
                </CDropdown>
                <CInputGroupText>Per Page</CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol lg={4} sm={4} md={4}>
              <CPagination aria-label="Page navigation example" size="sm" className="float-end">
                <CPaginationItem
                  aria-label="Previous"
                  type="button"
                  disabled={pagination.activePage == 1}
                  onClick={() => handleClickPage(1)}
                >
                  <span aria-hidden="true">&laquo;</span>
                </CPaginationItem>
                <CPaginationItem
                  aria-label="Previous"
                  type="button"
                  disabled={pagination.activePage == 1}
                  onClick={() => handleClickPage(pagination.activePage - 1)}
                >
                  <span aria-hidden="true">&larr;</span>
                </CPaginationItem>
                <CPaginationItem disabled>{pagination.activePage}</CPaginationItem>
                <CPaginationItem
                  aria-label="Next"
                  type="button"
                  disabled={pagination.activePage == totalPage}
                  onClick={() => handleClickPage(pagination.activePage + 1)}
                >
                  <span aria-hidden="true">&rarr;</span>
                </CPaginationItem>
                <CPaginationItem
                  aria-label="Next"
                  type="button"
                  disabled={pagination.activePage == totalPage}
                  onClick={() => handleClickPage(totalPage)}
                >
                  <span aria-hidden="true">&raquo;</span>
                </CPaginationItem>
              </CPagination>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </div>
  )
}

export default Table
