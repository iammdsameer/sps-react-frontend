import React from 'react'
import { Table, Input, Button, Space, Typography, Progress } from 'antd'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'
import axios from '../../api/auth.api'

class AttendanceSummary extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    dataSource: [],
    loading: true,
  }

  async componentDidMount() {
    const { data } = await axios.post('users/admin/student-list', {})
    this.setState({ dataSource: data, loading: false })
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              })
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100)
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  handleReset = (clearFilters) => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'ID',
        dataIndex: 'sid',
        key: 'sid',
        width: '20%',
        ...this.getColumnSearchProps('sid'),
      },
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        onFilter: (value, record) => record.level === value,
        filters: [
          {
            text: '4',
            value: '4',
          },
          {
            text: '5',
            value: '5',
          },
          {
            text: '6',
            value: '6',
          },
        ],
      },
      {
        title: 'Modules',
        dataIndex: 'modules',
        key: 'modules',
        sorter: (a, b) => {
          function diff(arr) {
            return arr.reduce((one, two) => one + two, 0)
          }
          return diff(Object.values(a.modules)) - diff(Object.values(b.modules))
        },
        sortDirections: ['ascend', 'descend'],
        width: '40%',
        render: (e) => {
          var view = []
          for (const k in e) {
            view.push(
              <div key={k} style={{ marginBottom: '3px' }}>
                <Typography.Text strong>{k}</Typography.Text>
                <Progress percent={e[k]} strokeColor={e[k] < 40 ? 'red' : ''} />
              </div>
            )
          }
          return view
        },
      },
    ]
    return (
      <Table
        scroll={{ y: '60vh' }}
        columns={columns}
        dataSource={this.state.dataSource}
        loading={this.state.loading}
      />
    )
  }
}

export default AttendanceSummary
