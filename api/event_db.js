// 导入mysql2模块（使用promise版本，支持async/await）
const mysql = require('mysql2/promise');

// 创建数据库连接池（优化性能，避免频繁创建连接）
const pool = mysql.createPool({
  host: 'localhost', // 本地数据库地址
  user: 'root', // MySQL用户名（默认root）
  password: '123456', // 替换为你的密码
  database: 'charityevents_db', // 数据库名
  waitForConnections: true,
  connectionLimit: 10, // 最大连接数
  queueLimit: 0
});

// 测试连接（可选，运行后若显示“Database connected successfully”则连接成功）
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release(); // 释放连接
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

// 导出连接池（供其他API文件使用）
module.exports = pool;

// 执行测试（仅首次运行时需要，后续可注释）
// testConnection();