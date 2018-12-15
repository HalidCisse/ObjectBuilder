import React, { Component } from 'react'
import {Button, Tree, Icon, Select, Input, Checkbox} from 'antd'
import './App.scss'

let $this = null
export default class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            nodes:[{
                title : '0-0',
                key   : '0-0',
                type  : 'text',
                value : 'blah blah'

                //type  : 'array',
                /*value: [
                    {
                        title : '0-0-0',
                        key   : '0-0-0',
                        type  : 'array',

                        value: [
                            { title: 'text',    key: 'text',    type  : 'text',    value : 'blah blah'},
                            { title: 'boolean', key: 'boolean', type  : 'boolean', value : false },
                            /!*{ title: 'number',  key: 'number',  type  : 'text',    value : 5 },
                            { title: 'array',   key: 'array',   type  : 'array',   value : [] },*!/
                            { key: '0-0-0-2', is_button : true }
                        ]
                    },
                    {
                        title : '0-0-1',
                        key   : '0-0-1',
                        type  : 'array',

                        value: [
                            { title: '0-0-1-0', key: '0-0-1-0', type  : 'text', value : '' },
                            { title: '0-0-1-1', key: '0-0-1-1', type  : 'text', value : '' },
                            { key: '0-0-1-2', is_button : true }
                        ]
                    },
                    { key: '0-0-2', is_button : true }
                ]*/
            },
                {
                    title : '0-1',
                    key   : '0-1',
                    type  : 'boolean',
                    value : false
                }
            ]
        }

        this.nodeTypes = [
            'text', 'boolean', 'number', 'array', 'type'
        ]
        $this = this
    }

    componentDidMount(){
        this.setState({nodes:localStorage.nodes})
    }

    componentWillUnmount(){
        localStorage.setItem('nodes', JSON.stringify(this.state.nodes))
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
                    throw new Error(item.type)
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

    delete = key => {

    }

    onSelect = (selectedKeys, info) => {
        //console.log('selected', selectedKeys, info)
    }

    generateIcon = node => {
        const {expanded, children, dataRef:{value, type, is_button}={}} = node
        // console.log('generateIcon', node)

        /*if(Array.isArray(value) || Array.isArray(children) || type === 'array'){
            debugger
        }*/

        return <Icon type={Array.isArray(value) ? (expanded ? 'minus-square' : 'plus-square'):'file'} />
    }

    onExpand = expandedKeys => {
        /*this.setState({
            expandedKeys,
            autoExpandParent: false
        })*/
    }

    onNodeLoad = (loadedKeys, {event, node}) =>{
        console.log('onNodeLoad')
        debugger
    }

    renderNodes = node => {
        let renderNode = item =>
            item.is_button ?
                <Tree.TreeNode className={'end-handle'} dataRef={item} selectable={false}
                               title={<Button shape='circle' size='small' onClick={()=> {
                                   node.splice(node.length -1, 0, {title: 'name ...', key: node[0].key.toString() + node.length.toString(), type: 'text', value: 'value ...'})
                                   $this.setState({})
                               }} icon={'plus'}/>}
                               key={`button ${item.key}`} icon={this.generateIcon.bind(this)}/> :
                <Tree.TreeNode title={this.renderNode(item)} key={item.key} dataRef={item} selectable={false} icon={this.generateIcon.bind(this)} >
                    { item.value && Array.isArray(item.value) ? this.renderNodes(item.value):null}
                </Tree.TreeNode>

        if(Array.isArray(node)) return node.map(el => renderNode(el))
        return renderNode(node)
    }

    render() {
        const {nodes, expandedKeys} = this.state
        return (
            <div className="app">
                <header>
                    Hello
                </header>

                <Tree.DirectoryTree
                    multiple
                    defaultExpandAll
                    showLine
                    showIcon
                    onLoad = {this.onNodeLoad}
                    onSelect={this.onSelect}
                    onExpand={this.onExpand}>
                    {this.renderNodes(nodes)}
                </Tree.DirectoryTree>
            </div>
        )
    }
}
