let common = {}
common.login_name = '';
common.getDataDay = data => {
    let cycle = data
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 0);
    start.setTime(start.getTime() - 3600 * 1000 * 24 * cycle);
    return {
        start_time: common.formatDate(start),
        end_time: common.formatDate(end),
    }
}
//格式化时间
common.formatDate = date => {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
}
module.exports = common