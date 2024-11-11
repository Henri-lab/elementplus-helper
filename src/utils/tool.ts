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

export { sleep, executeUntilNonEmpty };
