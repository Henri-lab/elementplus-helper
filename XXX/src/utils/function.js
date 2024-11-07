// 时间格式化
export function timerdata() {
    let now = new Date();
  
    let year = now.getFullYear(); //得到年份
  
    let month = now.getMonth() + 1; //得到月份
  
    let date = now.getDate(); //得到日期
  
    let day = now.getDay(); //得到周几
    let week = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    let hour = now.getHours(); //得到小时数
  
    let minute = now.getMinutes(); //得到分钟数
  
    let second = now.getSeconds(); //得到秒数
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
  
    // setTimeout(timerdata,1000);//定时器一直调用show()函数
    // weekData.value = {week:`${year}年 ${month}月${date}日 ${week[day]}`,timer:`${h} :  ${m} :  ${s}`}
    return {
      data: `${year}-${month}-${date}`,
      week: `${week[day]}`,
      timer: `${h} : ${m} : ${s}`,
    };
  }
  
  var checkTime = function (i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };