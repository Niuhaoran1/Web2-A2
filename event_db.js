// 1. 引入mysql2的Promise版本（关键：必须加/promise）
const mysql = require('mysql2/promise'); 

// 2. 数据库配置（保持不变）
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456', // 替换为你的MySQL密码
  database: 'charityevents_db',
  port: 3306,
  waitForConnections: true, // 文档1中推荐的池配置
  connectionLimit: 10,      // 最大连接数
  maxIdle: 10,              // 最大空闲连接数（同connectionLimit）
  idleTimeout: 60000,       // 空闲连接超时时间（60秒）
  queueLimit: 0             // 连接请求队列无限制
};

// 3. 创建Promise兼容的连接池（直接使用mysql.createPool，无需额外升级）
const pool = mysql.createPool(dbConfig); 

// 4. 测试连接函数（可选，用于验证修复是否成功）
async function testDbConnection() {
  try {
    // 直接使用pool.query（Promise版本支持await）
    const [rows] = await pool.query('SELECT 1 AS test'); 
    console.log('✅ 数据库连接池（Promise版本）初始化成功！测试数据：', rows[0]);
  } catch (error) {
    console.error('❌ 数据库连接池初始化失败：', error.message);
    throw error;
  }
}

// 5. 导出连接池和测试函数
module.exports = {
  pool,
  testDbConnection
};