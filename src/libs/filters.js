//2016-12-28T14:00:55.000+0800 日期格式转为 2016-12-28 14:00:55
function formatdate(value) {
    if(!value) return;
    value = value.replace(/T/g, ' ');
    value = value.replace(/.\d{3}\+\d{4}/g, '');
    return value;
}

exports.formatdate = formatdate;