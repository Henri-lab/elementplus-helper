import pinyin from 'pinyin';
export async function getInitialsFromChinese(phrase: string): Promise<string> {
  // let pinyin = await import('pinyin');
  // if (!pinyin) {
  //   throw new Error('pinyin is not installed.');
  // }
  if (typeof phrase !== 'string') {
    throw new Error('Input must be a string.');
  }
  const result: string[] = [];
  for (const char of phrase) {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    if (chineseRegex.test(char)) {
      // 使用 pinyin 库获取拼音
      const pinyinResult = pinyin(char, { style: pinyin.STYLE_FIRST_LETTER });
      result.push(pinyinResult[0][0]); // 获取首字母
    } else {
      result.push(char.toUpperCase()); // 非汉字转大写保留
    }
  }

  return result.join('');
}

export async function JsonFormat(objOrStr: any) {
  const JSON5 = await import('json5');
  const prettier = await import('prettier');
  let parsedJson, formattedJson;
  if (typeof objOrStr === 'string') {
    // Parse relaxed JSON with JSON5j
    parsedJson = JSON5.parse(objOrStr);
    // Format the parsed JSON with Prettier
    formattedJson = prettier.format(JSON.stringify(parsedJson), {
      parser: 'json',
      printWidth: 80,
      tabWidth: 2,
    });
  } else if (objOrStr instanceof Object) {
    // Format the object with Prettier
    formattedJson = prettier.format(safeStringify(objOrStr), {
      parser: 'json',
      printWidth: 80,
      tabWidth: 2,
    });
  }
  return formattedJson;
}
export function safeStringify(obj: any) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) return; // Circular reference found, discard key
      cache.add(value);
    }
    return value;
  });
}
// 日期格式化🐦
export function parseTime(time: string | number | Date, pattern: string) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === 'string') {
      time = time
        .replace(new RegExp(/-/gm), '/')
        .replace('T', ' ')
        .replace(new RegExp(/\.[\d]{3}/gm), '');
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(
    /{(y|m|d|h|i|s|a)+}/g,
    (result: string | any[], key: string) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    }
  );
  return time_str;
}

// 添加日期范围
// 示例
// const params = { params: {} };
// const dateRange = ['2023-01-01', '2023-01-31'];
// const propName = 'Date';

// const updatedParams = addDateRange(params, dateRange, propName);
// console.log(updatedParams); // 输出: { params: { beginDate: '2023-01-01', endDate: '2023-01-31' } }
export function addDateRange(params: any, dateRange: any[], propName: string) {
  let search = params;
  search.params =
    typeof search.params === 'object' &&
    search.params !== null &&
    !Array.isArray(search.params)
      ? search.params
      : {};
  dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (typeof propName === 'undefined') {
    search.params['beginTime'] = dateRange[0];
    search.params['endTime'] = dateRange[1];
  } else {
    search.params['begin' + propName] = dateRange[0];
    search.params['end' + propName] = dateRange[1];
  }
  return search;
}

// 数据合并
export function mergeRecursive(
  final: { [x: string]: any },
  source: { [x: string]: any }
) {
  for (let p in source) {
    try {
      if (source[p].constructor == Object) {
        final[p] = mergeRecursive(final[p], source[p]);
      } else {
        final[p] = source[p];
      }
    } catch (e) {
      final[p] = source[p];
    }
  }
  return final;
}

// 树形数据转换
/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @example
 * const employees = [
  { id: 1, name: 'Alice', parentId: null },
  { id: 2, name: 'Bob', parentId: 1 },
  { id: 3, name: 'Charlie', parentId: 1 },
  { id: 4, name: 'David', parentId: 2 },
  { id: 5, name: 'Eve', parentId: 2 },
  { id: 6, name: 'Frank', parentId: 3 },
];

// 调用函数
const treeStructure = handleTree(employees);
// treeStructure打印输出：
[
  {
    id: 1,
    name: 'Alice',
    children: [
      {
        id: 2,
        name: 'Bob',
        children: [
          { id: 4, name: 'David', children: [] },
          { id: 5, name: 'Eve', children: [] }
        ]
      },
      {
        id: 3,
        name: 'Charlie',
        children: [
          { id: 6, name: 'Frank', children: [] }
        ]
      }
    ]
  }
]
 */
export function handleTree(data: any, id: any, parentId: any, children: any) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  };

  let childrenListMap: any = {};
  let nodeIds: any = {};
  let tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: { [x: string]: any }) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

// 参数转url
/**
* 参数处理
* @param {*} params  参数
* @example
const params = {
  name: 'John Doe',
  age: 30,
  address: {
    city: 'New York',
    zip: '10001'
  },
  tags: ['programming', 'coding']
};
const queryString = tansParams(params);
// queryString打印输出：
'name=John%20Doe&age=30&address[city]=New%20York&address[zip]=10001&tags=programming&tags=coding'
*/
// %20 代表空格 (ASCII 码 32)
export function tansParams(params: { [x: string]: any }) {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    let part = encodeURIComponent(propName) + '=';
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== '' &&
            typeof value[key] !== 'undefined'
          ) {
            let params = propName + '[' + key + ']';
            let subPart = encodeURIComponent(params) + '=';
            result += subPart + encodeURIComponent(value[key]) + '&'; //注意会遗留一个&
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&';
      }
    }
  }
  return result.slice(0, -1);
}

// 返回项目路径（保险：将路径中多余的/去掉）
export function getNormalPath(p: string) {
  if (p.length === 0 || !p || p == 'undefined') {
    return p;
  }
  let res = p.replace('//', '/');
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1);
  }
  return res;
}
