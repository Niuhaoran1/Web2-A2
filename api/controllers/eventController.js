// 引入数据库连接池（第1部分的event_db.js）
const { pool } = require('../config/event_db');

// 1. 功能1：获取首页数据（正常+即将举行的活动 + 所有类别列表）
exports.getHomeData = async (req, res) => {
  try {
    // ① 获取当前日期时间（用于筛选“即将举行”的活动，格式：YYYY-MM-DD HH:MM:SS）
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // ② 查询所有“正常”（is_active=1）且“未结束”（event_date >= 当前时间）的活动
    // 关联organizations表获取组织名称，关联categories表获取类别名称
    const [events] = await pool.query(`
      SELECT e.*, o.org_name, c.category_name 
      FROM events e
      JOIN organizations o ON e.org_id = o.org_id
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.is_active = 1 AND e.event_date >= ?
      ORDER BY e.event_date ASC; # 按活动日期升序排列（最近的活动在前）
    `, [currentDateTime]);

    // ③ 查询所有活动类别（用于首页展示类别标签，或后续扩展筛选）
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY category_name ASC;');

    // ④ 返回成功响应（状态码200，数据包含活动列表和类别列表）
    res.status(200).json({
      success: true,
      data: {
        upcomingEvents: events, // 即将举行的活动列表
        allCategories: categories // 所有活动类别
      }
    });

  } catch (error) {
    // ⑤ 捕获错误并返回失败响应（状态码500，提示错误信息）
    console.error('获取首页数据失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，无法获取首页数据',
      error: error.message
    });
  }
};

// 2. 功能2：按条件搜索活动（日期、地点、类别）
exports.searchEvents = async (req, res) => {
  try {
    // ① 获取客户端传递的筛选条件（从URL查询参数中获取，如?date=2025-10-15&location=悉尼&categoryId=1）
    const { date, location, categoryId } = req.query;

    // ② 构建SQL查询条件（动态拼接，避免空条件影响查询）
    let query = `
      SELECT e.*, o.org_name, c.category_name 
      FROM events e
      JOIN organizations o ON e.org_id = o.org_id
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.is_active = 1 # 只查询正常状态的活动
    `;
    const queryParams = []; // 存储SQL参数（防止SQL注入）

    // 若传递了“日期”条件：筛选活动日期等于该日期的活动（忽略时间，只匹配年月日）
    if (date) {
      query += ' AND DATE(e.event_date) = ?';
      queryParams.push(date);
    }

    // 若传递了“地点”条件：筛选地点包含该关键词的活动（模糊查询，支持部分匹配）
    if (location) {
      query += ' AND e.location LIKE ?';
      queryParams.push(`%${location}%`); // %表示任意字符（如“悉尼”可匹配“悉尼皇家植物园”）
    }

    // 若传递了“类别ID”条件：筛选指定类别的活动
    if (categoryId) {
      query += ' AND e.category_id = ?';
      queryParams.push(categoryId);
    }

    // ③ 按活动日期升序排列结果
    query += ' ORDER BY e.event_date ASC;';

    // ④ 执行查询
    const [events] = await pool.query(query, queryParams);

    // ⑤ 返回结果（若无匹配活动，返回空数组，提示“无匹配数据”）
    if (events.length === 0) {
      return res.status(200).json({
        success: true,
        message: '未找到匹配的活动',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      data: {
        matchedEvents: events // 匹配的活动列表
      }
    });

  } catch (error) {
    console.error('搜索活动失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，无法搜索活动',
      error: error.message
    });
  }
};

// 3. 功能3：获取单个活动的详细信息（通过event_id）
exports.getEventDetails = async (req, res) => {
  try {
    // ① 获取活动ID（从URL路径参数中获取，如/api/events/1中的“1”）
    const eventId = req.params.eventId;

    // ② 查询指定ID的活动（关联组织和类别表，获取完整信息）
    const [events] = await pool.query(`
      SELECT e.*, o.org_name, o.contact_email, o.contact_phone, c.category_name, c.description AS category_description
      FROM events e
      JOIN organizations o ON e.org_id = o.org_id
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.event_id = ? AND e.is_active = 1; # 只查询正常状态的活动
    `, [eventId]);

    // ③ 若活动不存在（或已暂停），返回404错误
    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到该活动（可能已暂停或不存在）'
      });
    }

    // ④ 返回活动详情（取数组第一个元素，因event_id是主键，只会有一条结果）
    res.status(200).json({
      success: true,
      data: {
        eventDetails: events[0]
      }
    });

  } catch (error) {
    console.error('获取活动详情失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，无法获取活动详情',
      error: error.message
    });
  }
};