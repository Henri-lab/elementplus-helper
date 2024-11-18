function sleep(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

function executeUntilNonEmpty(func: () => any, resTo: any, interval = 200) {
  let index = 0;
  const timer = setInterval(() => {
    const result = func(); // 调用函数并获取返回值
    // console.log(result, index++);
    if (result) {
      clearInterval(timer); // 如果返回值非空，则清除定时器
      console.log('Function returned non-empty result:', result);
      resTo = result;
    }
  }, interval);
}

function getKeyByValue(
  obj: Record<string, any>,
  value: any
): string | undefined {
  return Object.entries(obj).find(([key, val]) => val === value)?.[0];
}
function getKeysByValue(obj: Record<string, any>, value: any): string[] {
  return Object.keys(obj).filter((key) => obj[key] === value);
}
function filterObjectProperties(
  obj: Record<string, any>,
  allowedKeys: string[]
): void {
  for (const key in obj) {
    if (!allowedKeys.includes(key)) {
      delete obj[key]; // 删除不属于 allowedKeys 的属性
    }
  }
}
export {
  sleep,
  executeUntilNonEmpty,
  getKeyByValue,
  getKeysByValue,
  filterObjectProperties,
};
