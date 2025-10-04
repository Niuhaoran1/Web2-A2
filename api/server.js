// 引入核心模块
const express = require('express');
const cors = require('cors'); // 解决跨域问题（前端调用API时需跨域）

// 引入路由模块
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// 初始化Express应用
const app = express();
const PORT = 3001; // 服务器端口（建议与前端端口不同，如前端3000，后端3001）

// 注册中间件
app.use(cors()); // 允许所有跨域请求（开发环境用，正式环境可限制域名）
app.use(express.json()); // 解析JSON格式的请求体（后续评估3的POST请求会用到）
app.use(express.urlencoded({ extended: true })); // 解析表单格式的请求体

// 注册API路由（统一前缀/api，方便管理）
app.use('/api/events', eventRoutes);    // 活动相关接口（前缀/api/events）
app.use('/api/categories', categoryRoutes); // 类别相关接口（前缀/api/categories）

// 测试接口（验证服务器是否启动成功）
app.get('/', (req, res) => {
  res.send('✅ 慈善活动API服务器已启动（PROG2002 A2）');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});