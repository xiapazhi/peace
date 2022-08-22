import React, { Component } from 'react';
import { Row, Spin, Button } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import ThreeSectionItem from './section-item';
import styleBox from './style.css';

class ThreeSectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionIndex: 0,
      selectedSection: null,
      containerSize: Math.floor((window.innerWidth - window.innerWidth * 0.04 - 160 - 100) / 100),
    };
  }

  resetContainerSize = () => {
    const container_left_size = Math.floor((window.innerWidth - window.innerWidth * 0.04 - 160 - 100) / 100);
    this.setState({ containerSize: container_left_size });
  };

  _clickPreBtn = () => {
    const { sectionIndex } = this.state;
    this.setState({ sectionIndex: sectionIndex + 1 });
  };

  _clickNextBtn = () => {
    const { sectionIndex } = this.state;
    this.setState({ sectionIndex: sectionIndex - 1 });
  };

  _onSectionClick = (section) => {
    const { onSectionClick } = this.props;
    this.setState({ selectedSection: section.id });
    onSectionClick(section);
  };

  _renderList = () => {
    const { sections } = this.props;
    const { selectedSection } = this.state;
    const sectionsList = [];
    sections.forEach((section, index) => {
      sectionsList.push(
        <ThreeSectionItem
          key={section.id}
          section={section}
          selectedSection={section.id == selectedSection}
          onSectionClick={this._onSectionClick}
        />,
      );
    });
    return sectionsList;
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resetContainerSize);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.visible == false) {
      this.setState({ sectionIndex: 0 });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resetContainerSize);
  }

  render() {
    const { sections, visible } = this.props;
    const { sectionIndex, containerSize } = this.state;
    const isShow = visible ? 'block' : 'none';

    const listWidth = sections.length < containerSize ? sections.length * 100 + 4 : containerSize * 100 + 4;
    const showLeftBtn = sectionIndex < sections.length - containerSize && sections.length > containerSize ? 'block' : 'none';
    const showRightBtn = sectionIndex > 0 && sections.length > containerSize ? 'block' : 'none';
    const container_width = sections.length * 100;
    const container_left_length = -sectionIndex * 100;
    return (
      <div className={styleBox.section_list} style={{ display: `${isShow}`, width: `${listWidth}px` }}>
        <div className={styleBox.left_btn} id="leftBtn" style={{ display: `${showLeftBtn}` }} onClick={this._clickPreBtn}><CaretLeftOutlined /></div>
        <div className={styleBox.section_container} style={{ width: `${container_width}px`, left: `${container_left_length}` }}>{this._renderList()}</div>
        <div className={styleBox.right_btn} id="rightBtn" style={{ display: `${showRightBtn}` }} onClick={this._clickNextBtn}><CaretRightOutlined /></div>
      </div>
    );
  }
}

export default ThreeSectionList;
