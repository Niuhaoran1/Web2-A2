// API基础路径（第二步API服务器的地址，默认3000端口）
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * 封装fetch请求，处理通用逻辑
 * @param {string} endpoint - API端点（如'/home'、'/events/search'）
 * @param {object} options - fetch配置项（可选，如method、headers等）
 * @returns {Promise} - 返回解析后的响应数据
 */
async function fetchApi(endpoint, options = {}) {
  try {
    // 拼接完整API地址
    const url = `${API_BASE_URL}${endpoint}`;
    
    // 设置默认请求配置（GET方法，JSON格式）
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    };

    // 发送请求
    const response = await fetch(url, defaultOptions);
    
    // 解析响应（若响应不是JSON，抛出错误）
    const data = await response.json();

    // 处理API返回的错误（如404、500）
    if (!response.ok || !data.success) {
      throw new Error(data.message || `API请求失败（状态码：${response.status}）`);
    }

    // 返回成功数据
    return data.data;

  } catch (error) {
    // 捕获所有错误（网络错误、API错误），并重新抛出（由调用方处理提示）
    console.error('API调用失败：', error);
    throw error;
  }
}

/**
 * 1. 获取首页数据（调用/api/home）
 * @returns {Promise} - { upcomingEvents: [], allCategories: [] }
 */
export async function getHomeData() {
  return fetchApi('/home');
}

/**
 * 2. 搜索活动（调用/api/events/search，支持筛选条件）
 * @param {object} filters - 筛选条件（date、location、categoryId）
 * @returns {Promise} - { matchedEvents: [] }
 */
export async function searchEvents(filters) {
  // 将筛选条件转为URL查询参数（如{ location: '悉尼', date: '2025-10-15' } → '?location=悉尼&date=2025-10-15'）
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = `/events/search${queryParams ? `?${queryParams}` : ''}`;
  return fetchApi(endpoint);
}

/**
 * 3. 获取活动详情（调用/api/events/:eventId）
 * @param {number} eventId - 活动ID
 * @returns {Promise} - { eventDetails: {} }
 */
export async function getEventDetails(eventId) {
  return fetchApi(`/events/${eventId}`);
}

/**
 * 4. 获取所有活动类别（供搜索页下拉框使用，复用/api/home的类别数据）
 * @returns {Promise} - [] 类别列表
 */
export async function getAllCategories() {
  const homeData = await getHomeData();
  return homeData.allCategories;
}