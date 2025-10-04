import { getEventDetails } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 获取DOM元素
  const errorContainer = document.getElementById('details-error');
  const eventDetailsContainer = document.getElementById('event-details');
  const loadingContainer = document.getElementById('loading');
  const registerBtn = document.getElementById('register-btn');
  const registerModal = document.getElementById('register-modal');
  const modalCloseBtn = document.getElementById('modal-close');

  // 1. 从URL查询参数中获取活动ID（如：event-details.html?eventId=1 → 获取1）
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('eventId');

  // 验证活动ID是否存在且为数字
  if (!eventId || isNaN(Number(eventId))) {
    errorContainer.textContent = '无效的活动ID，请从首页或搜索页进入详情页';
    errorContainer.style.display = 'block';
    loadingContainer.style.display = 'none';
    return;
  }

  try {
    // 2. 调用API获取活动详情
    const { eventDetails } = await getEventDetails(Number(eventId));

    // 3. 渲染活动详情到DOM
    // 隐藏加载中提示，显示详情容器
    loadingContainer.style.display = 'none';
    eventDetailsContainer.style.display = 'block';

    // 填充详情数据
    document.getElementById('event-title').textContent = `${eventDetails.event_name} - 详情`;
    document.getElementById('event-name').textContent = eventDetails.event_name;
    document.getElementById('event-org').textContent = eventDetails.org_name;
    document.getElementById('event-category').textContent = eventDetails.category_name;
    document.getElementById('event-date').textContent = formatDateTime(eventDetails.event_date);
    document.getElementById('event-location').textContent = eventDetails.location;
    document.getElementById('event-price').textContent = formatPrice(eventDetails.ticket_price);
    document.getElementById('event-purpose').textContent = eventDetails.purpose;
    document.getElementById('event-description').textContent = eventDetails.description;
    // 票务说明（若为空，显示“无特殊说明”）
    document.getElementById('event-ticket-desc').textContent = eventDetails.ticket_description || '无特殊票务说明';
    // 活动图片
    const eventImg = eventDetails.image_url || './assets/placeholder.jpg';
    document.getElementById('event-img').src = eventImg;
    document.getElementById('event-img').alt = eventDetails.event_name;

    // 4. 注册按钮点击事件：显示模态框
    registerBtn.addEventListener('click', () => {
      registerModal.style.display = 'flex'; // 显示模态框（flex实现居中）
    });

    // 5. 关闭模态框（点击关闭按钮或模态框背景）
    modalCloseBtn.addEventListener('click', () => {
      registerModal.style.display = 'none';
    });
    // 点击模态框背景关闭
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) {
        registerModal.style.display = 'none';
      }
    });

  } catch (error) {
    // 6. 处理API错误
    loadingContainer.style.display = 'none';
    errorContainer.textContent = `加载详情失败：${error.message}`;
    errorContainer.style.display = 'block';
  }
});

// 复用日期和票价格式化函数
function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function formatPrice(price) {
  return price === 0 ? '免费' : `$${price.toFixed(2)}`;
}