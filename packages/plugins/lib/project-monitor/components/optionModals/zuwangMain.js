import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { sort, Request } from '@peace/utils';
import { ApiTable } from '$utils';
import {
  Spin, Modal, Card, Input, Button, message, Menu, Dropdown, Tree,
} from 'antd';
import Ps from 'perfect-scrollbar';
import createG6 from '../chart/editMap';

const Tree_ = createG6((tree) => {
  tree.render();
});

class ZuwangMain extends Component {
  constructor(props) {
    super(props);
    this.disCheckedKeys = [];
    this.g6Tree = null;
    this.g6TreeData = null;
    this.lastClickNodeKey = null;
    this.intervalLinkStatus = null;
    this.state = {
      isGetLinkStateDone: false,
      devicesLinkState: null,
      treeNodeCheckedKeys: { checked: [], halfChecked: [] },
      currSDids: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.getThingsLinkStatus();
    this.intervalLinkStatus = setInterval(() => {
      this.getThingsLinkStatus(true);
    }, 4000);
  }

  getThingsLinkStatus = (isCycle = false) => {
    const { isEdit, struct } = this.props;
    const { isGetLinkStateDone } = this.state;
    const { iotaThingId } = struct;
    // let data = this.props.data;
    if (!isEdit && iotaThingId) {
      const url = ApiTable.getIotaThingsLlinkStatus.replace('{iotaThingId}', iotaThingId);
      Request.get(url).then((res) => {
        if (res.devices.length >= 0) {
          this.setState({
            devicesLinkState: res.devices,
          });
        } else {
          clearInterval(this.intervalLinkStatus);
        }
        if (!isGetLinkStateDone) {
          this.setState({
            isGetLinkStateDone: true,
          });
        }
      }, (error) => {
        if (!isGetLinkStateDone) {
          message.warning('设备在线状态获取失败');
          this.setState({
            isGetLinkStateDone: true,
          });
        }
      });
    }
  };

  componentDidMount() {
    new Ps('#deviceTree', { suppressScrollX: true });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { treeNodeCheckedKeys, currSDids } = this.state;
    const {
      width, height, g6TreeDirection, isEdit,
    } = nextProps;
    const that = this;
    if (!this.intervalLinkStatus && !isEdit) {
      this.intervalLinkStatus = setInterval(() => { that.getThingsLinkStatus(true); }, 4000);
    } else if (this.intervalLinkStatus && isEdit) {
      clearInterval(this.intervalLinkStatus);
    }
    if (nextProps.data) {
      const nextStructInfo = Immutable.fromJS(nextProps.data).toJS();
      const nextDeviceIds = Object.keys(nextStructInfo);
      if (currSDids.length != nextDeviceIds.length) {
        const nextSDids = [];
        for (const id of nextDeviceIds) {
          if ((nextStructInfo[id].type == 's.d' || nextStructInfo[id].type == 's.iota') && !currSDids.some((c) => c == id)) {
            treeNodeCheckedKeys.checked.push(id);
          }
          nextSDids.push(id);
        }
        this.props.emitDataChange_(true);
        this.setState({
          treeNodeCheckedKeys,
          currSDids: nextSDids,
        });
      }
    }

    if (nextProps.foldAllG6ToCenter && this.g6Tree) {
      this.toG6Center(width, height, g6TreeDirection);
      this.props.resetFoldAllG6ToCenter();
    }

    if (this.props.g6TreeDirection != g6TreeDirection && this.g6Tree) {
      this.toG6Center(width, height, g6TreeDirection);
      this.g6Tree.changeLayout(
        new G6.Layout.CompactBoxTree({ direction: g6TreeDirection }),
      );
    }
  }

  componentWillUnmount() {
    if (this.intervalLinkStatus) {
      clearInterval(this.intervalLinkStatus);
    }
  }

  toG6Center = (width, height, direction = null) => {
    let x = 30; let
      y = 50;
    if (direction == 'LR') {
      x = 400;
      y = -10;
    }
    this.g6Tree.changeSize(width, height);
    this.g6Tree.focusPoint({ x, y });
  };

  formedData = () => {
    const that = this;
    const { treeNodeCheckedKeys, devicesLinkState } = this.state;
    const { isEdit } = this.props;
    const structInfo = Immutable.fromJS(this.props.data).toJS();

    const deviceIds = Object.keys(structInfo);
    const node = []; const
      link = [];
    const defaultTreeNodesCheckedKeys = [];
    for (let i = 0; i < deviceIds.length; i++) {
      if (structInfo[deviceIds[i]].type == 's.iota') {
        structInfo[deviceIds[i]].name = '数据中心';
        const a = {
          ...structInfo[deviceIds[i]], id: deviceIds[i], label: '数据中心', color: '#108ee9', children: [],
        };
        node.push(a);
        defaultTreeNodesCheckedKeys.push(a.id);
      } else if (structInfo[deviceIds[i]].type == 's.d') {
        let linkState = null;
        if (devicesLinkState) {
          linkState = devicesLinkState.find((dls) => dls.deviceId == deviceIds[i]);
          if (linkState) {
            linkState = linkState.status;
          }
        }
        let linkStateMsg = '';
        let LinlStateColor = '#666666';
        if ((linkState != null || linkState != undefined) && !isEdit) {
          if (linkState == 1) {
            // linkStateMsg = "(在线)"
          } else if (linkState == 0) {
            linkStateMsg = '(离线)';
            LinlStateColor = 'red';
          }
        }

        const a = {
          ...structInfo[deviceIds[i]],
          id: deviceIds[i],
          label: structInfo[deviceIds[i]].instance.name + linkStateMsg,
          style: { stroke: LinlStateColor },
          children: [],
          linkState,
        };
        if (this.props.collapseAll) {
          if (this.props.expanded.some((c) => c == deviceIds[i])) {
            a.isCollapsed = false;
          } else {
            a.isCollapsed = true;
          }
        }
        if (this.props.expandAll) {
          if (this.props.collapsed.some((c) => c == deviceIds[i])) {
            a.isCollapsed = true;
          } else {
            a.isCollapsed = false;
          }
        }
        node.push(a);
        defaultTreeNodesCheckedKeys.push(a.id);
      } else if (structInfo[deviceIds[i]].type == 's.l') {
        const temp = structInfo[deviceIds[i]];
        const b = { from: temp.instance.from.ownerSvgId, to: temp.instance.to.ownerSvgId };
        link.push(b);
      }
    }
    const deviceInfos = {
      nodes: node,
      links: link,
    };

    const parent = deviceInfos.nodes.filter((s) => s.type == 's.iota')[0].id;
    const nodes = new Map();
    deviceInfos.nodes.forEach((s) => {
      nodes.set(s.id, s);
    });
    const { links } = deviceInfos;

    function getLeaf(parentId) {
      const fromStructs = nodes.get(parentId);
      let tempTreeData = [];
      links.forEach((m) => {
        if (m.to == parentId) {
          const node = nodes.get(m.from);
          if (((treeNodeCheckedKeys && treeNodeCheckedKeys.checked.some((c) => c == node.id))
            || treeNodeCheckedKeys.checked.length == 0
          ) && !that.disCheckedKeys.some((d) => d == node.id)) {
            fromStructs.children.push(node);
          }
          const nextTempTreeData = getLeaf(m.from);

          tempTreeData = tempTreeData.concat(nextTempTreeData.treeData);
          // tempTreeData.push({ name: node.name, id: node.id, children: nextTempTreeData.treeData })
        }
      });
      const treeData = [{ name: fromStructs.name, id: fromStructs.id, children: tempTreeData.length ? tempTreeData : null }];

      fromStructs.children = sort(fromStructs.children);
      return { tree_data: fromStructs, treeData, defaultTreeNodesCheckedKeys };
    }

    return getLeaf(parent);
  };

  _finishDataChange = () => {
    this.props.changeFinish();
  };

  _handelNodeClick = (node) => {
    this.props.handelNodeClick(node);
  };

  _handelNodeEnter = (node) => this.props.handleNodeEnter(node);

  renderTreeNodes = (data, parentId) => {
    const combinTreeNode = (item, parentId) => {
      const treeNode = {
        title: item.name,
        key: item.id,
        disableCheckbox: item.name == '数据中心',
      };
      if (item.children) {
        treeNode.children = item.children.map((ci) => combinTreeNode(ci, item.id));
      }
      return treeNode;
    };
    return data.map((item) => combinTreeNode(item));
  };

  onTreeNodeSelect = (checkedKeys, e, data) => {
    const { emitDataChange_, width, height } = this.props;
    emitDataChange_();
    const { disCheckedKeys } = this;
    if (e.checked) {
      const newDisCheckedKeys = [];
      disCheckedKeys.forEach((d) => {
        if (d != e.node.props.eventKey) {
          newDisCheckedKeys.push(d);
        }
      });
      this.disCheckedKeys = newDisCheckedKeys;
    } else {
      disCheckedKeys.push(e.node.props.eventKey);
      this.disCheckedKeys = disCheckedKeys;
    }
    this.setState({ treeNodeCheckedKeys: checkedKeys });
    this.toG6Center(width, height);
  };

  setG6Tree = (g6Tree) => {
    this.g6Tree = g6Tree;
  };

  setG6TreeData = (data) => {
    this.g6TreeData = data;
  };

  onTreeNodeClick = (nodeKeys, e) => {
    const { treeNodeCheckedKeys } = this.state;
    const { cleanTargetNode } = this.props;
    const lastClickNodeKey_ = this.lastClickNodeKey;
    if (nodeKeys.length) {
      const nodeKey = nodeKeys[0];
      if (this.g6Tree && treeNodeCheckedKeys.checked.some((cid) => cid == nodeKey)) {
        const node = this.g6Tree.find(nodeKey);
        if (node) {
          const boxStatsh = node._attrs.boxStash;
          this.g6Tree.update(nodeKey, {
            color: '#ff7300',
          });
          if (lastClickNodeKey_ && lastClickNodeKey_ != nodeKey) {
            const node = this.g6Tree.find(lastClickNodeKey_);
            if (node && node._attrs.model.type == 's.iota') {
              this.g6Tree.update(lastClickNodeKey_, {
                color: '#108ee9',
              });
            } else if (node) {
              this.g6Tree.update(lastClickNodeKey_, {
                color: '#fff',
              });
            }
          }
          this.lastClickNodeKey = nodeKey;
          this.g6Tree.focusPoint({ x: boxStatsh.centerX, y: boxStatsh.centerY });
        }
      }
    } else if (lastClickNodeKey_) {
      const node = this.g6Tree.find(lastClickNodeKey_);
      if (node && node._attrs.model.type == 's.iota') {
        this.g6Tree.update(lastClickNodeKey_, {
          color: '#108ee9',
        });
      } else {
        this.g6Tree.update(lastClickNodeKey_, {
          color: '#fff',
        });
      }
    }
  };

  render() {
    const {
      data, emitChange, width, height, targetNode, isEdit, onCollapse,
    } = this.props;

    const { treeNodeCheckedKeys, currSDids, isGetLinkStateDone } = this.state;
    const treeData = this.formedData();
    if (currSDids.length == 0 && treeNodeCheckedKeys.checked.length == 0) {
      treeNodeCheckedKeys.checked = treeData.defaultTreeNodesCheckedKeys;
    }
    // let checkedKeys;
    // if (treeNodeCheckedKeys.checked.length >= treeData.defaultTreeNodesCheckedKeys.length) {
    //     let newChecked = [];
    //     treeNodeCheckedKeys.checked.forEach(k => {
    //         if (!newChecked.some(n => n == k) && !this.disCheckedKeys.some(d => d == k)) {
    //             newChecked.push(k)
    //         }
    //     })
    //     checkedKeys = {
    //         checked: newChecked, halfChecked: []
    //     }
    // } else {
    //     checkedKeys = treeNodeCheckedKeys
    // }
    return (
      <div id="editMap" ref="editMap" style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          id="deviceTree"
          style={{
            position: 'absolute',
            top: isEdit ? 100 : 50,
            zIndex: 999,
            maxHeight: height - (isEdit ? 100 : 50),
            overflow: 'auto',
          }}
        >
          <Tree
            showIcon={false}
            checkable
            onCheck={(checkedKeys, e) => this.onTreeNodeSelect(checkedKeys, e, treeData.treeData)}
            onSelect={(checkedKeys, e) => this.onTreeNodeClick(checkedKeys, e)}
            defaultCheckedKeys={treeData.defaultTreeNodesCheckedKeys}
            checkStrictly
            // checkedKeys={checkedKeys}
            treeData={this.renderTreeNodes(treeData.treeData, null)}
          />
        </div>
        {isGetLinkStateDone || isEdit
          ? (
            <Tree_
              data={treeData.tree_data}
              emitChange={emitChange}
              changeFinish={this._finishDataChange}
              width={width}
              height={height}
              targetNode={targetNode}
              handelNodeClick={this._handelNodeClick}
              onCollapse={onCollapse}
              ref="rateChart"
              handleNodeEnter={this._handelNodeEnter}
              setG6Tree={this.setG6Tree}
              setG6TreeData={this.setG6TreeData}
            />
          ) : null}
      </div>
    );
  }
}

export default ZuwangMain;
