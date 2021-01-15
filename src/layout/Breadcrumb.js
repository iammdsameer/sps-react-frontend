import React from 'react'
import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useLocation, Link } from 'react-router-dom'

const BreadCrumb = () => {
  const location = useLocation()
  const breadCrumbView = () => {
    const { pathname } = location
    const pathnames = pathname.split('/').filter((i) => i)
    return (
      <Breadcrumb>
        {pathnames.length > 0 ? (
          <Breadcrumb.Item>
            <Link to="/admin">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
        )}
        {pathnames.map((n, i) => {
          const routeTo = `/${pathnames.slice(0, i + 1).join('/')}`
          const isLast = i === pathnames.length - 1
          return isLast ? (
            <Breadcrumb.Item key={i}>
              {n.charAt(0).toUpperCase() + n.slice(1)}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item key={i}>
              <Link to={`${routeTo}`}>
                {n.charAt(0).toUpperCase() + n.slice(1)}
              </Link>
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    )
  }
  return breadCrumbView()
}

export default BreadCrumb
