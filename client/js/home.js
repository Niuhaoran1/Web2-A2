// 导入API工具中的getHomeData函数
import { getHomeData } from './api.js';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
  // 获取DOM元素：活动网格容器、错误提示容器
  const eventsGrid = document.getElementById('events-grid');
  const errorContainer = document.getElementById('home-error');

  try {
    // 1. 调用API获取首页数据（活动列表、类别列表）
    const { upcomingEvents } = await getHomeData();

    // 2. 渲染活动列表
    if (upcomingEvents.length === 0) {
      // 无即将举行的活动：显示空提示
      eventsGrid.innerHTML = `
        <div class="empty-message">
          <h3>暂无即将举行的活动</h3>
          <p>请稍后再试或前往搜索页查找历史活动</p>
        </div>
      `;
      return;
    }

    // 有活动：循环生成活动卡片
    upcomingEvents.forEach(event => {
      // 处理活动图片（若API返回image_url为空，使用默认图片）
      const eventImg = event.image_url || './assets/placeholder.jpg';

      // 创建活动卡片HTML
      const eventCard = document.createElement('div');
      eventCard.className = 'event-card';
      eventCard.innerHTML = `
        <img src="${eventImg}" alt="${event.event_name}" class="event-card-img">
        <div class="event-card-content">
          <h3 class="event-card-title">${event.event_name}</h3>
          <div class="event-card-meta">
            <span>类别：${event.category_name}</span>
            <span>时间：${formatDateTime(event.event_date)}</span>
          </div>
          <div class="event-card-meta">
            <span>地点：${event.location}</span>
            <span>票价：${formatPrice(event.ticket_price)}</span>
          </div>
          <a href="event-details.html?eventId=${event.event_id}" class="event-card-link">查看详情</a>
        </div>
      `;

      // 将卡片添加到活动网格
      eventsGrid.appendChild(eventCard);
    });

  } catch (error) {
    // 3. 处理API调用错误：显示错误提示
    errorContainer.textContent = `加载失败：${error.message}`;
    errorContainer.style.display = 'block';
    // 清空活动网格（避免残留内容）
    eventsGrid.innerHTML = '';
  }
});

/**
 * 辅助函数1：格式化日期时间（API返回格式：YYYY-MM-DD HH:MM:SS → 显示为YYYY年MM月DD日 HH:MM）
 * @param {string} dateTimeStr - API返回的日期时间字符串
 * @returns {string} 格式化后的字符串
 */
function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * 辅助函数2：格式化票价（免费显示“免费”，收费显示“$XX.XX”）
 * @param {number} price - API返回的票价（decimal类型）
 * @returns {string} 格式化后的票价
 */
function formatPrice(price) {
  // 先将 price 转换为数字（处理字符串或 null/undefined 的情况）
  const numericPrice = Number(price);
  // 检查转换后是否为有效数字
  if (isNaN(numericPrice)) {
    return '价格未知'; // 兜底显示
  }
  return numericPrice === 0 ? '免费' : `$${numericPrice.toFixed(2)}`;
}