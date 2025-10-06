const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000; // 统一使用3000端口，与app.js保持一致

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由配置
app.use('/api', eventRoutes);
app.use('/api/categories', categoryRoutes);

// 测试接口
app.get('/', (req, res) => {
  res.send('✅ 慈善活动API服务器已启动（PROG2002 A2）');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});