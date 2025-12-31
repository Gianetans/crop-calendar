-- Crop Calendar Seed Data
-- Run this after the schema.sql to populate the crops table with 30+ crops

-- Clear existing data (optional, use with caution)
-- TRUNCATE public.crops CASCADE;

-- Insert comprehensive crop data
INSERT INTO public.crops (name, scientific_name, category, days_to_maturity, frost_tolerance, planting_depth, spacing, soil_temp_min, indoor_start_weeks, transplant_weeks, direct_sow_weeks_before_frost, direct_sow_weeks_after_frost, succession_planting_weeks, companion_plants, avoid_plants, notes) VALUES

-- Vegetables
('Tomato', 'Solanum lycopersicum', 'Vegetable', 80, 'sensitive', '1/4 inch', '24-36 inches', 60, 6, 2, NULL, NULL, NULL, 
ARRAY['Basil', 'Carrot', 'Onion', 'Parsley'], 
ARRAY['Cabbage', 'Corn', 'Potato'], 
'Start indoors 6-8 weeks before last frost. Transplant after all danger of frost has passed. Requires full sun and consistent watering.'),

('Lettuce', 'Lactuca sativa', 'Vegetable', 45, 'hardy', '1/4 inch', '6-12 inches', 40, 4, 0, 4, NULL, 2, 
ARRAY['Carrot', 'Radish', 'Cucumber'], 
ARRAY['Broccoli', 'Cabbage'], 
'Cool season crop. Direct sow 4 weeks before last frost or start indoors. Succession plant every 2 weeks for continuous harvest.'),

('Carrot', 'Daucus carota', 'Vegetable', 70, 'hardy', '1/4 inch', '2-4 inches', 45, NULL, NULL, 3, NULL, 3, 
ARRAY['Lettuce', 'Onion', 'Peas', 'Tomato'], 
ARRAY['Dill', 'Parsnip'], 
'Direct sow only. Plant 2-3 weeks before last frost. Thin seedlings to proper spacing for best root development.'),

('Pepper', 'Capsicum annuum', 'Vegetable', 75, 'sensitive', '1/4 inch', '18-24 inches', 65, 8, 3, NULL, NULL, NULL, 
ARRAY['Basil', 'Onion', 'Tomato'], 
ARRAY['Beans', 'Cabbage'], 
'Start indoors 8-10 weeks before last frost. Transplant 2-3 weeks after frost date when soil is warm.'),

('Cucumber', 'Cucumis sativus', 'Vegetable', 60, 'sensitive', '1 inch', '12-18 inches', 65, 3, 1, NULL, 2, NULL, 
ARRAY['Beans', 'Corn', 'Peas', 'Radish'], 
ARRAY['Potato', 'Sage'], 
'Start indoors or direct sow after last frost. Needs warm soil and consistent moisture. Trellis for vertical growth.'),

('Spinach', 'Spinacia oleracea', 'Vegetable', 40, 'hardy', '1/2 inch', '3-6 inches', 40, NULL, NULL, 6, NULL, 2, 
ARRAY['Peas', 'Radish', 'Strawberry'], 
ARRAY['Potato'], 
'Cold hardy crop. Direct sow 6 weeks before last frost. Best in cool weather, bolts in heat.'),

('Broccoli', 'Brassica oleracea', 'Vegetable', 70, 'hardy', '1/4 inch', '18-24 inches', 45, 6, 0, 2, NULL, NULL, 
ARRAY['Beets', 'Onion', 'Potato'], 
ARRAY['Tomato', 'Strawberry'], 
'Cool season crop. Start indoors 6 weeks before last frost or direct sow 2 weeks before frost.'),

('Zucchini', 'Cucurbita pepo', 'Vegetable', 50, 'sensitive', '1 inch', '24-36 inches', 65, 2, NULL, NULL, 2, NULL, 
ARRAY['Beans', 'Corn', 'Peas'], 
ARRAY['Potato'], 
'Warm season crop. Direct sow 1-2 weeks after last frost. Very productive, 1-2 plants sufficient for most families.'),

('Radish', 'Raphanus sativus', 'Vegetable', 25, 'hardy', '1/2 inch', '2 inches', 45, NULL, NULL, 4, NULL, 1, 
ARRAY['Carrot', 'Cucumber', 'Lettuce', 'Spinach'], 
ARRAY['Hyssop'], 
'Fast growing. Direct sow 4-6 weeks before last frost. Succession plant weekly for continuous harvest.'),

