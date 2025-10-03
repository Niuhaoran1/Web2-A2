-- 1. 创建数据库（若不存在）
CREATE DATABASE IF NOT EXISTS charityevents_db;
USE charityevents_db;

-- 2. 创建类别表（categories）
CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY, -- 类别ID（主键）
  category_name VARCHAR(50) NOT NULL UNIQUE, -- 类别名称（如“趣味跑”）
  description TEXT -- 类别描述（可选，如“户外公益跑步活动”）
);

-- 3. 创建慈善组织表（organizations）
CREATE TABLE IF NOT EXISTS organizations (
  org_id INT AUTO_INCREMENT PRIMARY KEY, -- 组织ID（主键）
  org_name VARCHAR(100) NOT NULL, -- 组织名称
  mission TEXT, -- 组织使命（对应前端“使命宣言”）
  contact_email VARCHAR(100), -- 联系邮箱
  contact_phone VARCHAR(20) -- 联系电话
);

-- 4. 创建活动表（events）
CREATE TABLE IF NOT EXISTS events (
  event_id INT AUTO_INCREMENT PRIMARY KEY, -- 活动ID（主键）
  event_name VARCHAR(100) NOT NULL, -- 活动名称
  category_id INT, -- 关联类别表（外键）
  org_id INT, -- 关联组织表（外键）
  event_date DATETIME NOT NULL, -- 活动日期时间（如“2025-10-01 14:00:00”）
  location VARCHAR(100) NOT NULL, -- 活动地点（如“悉尼歌剧院”）
  purpose TEXT NOT NULL, -- 活动目的（筹款用途）
  description TEXT, -- 活动详细描述
  ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- 票价（支持免费，默认0）
  target_amount DECIMAL(15,2) NOT NULL, -- 筹款目标金额
  current_amount DECIMAL(15,2) DEFAULT 0.00, -- 当前筹款金额
  status ENUM('active', 'paused', 'ended') DEFAULT 'active', -- 活动状态（active=正常，paused=暂停，ended=已结束）
  image_url VARCHAR(255), -- 活动图片URL（前端展示用，可填网络图片地址）
  -- 外键约束：确保类别和组织存在
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE SET NULL
);
-- 插入类别数据
INSERT INTO categories (category_name, description) VALUES
('趣味跑', '户外公益跑步活动，适合全年龄段'),
('慈善晚宴', '高端餐饮活动，含拍卖、表演环节'),
('无声拍卖会', '无现场竞价，通过书面报价捐赠'),
('公益音乐会', '邀请艺人演出，门票收入捐赠公益');

-- 插入组织数据
INSERT INTO organizations (org_name, mission, contact_email, contact_phone) VALUES
('澳大利亚儿童基金会', '为贫困儿童提供教育和医疗支持', 'contact@childfund.org.au', '02-12345678'),
('环保行动联盟', '推广可持续发展，保护自然环境', 'info@ecoaction.org.au', '02-87654321'),
('社区关怀协会', '帮扶社区老人和残障人士', 'support@communitycare.org.au', '02-55556666');

-- 插入8个活动数据（注意event_date需包含“即将举行”和“已结束”，status对应）
INSERT INTO events (event_name, category_id, org_id, event_date, location, purpose, description, ticket_price, target_amount, current_amount, status, image_url) VALUES
-- 活动1：即将举行（2025-10-05）
('悉尼公益趣味跑', 1, 1, '2025-10-05 09:00:00', '悉尼皇家植物园', '为贫困儿童筹集教育基金', '5公里趣味跑，可携带家人参与，终点有抽奖环节', 50.00, 50000.00, 28000.00, 'active', 'https://example.com/funrun.jpg'),
-- 活动2：即将举行（2025-10-12）
('墨尔本慈善晚宴', 2, 2, '2025-10-12 18:30:00', '墨尔本皇冠酒店', '筹集环保项目资金', '含三道菜晚餐和慈善拍卖，拍卖品包括球星签名球衣', 200.00, 100000.00, 65000.00, 'active', 'https://example.com/gala.jpg'),
-- 活动3：已结束（2025-09-01）
('布里斯班无声拍卖会', 3, 3, '2025-09-01 14:00:00', '布里斯班会展中心', '帮扶社区老人', '拍卖品包括艺术品、度假套餐，所有收入捐赠老人护理项目', 0.00, 30000.00, 32000.00, 'ended', 'https://example.com/auction.jpg'),
-- 活动4-8：自行补充（确保覆盖不同类别和状态）
('珀斯公益音乐会', 4, 1, '2025-10-20 19:00:00', '珀斯音乐厅', '为儿童医疗设备筹款', '邀请本地乐队演出，现场接受额外捐赠', 80.00, 40000.00, 15000.00, 'active', 'https://example.com/concert.jpg'),
('阿德莱德趣味跑', 1, 3, '2025-09-20 10:00:00', '阿德莱德中央公园', '为残障人士购买辅助设备', '3公里亲子跑，完成可获得纪念奖牌', 40.00, 20000.00, 18000.00, 'active', 'https://example.com/adl-funrun.jpg'),
('堪培拉慈善晚宴', 2, 2, '2025-08-15 18:00:00', '堪培拉议会大厦宴会厅', '筹集森林保护资金', '政府官员出席，拍卖政府参观名额', 250.00, 80000.00, 85000.00, 'ended', 'https://example.com/canberra-gala.jpg'),
('黄金海岸无声拍卖会', 3, 1, '2025-10-08 15:00:00', '黄金海岸希尔顿酒店', '为儿童教育项目筹款', '拍卖品包括豪华邮轮之旅', 0.00, 60000.00, 35000.00, 'active', 'https://example.com/gc-auction.jpg'),
('霍巴特公益音乐会', 4, 3, '2025-09-10 19:30:00', '霍巴特大剧院', '帮扶社区低收入家庭', '古典音乐演奏会，现场设置捐赠箱', 60.00, 25000.00, 22000.00, 'ended', 'https://example.com/hobart-concert.jpg');