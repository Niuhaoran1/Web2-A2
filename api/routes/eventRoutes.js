// 1. 引入Express和路由模块
const express = require('express');
const router = express.Router(); // 创建路由实例

// 2. 引入控制器函数（关联API功能）
const eventController = require('../controllers/eventController');

// 3. 定义API端点（URL路径 + 请求方法 + 对应控制器函数）
// ① 首页数据：GET请求，路径/api/home
router.get('/home', eventController.getHomeData);

// ② 活动搜索：GET请求，路径/api/events/search（通过查询参数传递筛选条件）
router.get('/events/search', eventController.searchEvents);

// ③ 活动详情：GET请求，路径/api/events/:eventId（:eventId是动态路径参数，对应活动ID）
router.get('/events/:eventId', eventController.getEventDetails);

// 4. 导出路由（供API入口文件挂载）
module.exports = router;