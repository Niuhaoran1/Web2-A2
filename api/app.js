// 1. 引入依赖和路由
const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes'); // 引入活动相关路由

// 2. 初始化Express应用
const app = express();

// 3. 配置中间件（需在挂载路由前配置）
// ① 解决跨域问题（允许所有客户端域名访问，开发阶段简化配置）
app.use(cors());

// ② 解析JSON格式的请求体（客户端传递JSON数据时需用到，如后续POST请求）
app.use(express.json());

// ③ 解析URL编码的请求体（客户端通过表单传递数据时需用到）
app.use(express.urlencoded({ extended: true }));

// 4. 挂载路由（所有API路径前缀为/api，如/api/home、/api/events/search）
app.use('/api', eventRoutes);

// 5. 配置服务器端口（建议使用环境变量，或默认3000端口）
const PORT = process.env.PORT || 3000;

// 6. 启动服务器并监听端口
app.listen(PORT, () => {
  console.log(`✅ API服务器已启动，监听端口：${PORT}`);
  console.log(`API访问示例：`);
  console.log(`- 首页数据：GET http://localhost:${PORT}/api/home`);
  console.log(`- 活动搜索：GET http://localhost:${PORT}/api/events/search?location=悉尼`);
  console.log(`- 活动详情：GET http://localhost:${PORT}/api/events/1`);
});

// 7. 处理404错误（访问不存在的API路径时返回）
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `未找到该API路径：${req.method} ${req.originalUrl}`
  });
});