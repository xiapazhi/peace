import React, { useState, useEffect } from 'react';
import { PinyinHelper } from '@peace/utils';

const { G6 } = window;
let uniqueId = 0;

function generateUniqueId() {
  return `rc-g6-${uniqueId++}`;
}

function createG6(__operation) {
  const editMap = ({ ...props }) => {
    const {
      emitChange, changeFinish, width, height, handelNodeClick, handleNodeEnter,
      onCollapse, setG6Tree, setG6TreeData, data, targetNode, emitDataChange_,
    } = props;
    const [treeRef, setTreeRef] = useState(null);
    const [isItemClicking, setIsItemClicking] = useState(false);
    const [orientation, setOrientation] = useState(false);
    const [treeId, setTreeId] = useState(generateUniqueId());
    // let treeId = generateUniqueId();
    const themeKey = localStorage.getItem('theme-name');

    const selectNode = (node) => {
      handelNodeClick && handelNodeClick(node);
    };
    const toolTipMsg = (node) => handleNodeEnter(node);
    const initTree = (prop) => {
      const { Global } = G6;
      Global.nodeAcitveBoxStyle = {
        stroke: '#108EE9',
        fill: '#00B5F4',
        fillOpacity: 0.2,
        lineWidth: 2,
        radius: 4,
      };
      const grid = themeKey === 'light' ? {
        grid: {
          cell: 10,
          line: {
            stroke: '#eee',
          },
        },
      } : {};
      const tree = new G6.Tree({
        id: treeId,
        fitView: 'cc',
        layoutCfg: {
          direction: 'TB',
          getHGap(/* d */) {
            return 10;
          },
          getVGap(/* d */) {
            return 10;
          },
        },
        ...grid,
        ...prop,
      });
      tree.addBehaviour('default', ['clickActive']);
      tree.addBehaviour('default', ['clickBlankClearActive']);
      tree.tooltip({
        title: '标题', // @type {String} 标题
        split: '=>', // @type {String} 分割符号
        dx: 10, // @type {Number} 水平偏移
        dy: 10, // @type {Number} 竖直偏移
      });
      // tree.node().tooltip('采集策略为空，请在左上角【+ 采集策略】添加至少一种采集策略，再进行相关设备的添加配置');
      tree.edge().shape('smooth');
      tree.on('itemclick', (ev) => {
        setIsItemClicking(true);

        const { item } = ev;
        const { shape } = ev;
        if (shape && !shape.hasClass('Button')) {
          selectNode(item);
        }
      }).on('itemunactived', (ev) => {
        selectNode();
      }).on('itemmouseenter', (ev) => {
        if (ev.itemType !== 'node') {
          return;
        }
        const dd = toolTipMsg(null);
        if (dd) {
          tree.tooltip({
            split: '!',
            dx: 10,
            dy: 10,
          });
        } else {
          tree.tooltip(false);
        }
        const keyShape = ev.item.getKeyShape();
        keyShape.attr({
          lineWidth: 2,
        });
        tree.refresh();
      }).on('itemmouseleave', (ev) => {
        if (ev.itemType !== 'node') {
          return;
        }
        const keyShape = ev.item.getKeyShape();
        keyShape.attr({
          lineWidth: 1,
        });
        tree.refresh();
      })
        .on('collapse', (ev) => {
          onCollapse(ev.item._attrs.model, true);
        })
        .on('spreadout', (ev) => {
          onCollapse(ev.item._attrs.model, false);
        });
      __operation(tree);
      setTreeRef(tree);
      setG6Tree(tree);
      setG6TreeData(data);
    };
    useEffect(() => {
      initTree(props);
      return () => {
        treeRef && treeRef.destroy();
        setTreeRef(null);
      };
    }, []);
    // useEffect(() => {
    //     let inputSearching = JSON.parse(localStorage.getItem('inputSearching'));
    //     if(targetNode || inputSearching){

    //         setIsItemClicking(false)
    //     }
    //     // let items = treeRef && treeRef.getItems();

    //     // if (items && items.length) {
    //     //     items.forEach(item => {
    //     //         const model = item._attrs.model;
    //     //         if (model && model.label && targetNode && (
    //     //             model.label.indexOf(targetNode) != -1 || PinyinHelper.isPinyinMatched(model.label, targetNode)
    //     //         )) {

    //     //             item.getKeyShape().attr({
    //     //                 fill: '#ff7300'
    //     //             });
    //     //             treeRef.update(model.id, {
    //     //                 color: '#ff7300'
    //     //             });

    //     //             if (!orientation && !isItemClicking) {

    //     //                 treeRef && treeRef.focusPoint({ x: model.x, y: model.y });
    //     //                 setOrientation(true);

    //     //             }
    //     //         } else if (model && model.type == 's.iota') {
    //     //             item.getKeyShape().attr({
    //     //                 fill: '#108ee9'
    //     //             });
    //     //         } else {
    //     //             item.getKeyShape().attr({
    //     //                 fill: '#fff'
    //     //             });
    //     //         }
    //     //     });

    //     //     if (inputSearching) {
    //     //         localStorage.setItem('inputSearching', false)
    //     //     }
    //     //     setOrientation(false);
    //     //     console.log('%c [ treeRef ]', 'font-size:13px; background:pink; color:#bf2c9f;', treeRef)

    //     //     treeRef && treeRef.refresh();

    //     }
    // }, [targetNode]);

    useEffect(() => {
      treeRef && treeRef.changeSize(width, height);
    }, [width, height]);

    useEffect(() => {
      if (emitChange == true || data) {
        treeRef && treeRef.changeData(data);
        treeRef && treeRef.refresh();
        changeFinish();
      }
    }, [emitChange, data]);

    return (
      <div id={treeId} />
    );
  };

  return React.memo(editMap, (prevProps, nextProps) => {
    if ((prevProps.emitChange !== nextProps.emitChange)
      || (nextProps.width !== prevProps.width)
      || (nextProps.height !== prevProps.height)) {
      return false;
    }

    return true;
  });
}

export default createG6;
