import React, { useState, useEffect } from 'react';
import { Drawer } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import MonacoEditor from '@alilc/lowcode-plugin-base-monaco-editor';
import { parseToCssCode, parseToStyleData } from '@peace/utils';

function CssEditor(props) {
  const {
    styleData = {}, contentHeight, onSaveStyle, styleName,
  } = props;

  const [cssEditorVisible, setCssEditorVisible] = useState(false);
  const themeName = localStorage.getItem('theme-name') || 'light';

  const defaultEditorOption = {
    readOnly: false,
    automaticLayout: true,
    folding: true, // 默认开启折叠代码功能
    lineNumbers: 'on',
    wordWrap: 'off',
    formatOnPaste: true,
    height: '100%',
    fontSize: 12,
    tabSize: 2,
    scrollBeyondLastLine: false,
    fixedOverflowWidgets: false,
    snippetSuggestions: 'top',
    minimap: {
      enabled: false,
    },
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
    },
  };
  const defaultEditorProps = {
    theme: themeName === 'light' ? 'light' : 'vs-dark',
    style: {
      width: '100%',
      height: `${contentHeight - 59 - 48}px`,
    },
  };

  const cssCode = parseToCssCode(styleData);

  const cssEditorShow = () => {
    setCssEditorVisible(true);
  };
  const cssEditorHidden = () => {
    setCssEditorVisible(false);
  };

  const onCssChange = (newValue, e) => {
    const newStyleData = parseToStyleData(newValue);
    newStyleData && onSaveStyle(styleName, newStyleData);
  };

  useEffect(() => {

  }, []);

  return (
    <>
      <FormOutlined onClick={cssEditorShow} />
      <Drawer width={600} title="CSS源码编辑" placement="right" onClose={cssEditorHidden} visible={cssEditorVisible}>
        <MonacoEditor
          value={cssCode}
          {...defaultEditorProps}
          {...defaultEditorOption}
          {...{ language: 'css' }}
          onChange={onCssChange}
        />
      </Drawer>
    </>

  );
}

export default CssEditor;
