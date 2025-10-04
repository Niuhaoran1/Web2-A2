// 引入数据库连接池配置（需根据实际数据库信息修改）
const mysql = require('mysql2/promise'); // 确保使用 promise 版本

const pool = mysql.createPool({
  host: 'localhost',    // 数据库主机地址
  user: 'root',// 数据库用户名
  password: '123456', // 数据库密码
  database: 'charityevents_db',   // 数据库名称
  waitForConnections: true,
  connectionLimit: 10,   // 连接池最大连接数
  queueLimit: 0
});

// 已有测试函数（保持不变）
async function testDbConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 AS test'); 
    console.log('✅ 数据库连接池初始化成功！测试数据：', rows[0]);
  } catch (error) {
    console.error('❌ 数据库连接池初始化失败：', error.message);
    throw error;
  }
}

module.exports = { pool, testDbConnection }; // 导出供其他模块使用