('Peas', 'Pisum sativum', 'Legume', 60, 'hardy', '1-2 inches', '2-4 inches', 45, NULL, NULL, 6, NULL, 2, 
ARRAY['Carrot', 'Cucumber', 'Corn', 'Radish'], 
ARRAY['Onion', 'Garlic'], 
'Cool season crop. Direct sow 6-8 weeks before last frost. Provide trellis for climbing varieties.'),

('Green Beans', 'Phaseolus vulgaris', 'Legume', 55, 'sensitive', '1 inch', '4-6 inches', 60, NULL, NULL, NULL, 1, 2, 
ARRAY['Carrot', 'Cucumber', 'Corn'], 
ARRAY['Onion', 'Garlic'], 
'Warm season crop. Direct sow 1 week after last frost. Succession plant every 2 weeks.'),

('Onion', 'Allium cepa', 'Vegetable', 100, 'hardy', '1/2 inch', '4-6 inches', 50, 8, 0, 4, NULL, NULL, 
ARRAY['Beets', 'Carrot', 'Tomato', 'Lettuce'], 
ARRAY['Beans', 'Peas'], 
'Plant sets or transplants 4 weeks before last frost. Long growing season required.'),

('Kale', 'Brassica oleracea', 'Vegetable', 55, 'hardy', '1/2 inch', '12-18 inches', 45, 4, 0, 6, NULL, NULL, 
ARRAY['Beets', 'Onion', 'Potato'], 
ARRAY['Tomato', 'Strawberry'], 
'Very cold hardy. Direct sow or transplant 6 weeks before last frost. Flavor improves after light frost.'),

('Squash', 'Cucurbita maxima', 'Vegetable', 90, 'sensitive', '1 inch', '36-48 inches', 65, 2, NULL, NULL, 2, NULL, 
ARRAY['Beans', 'Corn', 'Peas'], 
ARRAY['Potato'], 
'Warm season crop. Direct sow 2 weeks after last frost. Requires lots of space.'),

('Beets', 'Beta vulgaris', 'Vegetable', 55, 'hardy', '1/2 inch', '3-4 inches', 50, NULL, NULL, 3, NULL, 3, 
ARRAY['Broccoli', 'Onion', 'Cabbage'], 
ARRAY['Beans'], 
'Direct sow 3-4 weeks before last frost. Succession plant every 3 weeks.'),

('Cabbage', 'Brassica oleracea', 'Vegetable', 70, 'hardy', '1/4 inch', '18-24 inches', 45, 6, 0, NULL, NULL, NULL, 
ARRAY['Beets', 'Onion', 'Potato'], 
ARRAY['Tomato', 'Strawberry'], 
'Cool season crop. Start indoors 6 weeks before frost. Transplant at frost date.'),

('Cauliflower', 'Brassica oleracea', 'Vegetable', 75, 'hardy', '1/4 inch', '18-24 inches', 45, 6, 0, NULL, NULL, NULL, 
ARRAY['Beets', 'Onion', 'Celery'], 
ARRAY['Tomato', 'Strawberry'], 
'Cool season crop. Start indoors 6 weeks before last frost. More challenging than broccoli.'),

('Brussels Sprouts', 'Brassica oleracea', 'Vegetable', 100, 'hardy', '1/4 inch', '18-24 inches', 45, 6, 0, NULL, NULL, NULL, 
ARRAY['Beets', 'Carrot', 'Onion'], 
ARRAY['Tomato', 'Strawberry'], 
'Long season crop. Start indoors 6 weeks before frost. Flavor improves after frost.'),

('Arugula', 'Eruca sativa', 'Vegetable', 30, 'hardy', '1/4 inch', '4-6 inches', 40, NULL, NULL, 4, NULL, 2, 
ARRAY['Beets', 'Carrot', 'Cucumber'], 
ARRAY['Strawberry'], 
'Fast growing salad green. Direct sow 4 weeks before frost. Succession plant every 2 weeks.'),

('Turnip', 'Brassica rapa', 'Vegetable', 50, 'hardy', '1/2 inch', '4-6 inches', 45, NULL, NULL, 4, NULL, NULL, 
ARRAY['Peas', 'Onion'], 
ARRAY['Potato'], 
'Cool season crop. Direct sow 4 weeks before last frost or in late summer for fall harvest.'),

