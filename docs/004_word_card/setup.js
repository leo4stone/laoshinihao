const fs = require('fs');
const path = require('path');

// 创建public目录，如果不存在
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

// 复制CSV文件到public目录
try {
  fs.copyFileSync('./ecdict.csv', './public/ecdict.csv');
  console.log('CSV文件已成功复制到public目录');
} catch (err) {
  console.error('复制CSV文件时出错:', err);
} 