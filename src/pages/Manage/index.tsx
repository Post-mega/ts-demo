// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { PureComponent, useState, useEffect } from 'react';
import { Button, Card, Select, Divider, Spin, List, Icon, Popover, Avatar, Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { getAllBusinessLine } from '@/services/api'
import styles from './index.less';

const { Option } = Select;
const { Meta } = Card;
const { confirm } = Modal;

export interface ManageProps {
  form: FormComponentProps['form'];
};

export interface ManageState {
  businessLines: Array<bus>,
  loading: boolean,
  authority: boolean,
  modules: Array<mod>,
  current_id: number,
  curModuleId: number,
  isCreate: boolean,
  visible: boolean,
  fetching: boolean,
  personData: number[],
};

type bus = {
  name: string,
  business_line_id: number
}

type mod = {
  id: number,
  name: string,
  owners: Array<ownerType>
};

type ownerType = {
  name: string,
  avatar_url: string
};

class ModuleManage extends PureComponent<ManageProps, ManageState> {
  state: ManageState = {
    loading: false,
    authority: true,
    isCreate: true,
    visible: false,
    fetching: true,
    current_id: 1,
    curModuleId: 1,
    personData: [],
    businessLines: [{
      name: 'Lark',
      business_line_id: 1
    }, {
      name: 'People',
      business_line_id: 2
    }, {
      name: 'Security',
      business_line_id: 3
    }, {
      name: 'Docs',
      business_line_id: 4
    }],
    modules: [{
      id: 1,
      name: 'test',
      owners: [{
        name: 'yang',
        avatar_url: 'https://sf3-ttcdn-tos.pstatp.com/img/lark.avatar/2e2f2000cf331d0ef6dc1~72x72.png'
      }]
    }, {
      id: 2,
      name: 'test2',
      owners: [{
        name: 'yang',
        avatar_url: 'https://sf3-ttcdn-tos.pstatp.com/img/lark.avatar/2e2f2000cf331d0ef6dc1~72x72.png'
      }]
    }, {
      id: 3,
      name: 'test3',
      owners: [{
        name: 'yang',
        avatar_url: 'https://sf3-ttcdn-tos.pstatp.com/img/lark.avatar/2e2f2000cf331d0ef6dc1~72x72.png'
      }]
    }, {
      id: 4,
      name: 'test4',
      owners: [{
        name: 'yang',
        avatar_url: 'https://sf3-ttcdn-tos.pstatp.com/img/lark.avatar/2e2f2000cf331d0ef6dc1~72x72.png'
      }]
    }],
  };

  componentDidMount() {
    // 获取所有的业务线
    getAllBusinessLine().then(e => {
      console.log(e, process)
      // this.setState({
      //   businessLines: e.data.data,
      //   loading: false
      // })
    })
    // 初始化时请求业务线为 1 的所有模块
    let { current_id } = this.state
    this.selectModule(current_id)
  }

  controlModal = () => {
    this.setState(prevState => ({ visible: !prevState.visible, isCreate: true }))
    this.props.form.resetFields()
  }

  selectModule = (bid: number) => {
    console.log('selectModule')
  }

  delete = (id: number, current_id: number) => {
    confirm({
      title: formatMessage({ id: 'manage.delete.title' }),
      content: formatMessage({ id: 'manage.delete.sub' }),
      onOk: () => {
        // deleteModule(current_id, id).then(e => {
        //   this.selectModule(current_id)
        // })
      },
    });
  }

  edit = (id: number, name: string, owners: Array<ownerType>) => {
    // console.log('edit')
    this.controlModal() // show modal
    this.setState({
      isCreate: false,
      curModuleId: id // 设置当前模块id
    })
    this.props.form.setFieldsValue({
      name: name,
      owners: owners.map(v => v.name)
    })
  }

  handleOk = () => {

  }

  handleChange = () => {
    this.setState({
      personData: [],
      fetching: false,
    });
  };

  // 渲染模块内的管理者
  renderOwners = (data: Array<ownerType>) => data && data.map((person, index, { length }) => (
    <Popover key={index} content={person.name} >
      <Avatar src={person.avatar_url} />
      {index < length - 1 && <Divider type='vertical' />}
    </Popover>
  ))

  // 根据获取的业务线，渲染选项
  renderList = (data: Array<bus>) => data && data.map(v => (
    <Option key={v.name} value={v.business_line_id}>{v.name}</Option>
  ))

  // 根据 personData 数据渲染选项
  renderOptions = (data: Array<ownerType>) => data && data.map(v => (
    <Option key={v.name} value={v.name}>{v.name}</Option>
  ))

  // 渲染业务线内所有的模块，以卡片形式展示
  renderModules = ({ id, name, owners }: mod) => {
    let { current_id, businessLines, loading, authority } = this.state
    return (
      <List.Item>
        <Card
          hoverable
          loading={loading}
          key={id}
          title={businessLines[current_id - 1].name}
          // className={style.card}
          actions={authority && [
            <span key='1' onClick={() => this.delete(id, current_id)}><Icon type="delete" />{formatMessage({ id: 'manage.delete' })}</span>,
            <span key='2' onClick={() => this.edit(id, name, owners)}><Icon type="edit" />{formatMessage({ id: 'manage.edit' })}</span>,
          ]}
        >
          <Meta
            description={<h2>{name}</h2>}
            title={<h5>{formatMessage({ id: 'manage.moduleName' })}</h5>}
          />
          <Divider />
          {this.renderOwners(owners)}
        </Card>
      </List.Item>
    )
  }

  render() {
    let { businessLines, loading, modules, isCreate, visible, fetching, authority, personData } = this.state
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Card className={styles.main}>
        <div className={styles.control}>
          <div>
            {formatMessage({ id: 'manage.selectBL' })}
            <Select style={{ width: 120, marginRight: 20 }} defaultValue={1} onChange={this.selectModule}>
              {this.renderList(businessLines)}
            </Select>
          </div>
          {
            authority &&
            <Button type="primary" icon="plus" onClick={this.controlModal} >
              {formatMessage({ id: 'manage.create' })}
            </Button>
          }
        </div>
        <Divider />
        { // 模块列表，使用卡片形式展现
          loading ?
            <Spin size="large" style={{ padding: 20 }} /> :
            <List
              grid={{ gutter: 20, column: 4 }}
              dataSource={modules}
              renderItem={this.renderModules}
            />
        }
        <Modal
          // title={formatMessage({ id: isCreate ? '' : '' })}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.controlModal}
        >
          <Form leyout={formItemLayout}>
            <Form.Item label="模块名称" >
              {getFieldDecorator('name')(<Input placeholder="Input the module name" />)}
            </Form.Item>
            <Form.Item label="设置管理员" >
              {getFieldDecorator('owners')(
                <Select
                  showSearch
                  allowClear
                  filterOption={false}
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Please select manager"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  // onSearch={this.fetchUser}
                  onBlur={this.handleChange}
                  onChange={this.handleChange}
                >
                  {this.renderOptions(personData)}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    )
  };
};

export default Form.create<ManageProps>()(ModuleManage);