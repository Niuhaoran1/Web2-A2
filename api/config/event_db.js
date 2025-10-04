// 引入MySQL驱动（mysql2支持Promise，适配async/await）
const mysql = require('mysql2/promise');

// 创建数据库连接池（避免频繁创建连接，提升性能）
const pool = mysql.createPool({
  host: 'localhost',        // 本地数据库地址（默认localhost）
  user: 'root',             // 数据库用户名（根据你的本地配置修改，如root）
  password: '123456',// 数据库密码（替换为你的MySQL密码）
  database: 'charityevents_db', // 评估1创建的数据库名
  port: 3306,               // MySQL默认端口
  waitForConnections: true, // 连接池无可用连接时等待（而非报错）
  connectionLimit: 10,      // 最大连接数
  queueLimit: 0             // 等待队列无限制
});

// 测试数据库连接（可选，开发时验证是否连接成功）
const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功（charityevents_db）');
    connection.release(); // 释放连接回连接池
  } catch (err) {
    console.error('❌ 数据库连接失败：', err.message);
  }
};

// 执行测试（仅开发时执行，正式环境可注释）
testDbConnection();

// 导出连接池，供其他模块调用
module.exports = pool;