('Swiss Chard', 'Beta vulgaris', 'Vegetable', 55, 'hardy', '1/2 inch', '6-12 inches', 50, 3, 0, 2, NULL, NULL, 
ARRAY['Beans', 'Cabbage', 'Onion'], 
ARRAY['Potato'], 
'Easy to grow. Direct sow 2-4 weeks before frost or start indoors. Cut-and-come-again harvest.'),

('Eggplant', 'Solanum melongena', 'Vegetable', 80, 'sensitive', '1/4 inch', '24-36 inches', 70, 8, 3, NULL, NULL, NULL, 
ARRAY['Beans', 'Pepper', 'Spinach'], 
ARRAY['Potato'], 
'Start indoors 8-10 weeks before frost. Transplant after soil warms, 2-3 weeks after frost date.'),

('Corn', 'Zea mays', 'Grain', 75, 'sensitive', '1-2 inches', '12 inches', 60, NULL, NULL, NULL, 2, NULL, 
ARRAY['Beans', 'Cucumber', 'Squash'], 
ARRAY['Tomato'], 
'Direct sow 1-2 weeks after last frost. Plant in blocks for better pollination. Requires warm soil.'),

('Pumpkin', 'Cucurbita pepo', 'Vegetable', 110, 'sensitive', '1 inch', '48-72 inches', 65, 2, NULL, NULL, 2, NULL, 
ARRAY['Beans', 'Corn', 'Radish'], 
ARRAY['Potato'], 
'Long season crop. Direct sow 2 weeks after frost. Requires lots of space and consistent water.'),

-- Herbs
('Basil', 'Ocimum basilicum', 'Herb', 60, 'sensitive', '1/4 inch', '10-12 inches', 70, 6, 2, NULL, NULL, NULL, 
ARRAY['Tomato', 'Pepper'], 
ARRAY['Rue'], 
'Warm weather herb. Start indoors 6 weeks before frost or direct sow after frost. Pinch flowers for bushier growth.'),

('Cilantro', 'Coriandrum sativum', 'Herb', 50, 'hardy', '1/4 inch', '6 inches', 55, NULL, NULL, 3, NULL, 3, 
ARRAY['Tomato', 'Pepper', 'Beans'], 
ARRAY['Fennel'], 
'Cool season herb. Direct sow 3 weeks before frost. Succession plant for continuous harvest. Bolts in heat.'),

('Parsley', 'Petroselinum crispum', 'Herb', 70, 'hardy', '1/4 inch', '8-10 inches', 50, 8, 0, 3, NULL, NULL, 
ARRAY['Tomato', 'Carrot', 'Asparagus'], 
ARRAY['Lettuce'], 
'Slow to germinate. Start indoors 8 weeks before frost or direct sow 3 weeks before frost.'),

-- Fruits
('Strawberry', 'Fragaria × ananassa', 'Fruit', 90, 'hardy', 'crown level', '12 inches', 60, NULL, NULL, NULL, 2, NULL, 
ARRAY['Beans', 'Lettuce', 'Onion', 'Spinach'], 
ARRAY['Cabbage', 'Broccoli'], 
'Perennial. Plant in spring 2 weeks after frost. Harvest begins second year. Mulch for winter protection.'),

('Melon', 'Cucumis melo', 'Fruit', 85, 'sensitive', '1 inch', '36-48 inches', 70, 3, NULL, NULL, 2, NULL, 
ARRAY['Corn', 'Radish', 'Beans'], 
ARRAY['Potato'], 
'Warm season crop. Start indoors 3-4 weeks before frost or direct sow 2 weeks after frost. Needs heat to ripen.'),

-- Additional Vegetables
('Garlic', 'Allium sativum', 'Vegetable', 240, 'hardy', '2 inches', '6 inches', 32, NULL, NULL, NULL, NULL, NULL, 
ARRAY['Tomato', 'Rose', 'Beets'], 
ARRAY['Beans', 'Peas'], 
'Plant cloves in fall (8-10 weeks before ground freezes) for summer harvest. Requires cold period to form bulbs.');

-- Verify the insert
SELECT COUNT(*) as total_crops FROM public.crops;
SELECT category, COUNT(*) as count FROM public.crops GROUP BY category ORDER BY category;
