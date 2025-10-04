-- 创建数据库（若不存在则创建）
CREATE DATABASE IF NOT EXISTS charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 切换到该数据库
USE charityevents_db;

-- 1. 创建活动类别表 categories
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 创建慈善组织表 organizations
CREATE TABLE IF NOT EXISTS organizations (
    org_id INT AUTO_INCREMENT PRIMARY KEY,
    org_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) NOT NULL UNIQUE,
    contact_phone VARCHAR(20) NULL,
    mission TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 创建慈善活动表 events（关联categories和organizations）
CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    org_id INT NOT NULL,
    event_date DATETIME NOT NULL,
    location VARCHAR(100) NOT NULL,
    purpose TEXT NOT NULL,
    description TEXT NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL,
    ticket_description VARCHAR(200) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    image_url VARCHAR(255) NULL,
    -- 外键关联：确保活动必须属于已存在的类别和组织
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 1. 插入活动类别（3个示例）
INSERT INTO categories (category_name, description) VALUES
('趣味跑', '以跑步为形式的公益活动，参与者可通过报名费用捐赠'),
('慈善晚宴', '高端社交晚宴，含拍卖、表演等环节，筹款效率高'),
('无声拍卖会', '无现场竞价员，参与者书面报价，所得款项捐赠公益');

-- 2. 插入慈善组织（2个示例）
INSERT INTO organizations (org_name, contact_email, contact_phone, mission) VALUES
('悉尼公益救助基金会', 'contact@sydneycharity.org', '+61-2-12345678', '致力于为悉尼贫困家庭提供教育和医疗援助'),
('澳大利亚环保慈善联盟', 'info@aueco-charity.org', '+61-3-87654321', '通过环保活动筹集资金，保护澳大利亚濒危物种');

-- 3. 插入慈善活动（8个示例，含不同类别、状态和价格）
INSERT INTO events (event_name, category_id, org_id, event_date, location, purpose, description, ticket_price, ticket_description, is_active, image_url) VALUES
-- 示例1：趣味跑（正常活动）
('2025悉尼公益趣味跑', 1, 1, '2025-10-15 08:00:00', '悉尼皇家植物园', '为贫困学生筹集学费', '5公里趣味跑，适合全年龄段，完赛后可获得公益纪念奖牌', 50.00, '含赛事T恤和饮用水', 1, 'https://example.com/images/funrun2025.jpg'),
-- 示例2：慈善晚宴（正常活动）
('2025环保慈善晚宴', 2, 2, '2025-11-20 18:30:00', '悉尼海港酒店宴会厅', '筹集濒危物种保护资金', '含3道式晚餐和慈善拍卖，拍卖品包括名人签名物品', 200.00, '含晚餐和拍卖参与资格', 1, 'https://example.com/images/gala2025.jpg'),
-- 示例3：无声拍卖会（暂停活动，首页不显示）
('社区无声拍卖会', 3, 1, '2025-09-10 14:00:00', '悉尼社区中心', '为社区老人筹集医疗设备资金', '拍卖物品包括手工艺术品和家用电器', 0.00, '免费入场，竞价金额即捐赠金额', 0, 'https://example.com/images/silentauction.jpg'),
-- 示例4-8：补充5个活动（含不同日期、价格）
('墨尔本公益趣味跑', 1, 1, '2025-10-22 09:00:00', '墨尔本阿尔伯特公园', '为流浪动物筹集救助资金', '3公里亲子跑，可携带宠物参与', 45.00, '含亲子T恤和宠物零食', 1, 'https://example.com/images/melbourne_funrun.jpg'),
('布里斯班环保晚宴', 2, 2, '2025-12-05 19:00:00', '布里斯班河畔酒店', '筹集热带雨林保护资金', '含澳洲特色餐食和原住民表演', 180.00, '含晚餐和表演门票', 1, 'https://example.com/images/brisbane_gala.jpg'),
('珀斯无声拍卖会', 3, 2, '2025-11-01 10:00:00', '珀斯文化中心', '为儿童图书馆筹集书籍资金', '拍卖物品包括稀有书籍和文化纪念品', 0.00, '免费入场，欢迎捐赠书籍', 1, 'https://example.com/images/perth_auction.jpg'),
('阿德莱德公益骑行', 1, 1, '2025-10-29 08:30:00', '阿德莱德中央广场', '为残疾人筹集无障碍设施资金', '10公里骑行，提供骑行装备租赁', 60.00, '含骑行装备和安全头盔', 1, 'https://example.com/images/adelaide_cycle.jpg'),
('堪培拉慈善音乐会', 2, 2, '2025-12-12 19:30:00', '堪培拉国家剧院', '为心理健康公益项目筹集资金', '古典音乐演奏会，邀请知名乐团', 120.00, '含音乐会门票和纪念CD', 1, 'https://example.com/images/canberra_concert.jpg');