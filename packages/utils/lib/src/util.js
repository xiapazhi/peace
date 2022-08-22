import { toCSS, toJSON } from 'cssjson';
/**
 * 将驼峰写法改成xx-xx的css命名写法
 * @param styleKey
 */
 export function toLine(styleKey) {
  return styleKey.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function toHump(name) {
  return name.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase());
}

const parseToCssCode = (styleData) => {
  const parseStyleData = {};
  for (const styleKey in styleData) {
    parseStyleData[toLine(styleKey)] = styleData[styleKey];
  }

  const cssJson = {
    children: {
      '#main': {
        children: {},
        attributes: parseStyleData,
      },
    },
  };

  return toCSS(cssJson);
};

const parseToStyleData = (cssCode) => {
  const styleData = {};
  try {
    const cssJson = toJSON(cssCode);
    const cssJsonData = cssJson?.children?.['#main']?.attributes;
    for (const key in cssJsonData) {
      styleData[toHump(key)] = cssJsonData[key];
    }
    // 转化key
  } catch (e) {
    console.error(e.message);
  }

  return styleData;
};

export {
  parseToStyleData,
  parseToCssCode,
};