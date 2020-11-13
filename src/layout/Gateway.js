import React from 'react'
import { Row, Col } from 'antd'

import brandLogo from '../assets/brand.png'
import './Gateway.css'

const Gateway = ({ children }) => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col lg={8} xs={24} md={12}>
        <img
          width={250}
          src={brandLogo}
          alt="brand-logo"
          className="brand-logo"
        />
        {children}
      </Col>
    </Row>
  )
}

export default Gateway
