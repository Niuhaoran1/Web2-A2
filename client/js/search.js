import { searchEvents, getAllCategories } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 获取DOM元素
  const searchForm = document.getElementById('search-form');
  const categorySelect = document.getElementById('search-category');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const resultsGrid = document.getElementById('results-grid');
  const errorContainer = document.getElementById('search-error');

  // 1. 加载活动类别到下拉框（调用API获取所有类别）
  try {
    const categories = await getAllCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.category_id;
      option.textContent = category.category_name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    errorContainer.textContent = `类别加载失败：${error.message}`;
    errorContainer.style.display = 'block';
  }

  // 2. 处理表单提交（搜索活动）
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // 阻止表单默认刷新行为

    // 获取表单筛选条件（去空格，空值转为undefined）
    const filters = {
      date: searchForm.date.value.trim() || undefined,
      location: searchForm.location.value.trim() || undefined,
      categoryId: searchForm.categoryId.value || undefined
    };

    try {
      // 隐藏之前的错误提示
      errorContainer.style.display = 'none';
      // 显示加载中提示
      resultsGrid.innerHTML = `<div class="empty-message">正在搜索活动...</div>`;

      // 调用API搜索活动
      const { matchedEvents } = await searchEvents(filters);

      // 渲染搜索结果
      if (matchedEvents.length === 0) {
        resultsGrid.innerHTML = `
          <div class="empty-message">
            <h3>未找到匹配的活动</h3>
            <p>请调整筛选条件后重试（例如：移除日期限制）</p>
          </div>
        `;
        return;
      }

      // 有匹配结果：生成活动卡片（与首页卡片结构一致）
      resultsGrid.innerHTML = ''; // 清空之前的结果
      matchedEvents.forEach(event => {
        const eventImg = event.image_url || './assets/placeholder.jpg';
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
        resultsGrid.appendChild(eventCard);
      });

    } catch (error) {
      // 处理搜索错误
      errorContainer.textContent = `搜索失败：${error.message}`;
      errorContainer.style.display = 'block';
      resultsGrid.innerHTML = '';
    }
  });

  // 3. 处理“清除筛选条件”按钮点击
  clearFiltersBtn.addEventListener('click', () => {
    // 重置表单所有字段
    searchForm.reset();
    // 清空结果区域和错误提示
    resultsGrid.innerHTML = '';
    errorContainer.style.display = 'none';
  });
});

// 复用首页的日期和票价格式化函数
function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function formatPrice(price) {
  // 先将 price 转换为数字（处理字符串或 null/undefined 的情况）
  const numericPrice = Number(price);
  // 检查转换后是否为有效数字
  if (isNaN(numericPrice)) {
    return '价格未知'; // 兜底显示
  }
  return numericPrice === 0 ? '免费' : `$${numericPrice.toFixed(2)}`;
}