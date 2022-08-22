import React from 'react';
import { PinyinHelper } from '@peace/utils';

const { G6 } = window;
let uniqueId = 0;

function generateUniqueId() {
  return `rc-g6-${uniqueId++}`;
}

function createG6(__operation) {
  class Component extends React.Component {
    constructor(props) {
      super(props);
      this.tree = null;
      this.treeId = generateUniqueId();
      this.isItemClicking = false;
    }

    selectNode = (node) => {
      this.props.handelNodeClick(node);
    };

    toolTipMsg = (node) => this.props.handleNodeEnter(node);

    initTree(props) {
      const _this = this;
      const { Global } = G6;
      const themeKey = localStorage.getItem('theme-name');
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
        id: this.treeId,
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
        ...props,
      });
      tree.addBehaviour('default', ['clickActive']);
      tree.addBehaviour('default', ['clickBlankClearActive']);
      tree.tooltip({
        title: '标题', // @type {String} 标题
        split: '=>', // @type {String} 分割符号
        dx: 10, // @type {Number} 水平偏移
        dy: 10, // @type {Number} 竖直偏移
      });
      tree.node().tooltip('采集策略为空，请在左上角【+ 采集策略】添加至少一种采集策略，再进行相关设备的添加配置');
      tree.edge().shape('smooth');
      tree.on('itemclick', (ev) => {
        _this.isItemClicking = true;
        const { item } = ev;
        const { shape } = ev;
        if (shape && !shape.hasClass('Button')) {
          _this.selectNode(item);
        }
      }).on('itemunactived', (ev) => {
        _this.selectNode();
      }).on('itemmouseenter', (ev) => {
        if (ev.itemType !== 'node') {
          return;
        }
        const dd = _this.toolTipMsg(null);
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
          _this.props.onCollapse(ev.item._attrs.model, true);
        })
        .on('spreadout', (ev) => {
          _this.props.onCollapse(ev.item._attrs.model, false);
        });
      __operation(tree);
      this.tree = tree;
      props.setG6Tree(tree);
      props.setG6TreeData(props.data);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
      const {
        width: newWidth, height: newHeight, changeFinish, targetNode,
      } = newProps;
      const { width: oldWidth, height: oldHeight } = this.props;
      const inputSearching = JSON.parse(localStorage.getItem('inputSearching'));

      if (this.props.targetNode != targetNode || inputSearching) {
        this.isItemClicking = false;
      }
      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        this.tree.changeSize(newWidth, newHeight);
      }
      if (newProps.emitChange == true) {
        this.tree.changeData(newProps.data);
        this.tree.refresh();
        changeFinish();
      }

      const items = this.tree.getItems();
      if (items.length) {
        items.forEach((item) => {
          const { model } = item._attrs;
          if (model && model.label && targetNode && (
            model.label.indexOf(targetNode) != -1 || PinyinHelper.isPinyinMatched(model.label, targetNode)
          )) {
            item.getKeyShape().attr({
              fill: '#ff7300',
            });

            if (!this.orientation && !this.isItemClicking) {
              this.tree.focusPoint({ x: model.x, y: model.y });
              this.orientation = true;
            }
          } else if (model && model.type == 's.iota') {
            item.getKeyShape().attr({
              fill: '#108ee9',
            });
          } else {
            item.getKeyShape().attr({
              fill: '#fff',
            });
          }
        });

        if (inputSearching) {
          localStorage.setItem('inputSearching', false);
        }

        this.orientation = false;
        this.tree.refresh();
      }
    }

    shouldComponentUpdate() {
      return false;
    }

    componentWillUnmount() {
      this.tree.destroy();
      this.tree = null;
      this.treeId = null;
    }

    componentDidMount() {
      this.initTree(this.props);
    }

    render() {
      return (
        <div id={this.treeId} ref={this.treeId} />
      );
    }
  }

  return Component;
}

export default createG6;
