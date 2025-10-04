const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
// 引入修复后的数据库连接池和测试函数
const { testDbConnection } = require('./config/event_db'); 

const app = express();
// 中间件配置（不变）
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 挂载路由（不变）
app.use('/api', eventRoutes);

// 端口配置（不变）
const PORT = process.env.PORT || 3000;

// 修复：先测试数据库连接，再启动服务器
async function startServer() {
  try {
    // 测试数据库连接池是否正常（Promise版本）
    await testDbConnection(); 
    // 连接成功后启动服务器
    app.listen(PORT, () => {
      console.log(`✅ API服务器已启动，监听端口：${PORT}`);
      console.log(`- 首页数据测试：GET http://localhost:${PORT}/api/home`);
      console.log(`- 活动搜索测试：GET http://localhost:${PORT}/api/events/search?location=悉尼`);
    });
  } catch (error) {
    // 连接失败则终止启动，打印错误
    console.error('❌ 服务器启动失败（数据库连接异常）：', error.message);
    process.exit(1); // 退出进程，避免启动无效服务器
  }
}

// 启动服务器
startServer();

// 404处理（不变）
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `未找到该API路径：${req.method} ${req.originalUrl}`
  });
});