import React, { Component } from 'react'
import {Button, Tree, Icon, Select, Input, Checkbox} from 'antd'
import './App.scss'

let $this = null
export default class App extends Component {

    constructor(props) {
        super(props)
        $this = this
        this.nodeTypes = [
            'text', 'boolean', 'number', 'array', 'type'
        ]

        this.state = {
            nodes:[
                {
                    title : '0-3',
                    key   : '0-3',
                    type  : 'text',
                    name  : 'Top Text',
                    value : 'text value'
                },
                {
                    title : '0-1',
                    key   : '0-1',
                    type  : 'boolean',
                    name  : 'Top Node',
                    value : false
                },
                {
                    title : '0-0',
                    key   : '0-0',
                    type  : 'array',
                    name  : 'array top',
                    value: [
                        {
                            title : '0-0-0',
                            key   : '0-0-0',
                            type  : 'array',
                            name:'array nested',

                            value: [
                                { title: 'text',    key: 'text',    type  : 'text', name:'c',  value : 'c'},
                                { title: 'boolean', key: 'boolean', type  : 'boolean', name:'d', value : false },
                                /*{ title: 'number',  key: 'number',  type  : 'text',    value : 5 },
                                { title: 'array',   key: 'array',   type  : 'array',   value : [] },*/
                                { key: '0-0-0-2', is_button : true }
                            ]
                        },
                        {
                            title : '0-0-1',
                            key   : '0-0-1',
                            type  : 'array',
                            name  : 'array nested',

                            value: [
                                { title: '0-0-1-0', key: '0-0-1-0', type  : 'text', name:'e', value : 'e' },
                                { title: '0-0-1-1', key: '0-0-1-1', type  : 'text', name:'f', value : 'f' },
                                { key: '0-0-1-2', is_button : true }
                            ]
                        },
                        { key: '0-0-2', is_button : true }
                    ]
                },
                { key: '0-2', is_button : true }
            ]
        }
    }

    componentDidMount(){
        this.setState({nodes:JSON.parse(localStorage.nodes||JSON.stringify(this.state.nodes))})
    }

    componentWillUnmount(){
        localStorage.setItem('nodes', JSON.stringify(this.state.nodes))
    }

    componentDidUpdate(){
        localStorage.setItem('nodes', JSON.stringify(this.state.nodes))
    }

    componentDidCatch(){
        localStorage.clear()
    }

    renderNode = node => {
        let renderContent = item => {
            switch(node.type) {
                case 'text':
                    return <Input className='content text' size="small"
                                  defaultValue='value' placeholder="value"
                                  value={node.value} onChange={()=> {}}
                                  onInput={e=> {
                                      node.value = e.target.value
                                      $this.setState({})
                                  }}/>
                case 'boolean':
                    return   <Checkbox checked={node.value} onChange={e=>{
                        node.value = e.target.checked
                        $this.setState({})
                    }}/>
                case 'array':
                    return <span/>
                case 'number':
                case 'type':
                    throw new Error(`${item.type} is not implemented`)
                default:
                {
                    debugger
                    throw new Error(item.type)
                }
            }
        }

        return (
            <div className='node'>
                <Input className='name' size="small"
                       defaultValue='name' placeholder="name" value={node.name}
                       onChange={()=> {}}
                       onInput={e=> {
                           node.name  = e.target.value
                           $this.setState({})
                       }}/>
                <Select value={node.type} defaultValue="text" size='small' style={{ width: 100 }} onChange={e=> {
                    node.type = e
                    switch(node.type) {
                        case 'text':
                            node.value = ''
                            break
                        case 'boolean':
                            node.value = false
                            break
                        case 'number':
                            node.value = 0
                            break
                        case 'array':
                            node.value = [
                                {title: 'name ...', key: `${node.key}0`, type: 'text', value: 'value ...'},
                                { key: `button ${node.key}`, is_button : true }
                            ]
                            break
                        case 'type':
                            break
                    }
                    $this.setState({})
                }}>
                    {this.nodeTypes.map(t=> <Select.Option key={t} value={t}>{t}</Select.Option>)}
                </Select>
                {renderContent(node)}
            </div>
        )
    }

    renderNodes = node => {
        let renderNode = item =>
            item.is_button ?
                <Tree.TreeNode className={'end-handle'} dataRef={item} selectable={false}
                               title={<Button shape='circle' size='small' onClick={()=> {
                                   node.splice(node.length -1, 0, {title: 'name ...', key: node[0].key.toString() + node.length.toString(), type: 'text', value: ''})
                                   $this.setState({})
                               }} icon={'plus'}/>}
                               key={`button ${item.key}`} icon={this.generateIcon.bind(this)}/> :
                <Tree.TreeNode title={this.renderNode(item)} key={item.key} dataRef={item} selectable={false} icon={this.generateIcon.bind(this)} >
                    { item.value && Array.isArray(item.value) ? this.renderNodes(item.value):null}
                </Tree.TreeNode>

        if(Array.isArray(node)) return node.map(el => renderNode(el))
        return renderNode(node)
    }

    generateIcon = node => <Icon type={Array.isArray((node.dataRef || {}).value) ? (node.expanded ? 'minus-square' : 'plus-square') : 'file'}/>

    delete = key => {

    }

    render() {
        return <div className="app">
            <header>
                Hello This Is A Dynamic Property Builder By Halid Cisse
            </header>

            <Tree.DirectoryTree
                multiple
                defaultExpandAll
                showLine
                showIcon>
                {this.renderNodes(this.state.nodes)}
            </Tree.DirectoryTree>
        </div>
    }
}
