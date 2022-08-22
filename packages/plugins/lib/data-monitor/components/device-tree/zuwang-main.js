import React, { useState, useEffect } from 'react';
import { useSafeState, useBoolean } from 'ahooks';
import Immutable from 'immutable';
import { sort, Request, PinyinHelper } from '@peace/utils';
import { ApiTable } from '$utils';
import {
  Spin, Modal, Card, Input, Button, message, Menu, Dropdown, Tree,
} from 'antd';
import Ps from 'perfect-scrollbar';
import createG6 from './edit-map';

// import { useThingsLinkStatus } from '../../actions/hooks';

const Tree_ = createG6((tree) => {
  tree.render();
});

export default function ({ ...props }) {
  const {
    struct, data, resetFoldAllG6ToCenter, foldAllG6ToCenter, g6TreeDirection, emitChange, emitDataChange_,
    width, height, collapseAll, collapsed, expanded, expandAll, changeFinish, targetNode, inputSearching, setInputSearching,
    onCollapse, handleNodeEnter, handelNodeClick,
  } = props;
  const [isGetLinkStateDone, { setTrue, setFalse }] = useBoolean(false);
  const [devicesLinkState, setDevicesLinkState] = useSafeState(null);
  const [treeNodeCheckedKeys, setTreeNodeCheckedKeys] = useSafeState([]);
  const [currSDids, setCurrSDids] = useSafeState([]);
  const [g6Tree, setG6Tree] = useSafeState(null);
  const [g6TreeData, setG6TreeData] = useSafeState(null);
  const [lastClickNodeKey, setLastClickNodeKey] = useSafeState(null);
  const [disCheckedKeys, setDisCheckedKeys] = useSafeState([]);
  let intervalLinkStatus = null;

  // const da =  useThingsLinkStatus(struct?.iotaThingId);

  const getThingsLinkStatus = (isCycle = false) => {
    const iotaThingId = struct?.iotaThingId;
    if (iotaThingId) {
      const url = ApiTable.getIotaThingsLlinkStatus.replace('{iotaThingId}', iotaThingId);
      Request.get(url).then((res) => {
        if (res.devices.length >= 0) {
          setDevicesLinkState(res.devices);
        } else {
          intervalLinkStatus && clearInterval(intervalLinkStatus);
        }
        if (!isCycle) {
          setTrue();
        }
      }, (error) => {
        if (!isCycle) {
          message.warning('设备在线状态获取失败');
          setTrue();
        }
      });
    }
  };
  useEffect(() => {
    getThingsLinkStatus();
    intervalLinkStatus = setInterval(() => {
      getThingsLinkStatus(true);
    }, 4000);
    new Ps('#deviceTree', { suppressScrollX: true });
    return () => {
      intervalLinkStatus && clearInterval(intervalLinkStatus);
    };
  }, []);

  useEffect(() => {
    const nextDeviceIds = Object.keys(data);
    if (currSDids.length != nextDeviceIds.length) {
      const nextSDids = [];
      const checked = [].concat(treeNodeCheckedKeys);
      for (const id of nextDeviceIds) {
        if ((data[id]?.type == 's.d' || data[id]?.type == 's.iota') && !currSDids.some((c) => c == id)) {
          checked.push(id);
        }
        nextSDids.push(id);
      }
      emitDataChange_ && emitDataChange_(true);
      setTreeNodeCheckedKeys(checked);
      setCurrSDids(nextSDids);
    }
    if (foldAllG6ToCenter && g6Tree) {
      toG6Center(width, height, g6TreeDirection);
      resetFoldAllG6ToCenter();
    }
  }, [data, foldAllG6ToCenter]);

  useEffect(() => {
    if (g6Tree) {
      toG6Center(width, height, g6TreeDirection);
      g6Tree.changeLayout(
        new G6.Layout.CompactBoxTree({ direction: g6TreeDirection }),
      );
    }
  }, [g6TreeDirection]);

  useEffect(() => {
    if (g6Tree && inputSearching) {
      const items = g6Tree.getItems();

      if (items && items.length) {
        items.forEach((item) => {
          const { model } = item._attrs;
          if (model && model.label && targetNode && (
            model.label.indexOf(targetNode) != -1 || PinyinHelper.isPinyinMatched(model.label, targetNode)
          )) {
            g6Tree.update(model.id, {
              color: '#ff7300',
            });

            g6Tree.focusPoint({ x: model.x, y: model.y });
          } else if (model && model.type == 's.iota') {
            g6Tree.update(model.id, {
              color: '#108ee9',
            });
          } else {
            g6Tree.update(model.id, {
              color: '#fff',
            });
          }
        });
      }
      // g6Tree.changeSize(width, height);
      // g6Tree.refresh();
    }
    setInputSearching(false);
  }, [targetNode, inputSearching]);

  const toG6Center = (width, height, direction = null) => {
    let x = 30; let
      y = 50;
    if (direction == 'LR') {
      x = 400;
      y = -10;
    }
    g6Tree.changeSize(width, height);
    g6Tree.focusPoint({ x, y });
  };

  const _finishDataChange = () => {
    changeFinish && changeFinish();
  };

  const _handelNodeClick = (node) => {
    handelNodeClick(node);
  };
  const _handelNodeEnter = (node) => handleNodeEnter(node);

  const renderTreeNodes = (data, parentId) => {
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

  const onTreeNodeSelect = (checkedKeys, e, data) => {
    if (e.checked) {
      const newDisCheckedKeys = [];
      disCheckedKeys.forEach((d) => {
        if (d != e.node.key) {
          newDisCheckedKeys.push(d);
        }
      });
      setDisCheckedKeys(newDisCheckedKeys);
    } else {
      setDisCheckedKeys([].concat(disCheckedKeys, [e.node.key]));
    }
    setTreeNodeCheckedKeys(checkedKeys.checked);

    toG6Center(width, height);
    emitDataChange_();
  };

  const onTreeNodeClick = (nodeKeys, e) => {
    const lastClickNodeKey_ = lastClickNodeKey;
    if (nodeKeys.length) {
      const nodeKey = nodeKeys[0];

      if (g6Tree && treeNodeCheckedKeys.some((cid) => cid == nodeKey)) {
        const node = g6Tree.find(nodeKey);
        if (node) {
          const boxStatsh = node._attrs.boxStash;
          g6Tree.update(nodeKey, {
            color: '#ff7300',
          });
          if (lastClickNodeKey_ && lastClickNodeKey_ != nodeKey) {
            const node = g6Tree.find(lastClickNodeKey_);
            if (node && node._attrs.model.type == 's.iota') {
              g6Tree.update(lastClickNodeKey_, {
                color: '#108ee9',
              });
            } else if (node) {
              g6Tree.update(lastClickNodeKey_, {
                color: '#fff',
              });
            }
          }
          setLastClickNodeKey(nodeKey);
          // lastClickNodeKey = nodeKey;
          g6Tree.focusPoint({ x: boxStatsh.centerX, y: boxStatsh.centerY });
        }
      }
    } else if (lastClickNodeKey_) {
      if (g6Tree) {
        const node = g6Tree.find(lastClickNodeKey_);
        if (node && node._attrs.model.type == 's.iota') {
          g6Tree.update(lastClickNodeKey_, {
            color: '#108ee9',
          });
        } else {
          g6Tree.update(lastClickNodeKey_, {
            color: '#fff',
          });
        }
      }
    }
  };

  const formedData = () => {
    const deviceInfo = JSON.parse(JSON.stringify(data));
    const deviceIds = Object.keys(deviceInfo);
    const node = []; const
      link = [];
    const defaultTreeNodesCheckedKeys = [];
    for (let i = 0; i < deviceIds.length; i++) {
      if (deviceInfo[deviceIds[i]].type == 's.iota') {
        deviceInfo[deviceIds[i]].name = '数据中心';
        const a = {
          ...deviceInfo[deviceIds[i]], id: deviceIds[i], label: '数据中心', color: '#108ee9', children: [],
        };
        node.push(a);
        defaultTreeNodesCheckedKeys.push(a.id);
      } else if (deviceInfo[deviceIds[i]].type == 's.d') {
        let linkState = null;
        if (devicesLinkState) {
          linkState = devicesLinkState.find((dls) => dls.deviceId == deviceIds[i]);
          if (linkState) {
            linkState = linkState.status;
          }
        }
        let linkStateMsg = '';
        let LinlStateColor = '#666666';
        if ((linkState != null || linkState != undefined)) {
          if (linkState == 1) {
            // linkStateMsg = "(在线)"
          } else if (linkState == 0) {
            linkStateMsg = '(离线)';
            LinlStateColor = 'red';
          }
        }

        const a = {
          ...deviceInfo[deviceIds[i]],
          id: deviceIds[i],
          label: `${deviceInfo[deviceIds[i]]?.instance?.name || ''}${linkStateMsg}`,
          style: { stroke: LinlStateColor },
          children: [],
          linkState,
        };
        if (collapseAll) {
          if (expanded.some((c) => c == deviceIds[i])) {
            a.isCollapsed = false;
          } else {
            a.isCollapsed = true;
          }
        }
        if (expandAll) {
          if (collapsed.some((c) => c == deviceIds[i])) {
            a.isCollapsed = true;
          } else {
            a.isCollapsed = false;
          }
        }
        node.push(a);
        defaultTreeNodesCheckedKeys.push(a.id);
      } else if (deviceInfo[deviceIds[i]]?.type == 's.l') {
        const temp = deviceInfo[deviceIds[i]];
        const b = { from: temp?.instance?.from?.ownerSvgId, to: temp?.instance?.to?.ownerSvgId };
        link.push(b);
      }
    }
    const deviceInfos = {
      nodes: node,
      links: link,
    };

    const parent = deviceInfos.nodes.filter((s) => s.type == 's.iota')[0]?.id;
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

          if (((treeNodeCheckedKeys && treeNodeCheckedKeys.some((c) => c == node.id))

            || treeNodeCheckedKeys.length == 0
          ) && !disCheckedKeys.some((d) => d == node.id)) {
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

  const treeData = formedData();

  return (
    <div id="editMap" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        id="deviceTree"
        style={{
          position: 'absolute',
          top: 50,
          zIndex: 999,
          maxHeight: height - 50,
          overflow: 'auto',
        }}
      >
        <Tree
          showIcon={false}
          checkable
          onCheck={(checkedKeys, e) => onTreeNodeSelect(checkedKeys, e, treeData.treeData)}
          onSelect={(checkedKeys, e) => onTreeNodeClick(checkedKeys, e)}
          defaultCheckedKeys={treeData.defaultTreeNodesCheckedKeys}
          checkStrictly
          // checkedKeys={checkedKeys}
          treeData={renderTreeNodes(treeData.treeData, null)}
        />
      </div>

      {isGetLinkStateDone
        ? (
          <Tree_
            data={treeData.tree_data}
            emitChange={emitChange}
            changeFinish={_finishDataChange}
            emitDataChange_={emitDataChange_}
            width={width}
            height={height}
            targetNode={targetNode}
            handelNodeClick={_handelNodeClick}
            onCollapse={onCollapse}
            handleNodeEnter={_handelNodeEnter}
            setG6Tree={(g6Tree) => { setG6Tree(g6Tree); }}
            setG6TreeData={(data) => { setG6TreeData(data); }}
          />
        ) : null}
    </div>
  );
}
