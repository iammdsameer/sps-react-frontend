import React from 'react'
import { Comment, Avatar, Form, Button, List, Input } from 'antd'
import moment from 'moment'
import axios from '../api/auth.api'

const { TextArea } = Input

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'notes' : 'note'}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
)

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={2} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
)

class Counselled extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  state = {
    comments: [],
    submitting: false,
    value: '',
  }

  async componentDidMount() {
    const { data } = await axios.post('users/admin/fetch-comments', {
      sid: this.props.data.sid,
    })
    // console.log(data.result.comments)
    if (data.result && data.result.comments) {
      this.setState({ comments: data.result.comments })
    }
  }

  handleSubmit = async () => {
    if (!this.state.value) {
      return
    }

    this.setState({
      submitting: true,
    })

    await axios.post('users/admin/add-comment', {
      sid: this.props.data.sid,
      comments: {
        author: JSON.parse(localStorage.getItem('user')).name,
        avatar:
          'https://heraldcollege.edu.np/wp-content/uploads/2016/03/favicon-96x96.png',
        content: this.state.value,
        datetime: moment(new Date()).format('MMMM Do YYYY, h:mm a'),
      },
    })
    this.setState({
      submitting: false,
      value: '',
      comments: [
        ...this.state.comments,
        {
          author: JSON.parse(localStorage.getItem('user')).name,
          avatar:
            'https://heraldcollege.edu.np/wp-content/uploads/2016/03/favicon-96x96.png',
          content: this.state.value,
          datetime: moment(new Date()).format('MMMM Do YYYY, h:mm a'),
        },
      ],
    })
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  render() {
    const { comments, submitting, value } = this.state
    return (
      <>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          avatar={
            <Avatar
              src="https://heraldcollege.edu.np/wp-content/uploads/2016/03/favicon-96x96.png"
              alt="Sameer"
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </>
    )
  }
}

export default Counselled
