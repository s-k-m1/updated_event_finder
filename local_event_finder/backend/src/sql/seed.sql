-- Local Event Finder — Seed Data (mirrors the frontend content exactly)

INSERT INTO categories (name, slug, icon_name, bg_color, event_count, description, image_url, is_featured, sort_order) VALUES
('Music',     'music',     'Music',     '#F6DEEC', 48, 'Concerts, open mics, festivals and live performances',                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=220&fit=crop&auto=format', TRUE,  1),
('Tech',      'tech',      'Laptop',    '#E6DDF4', 31, 'Hackathons, summits, workshops and startup events',                   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=220&fit=crop&auto=format', TRUE,  2),
('Sports',    'sports',    'Trophy',    '#D7F0E3', 24, 'Marathons, trail runs, matches and outdoor challenges',                NULL, FALSE, 3),
('Education', 'education', 'BookOpen',  '#FAEAD0', 57, 'Classes, workshops, masterclasses and learning sessions',              NULL, FALSE, 4),
('Culture',   'culture',   'Landmark',  '#E6DDF4', 19, 'Heritage walks, exhibitions, art shows and cultural fests',            'https://imgs.search.brave.com/5JjPJUDQrJw0I1k0NhlMQMUYq4WVxbV-q4v67t-_5jI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lbi5z/ZXRvcGF0aS5jb20v/dXBsb2Fkcy9lZGl0/b3IvSGVyaXRhZ2Ut/V2Fsay9IZXJpdGFn/ZS1XYWxrLTEwLmpw/ZWc', TRUE,  5),
('Business',  'business',  'Briefcase', '#DCEAF7', 36, 'Networking, pitch nights, summits and startup events',                 NULL, FALSE, 6),
('Food',      'food',      'Utensils',  '#FAEAD0', 22, 'Food festivals, cooking classes and culinary experiences',             NULL, FALSE, 7),
('Arts',      'arts',      'Palette',   '#F6DEEC', 15, 'Art exhibitions, theater, dance and creative workshops',               NULL, FALSE, 8),
('Outdoor',   'outdoor',   'Mountain',  '#D7F0E3', 29, 'Hiking, camping, treks and nature experiences',                        NULL, FALSE, 9);

INSERT INTO events (slug, title, category_id, rating, price, price_value, event_date, event_time, location, city, badge, image_url, description, attendees, is_featured, is_trending, is_live, live_ago, organizer) VALUES
('kathmandu-tech-summit-2025', 'Kathmandu Tech Summit 2025', (SELECT id FROM categories WHERE slug='tech'), 4.8, 'NPR 800', 800, 'Sat, 26 Jul 2025', '9:00 AM – 6:00 PM', 'Hyatt Regency, Kathmandu', 'kathmandu', 'Featured', '/kathmandutechsubmmit.jpg', 'Nepal''s biggest technology summit bringing together developers, startups, and industry leaders for talks, hackathons, and networking.', 0, TRUE, TRUE, FALSE, '', 'Local Event Finder Team'),

('nepal-music-festival-monsoon', 'Nepal Music Festival — Monsoon Season', (SELECT id FROM categories WHERE slug='music'), 4.9, 'NPR 1,200', 1200, 'Sun, 8 Jul 2025', '3:00 PM – 11:00 PM', 'Tundikhel Open Air, Kathmandu', 'kathmandu', 'Trending', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=340&fit=crop&auto=format', 'A full day of live music under the monsoon skies featuring Nepal''s top artists across multiple stages.', 0, TRUE, TRUE, FALSE, '', 'Local Event Finder Team'),

('himalayan-startup-weekend', 'Himalayan Startup Weekend', (SELECT id FROM categories WHERE slug='business'), 4.7, 'Free', 0, 'Fri–Sun, 11–13 Jul 2025', 'All Day', 'Hotel Yak & Yeti, Kathmandu', 'kathmandu', 'Featured', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=340&fit=crop&auto=format', '54 hours to pitch, build, and launch a startup with mentors, investors, and a community of founders.', 0, TRUE, TRUE, FALSE, '', 'Local Event Finder Team'),

('patan-heritage-photography-walk', 'Patan Heritage Photography Walk', (SELECT id FROM categories WHERE slug='culture'), 4.8, 'NPR 500', 500, 'Sat, 19 Jul 2025', '6:30 AM – 10:00 AM', 'Patan Durbar Square', 'patan', '', 'https://imgs.search.brave.com/5JjPJUDQrJw0I1k0NhlMQMUYq4WVxbV-q4v67t-_5jI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lbi5z/ZXRvcGF0aS5jb20v/dXBsb2Fkcy9lZGl0/b3IvSGVyaXRhZ2Ut/V2Fsay9IZXJpdGFnZS1XYWxrLTEwLmpw/ZWc', 'A guided sunrise walk through the courtyards and temples of Patan Durbar Square, capturing heritage through your lens.', 0, TRUE, FALSE, FALSE, '', 'Local Event Finder Team'),

('nepal-yoga-wellness-retreat', 'Nepal Yoga & Wellness Retreat', (SELECT id FROM categories WHERE slug='sports'), 4.8, 'NPR 2,500', 2500, 'Sat, 26 Jul 2025', '6:00 AM – 8:00 PM', 'Nagarjun Eco Resort', 'kathmandu', 'Popular', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=340&fit=crop&auto=format', 'A full-day retreat with yoga, meditation, forest walks, and wellness workshops in the hills above Kathmandu.', 0, TRUE, FALSE, FALSE, '', 'Local Event Finder Team'),

('monsoon-cooking-masterclass', 'Monsoon Cooking Masterclass', (SELECT id FROM categories WHERE slug='education'), 4.7, 'NPR 1,800', 1800, 'Sat, 2 Aug 2025', '11:00 AM – 2:00 PM', 'Hotel Yak & Yeti, Kathmandu', 'kathmandu', '', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=340&fit=crop&auto=format', 'Hands-on Nepali monsoon cooking class — learn seasonal dishes with a professional chef, then taste your creations.', 0, TRUE, FALSE, FALSE, '', 'Local Event Finder Team'),

('pokhara-trail-running-championship', 'Pokhara Trail Running Championship', (SELECT id FROM categories WHERE slug='sports'), 4.6, 'NPR 1,000', 1000, 'Sun, 3 Aug 2025', '6:00 AM – 12:00 PM', 'Lakeside, Pokhara', 'pokhara', 'Trending', 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=340&fit=crop&auto=format', 'Race through the trails around Phewa Lake and the Pokhara hills — 10K, 21K, and 42K distances.', 0, FALSE, TRUE, FALSE, '', 'Local Event Finder Team'),

('kathmandu-jazz-night', 'Kathmandu Jazz Night', (SELECT id FROM categories WHERE slug='music'), 4.7, 'NPR 700', 700, 'Sat, 7 Aug 2026', '7:00 PM – 11:00 PM', 'Thamel, KTM', 'kathmandu', 'LIVE', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=340&fit=crop&auto=format', 'Live jazz with the city''s finest musicians in the heart of Thamel.', 154, FALSE, FALSE, TRUE, '2 mins ago', 'Jazz Club Kathmandu'),

('startup-pitch-evening', 'Startup Pitch Evening', (SELECT id FROM categories WHERE slug='business'), 4.6, 'Free', 0, 'Fri, 7 Aug 2026', '6:30 PM – 9:30 PM', 'Hub Kathmandu', 'kathmandu', 'LIVE', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=340&fit=crop&auto=format', 'Early-stage startups pitch to investors and mentors in a friendly, constructive setting.', 88, FALSE, FALSE, TRUE, '5 mins ago', 'Hub Kathmandu'),

('yoga-at-bouddha', 'Yoga at Bouddha', (SELECT id FROM categories WHERE slug='sports'), 4.9, 'NPR 300', 300, 'Fri, 7 Aug 2026', '6:30 AM – 8:00 AM', 'Boudhanath Stupa', 'kathmandu', 'LIVE', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=340&fit=crop&auto=format', 'Sunrise yoga session overlooking the Boudhanath Stupa with expert instructors.', 45, FALSE, FALSE, TRUE, '8 mins ago', 'Bouddha Wellness Collective'),

('classical-table-night', 'Classical Table Night', (SELECT id FROM categories WHERE slug='culture'), 4.8, 'NPR 900', 900, 'Fri, 7 Aug 2026', '7:00 PM – 10:00 PM', 'Patan Durbar', 'patan', 'LIVE', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=340&fit=crop&auto=format', 'An intimate evening of classical tabla and sitar performances in a heritage courtyard.', 67, FALSE, FALSE, TRUE, '12 mins ago', 'Patan Heritage Society'),

('street-food-festival', 'Street Food Festival', (SELECT id FROM categories WHERE slug='food'), 4.9, 'Free', 0, 'Sat, 8 Aug 2026', '4:00 PM – 10:00 PM', 'Basantapur Sq.', 'kathmandu', 'LIVE', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=340&fit=crop&auto=format', '50+ food stalls serving the best street food from across Nepal at Basantapur Square.', 410, FALSE, FALSE, TRUE, '3 mins ago', 'Kathmandu Foodies');

INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Admin', 'admin@eventfinder.com', '+977 9800000000', '$2b$10$BhDctaM0eiA3uQgh8EiPbuOPcUl1Azg2LDfGPn6GRarhTkdDJ5JU.', 'admin'),
('Parika Bhandari', 'parika@eventfinder.com', '+977 9811111111', '$2b$10$BhDctaM0eiA3uQgh8EiPbuOPcUl1Azg2LDfGPn6GRarhTkdDJ5JU.', 'user');

INSERT INTO site_content (key, value) VALUES
('hero_stats', '{
  "stats": [
    { "number": "500+", "label": "EVENTS LISTED" },
    { "number": "12K+", "label": "REGISTRATIONS" },
    { "number": "47",   "label": "DISTRICTS" },
    { "number": "4.9★", "label": "AVG RATING" }
  ]
}'),
('mission', '{
  "label": "OUR MISSION",
  "heading": "Bringing Nepal''s Communities",
  "heading_break": "Together Through Events",
  "paragraphs": [
    "Local Event Finder was built to solve a simple problem — it was too hard to know what was happening in your city. From Kathmandu to Pokhara, incredible events were being missed because there was no single place to discover them.",
    "We built a platform where organizers can list events for free, and attendees can discover, register, and attend with ease. Our mission is to make community participation effortless and joyful."
  ],
  "stats": [
    { "icon": "☆", "number": "4.9★", "label": "Avg Rating" },
    { "icon": "♧", "number": "12K+", "label": "Registered Users" },
    { "icon": "⌖", "number": "47",   "label": "Districts Covered" },
    { "icon": "✓", "number": "500+", "label": "Events Hosted" }
  ],
  "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=500&fit=crop&auto=format",
  "trusted": { "title": "Trusted Platform", "text": "4.9★ avg across 500+ events" }
}'),
('how_it_works', '{
  "heading": "Three Simple Steps",
  "steps": [
    { "number": "01", "icon": "⌕", "title": "Discover Events", "description": "Search by category, location, or keyword. Filter by date, price, and more to find exactly what you''re looking for." },
    { "number": "02", "icon": "♙", "title": "Register Easily", "description": "One-click registration with your account. Get a confirmation email and digital ticket instantly." },
    { "number": "03", "icon": "✣", "title": "Attend & Enjoy", "description": "Show up, check in with your QR code, and enjoy the experience. Leave a review afterward." }
  ]
}'),
('features', '{
  "heading": "Everything You Need",
  "features": [
    { "icon": "◉", "title": "Event Discovery", "description": "Find events near you based on location, interests, and availability — updated daily.", "iconClass": "purple" },
    { "icon": "ϟ", "title": "Live Events", "description": "Stream or attend events live as they happen across Nepal in real time.", "iconClass": "orange" },
    { "icon": "♡", "title": "Save Events", "description": "Bookmark events you''re interested in and revisit them anytime before registering.", "iconClass": "pink" },
    { "icon": "♧", "title": "Notifications", "description": "Get reminders and updates for events you''ve saved or registered for.", "iconClass": "green" }
  ]
}'),
('founder', '{
  "name": "Parika Bhandari",
  "role": "Founder & CEO",
  "initials": "PB",
  "image": "/person.jpeg.jpeg",
  "quote": "I, Parika Bhandari, built Local Event Finder to solve a problem I experienced firsthand — incredible events taking place around me in Nepal were simply invisible to most people. Concerts, workshops, cultural festivals, and tech summits were being missed because there was no single place to discover them. I turned that frustration into Nepal''s premier event discovery platform, connecting communities from Kathmandu to Pokhara and beyond."
}'),
('cta', '{
  "badge": "GET STARTED",
  "heading": "Start Exploring Events",
  "paragraph": "Join thousands of Nepalis discovering and attending incredible local events every week.",
  "paragraph2": "Discover, register, and experience the best local events across Nepal"
}'),
('about_hero', '{
  "label": "ABOUT US",
  "heading": "About ",
  "heading_span": "Local Event ",
  "heading_break": "Finder",
  "description": "Connecting people with local events across Nepal — concerts, workshops, tech summits, and cultural festivals."
}'),
('footer', '{
  "brand": "LocalEvent",
  "brand_span": "Finder",
  "tagline": "FINDER · NEPAL",
  "description": "Nepal''s premier event discovery platform. Find, register, and experience the best local events from Kathmandu to Pokhara.",
  "platform_links": ["Browse Events", "Create Event", "Categories", "Map View", "Live Events", "My Registrations"],
  "company_links": ["About Us", "Contact", "Privacy Policy", "Terms of Service", "Help Center", "Blog"],
  "copyright": "© 2025 Local Event Finder — Nepal. All rights reserved."
}');

-- Realistic coordinates so the "Events Near You" map can geo-locate events
UPDATE events SET lat = 27.7172, lng = 85.3240 WHERE slug = 'kathmandu-tech-summit-2025';
UPDATE events SET lat = 27.6875, lng = 85.3172 WHERE slug = 'nepal-music-festival-monsoon';
UPDATE events SET lat = 27.7108, lng = 85.3200 WHERE slug = 'himalayan-startup-weekend';
UPDATE events SET lat = 27.6720, lng = 85.3220 WHERE slug = 'patan-heritage-photography-walk';
UPDATE events SET lat = 27.7278, lng = 85.3024 WHERE slug = 'nepal-yoga-wellness-retreat';
UPDATE events SET lat = 27.7108, lng = 85.3190 WHERE slug = 'monsoon-cooking-masterclass';
UPDATE events SET lat = 28.2096, lng = 83.9856 WHERE slug = 'pokhara-trail-running-championship';
UPDATE events SET lat = 27.7164, lng = 85.3082 WHERE slug = 'kathmandu-jazz-night';
UPDATE events SET lat = 27.7150, lng = 85.3100 WHERE slug = 'startup-pitch-evening';
UPDATE events SET lat = 27.7222, lng = 85.3618 WHERE slug = 'yoga-at-bouddha';
UPDATE events SET lat = 27.6710, lng = 85.3260 WHERE slug = 'classical-table-night';
UPDATE events SET lat = 27.7046, lng = 85.3052 WHERE slug = 'street-food-festival';

-- =====================================================================
-- ADDITIONAL TEST DATA
-- Dates are spread across "Today", "This Week", "This Month" and a
-- future month so the date filter is fully testable. Multiple cities
-- are included so the location dropdown has options beyond Kathmandu.
-- =====================================================================

INSERT INTO events (slug, title, category_id, rating, price, price_value, event_date, event_time, location, city, badge, image_url, description, attendees, is_featured, is_trending, is_live, live_ago, organizer) VALUES
-- TODAY (Thu, 27 Aug 2026)
('live-coding-bootcamp', 'Live Coding Bootcamp', (SELECT id FROM categories WHERE slug='tech'), 4.6, 'Free', 0, 'Thu, 27 Aug 2026', '10:00 AM – 4:00 PM', 'Inovation Hub, Kathmandu', 'kathmandu', 'Free', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=340&fit=crop&auto=format', 'A hands-on, mentor-led bootcamp covering modern web development from zero to deployed.', 0, TRUE, FALSE, FALSE, '', 'Inovation Hub'),
('kathmandu-food-crawl', 'Kathmandu Food Crawl', (SELECT id FROM categories WHERE slug='food'), 4.8, 'NPR 1,500', 1500, 'Thu, 27 Aug 2026', '5:00 PM – 9:00 PM', 'Thamel, Kathmandu', 'kathmandu', 'Popular', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=340&fit=crop&auto=format', 'Guided tasting tour through the best hidden eateries of Thamel.', 0, TRUE, FALSE, FALSE, '', 'Kathmandu Foodies'),
('poetry-open-mic-lalitpur', 'Poetry Open Mic', (SELECT id FROM categories WHERE slug='arts'), 4.7, 'Free', 0, 'Thu, 27 Aug 2026', '6:00 PM – 8:30 PM', 'Nag Pokhari, Lalitpur', 'lalitpur', 'Free', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=340&fit=crop&auto=format', 'An evening of spoken word, poetry, and stories in a cozy courtyard.', 0, FALSE, FALSE, FALSE, '', 'Lalitpur Arts Collective'),

-- THIS WEEK (Fri 28 – Sun 30 Aug 2026)
('sunrise-yoga-bhaktapur', 'Sunrise Yoga in Bhaktapur', (SELECT id FROM categories WHERE slug='sports'), 4.9, 'NPR 400', 400, 'Fri, 28 Aug 2026', '5:30 AM – 7:00 AM', 'Bhaktapur Durbar Square', 'bhaktapur', 'Popular', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=340&fit=crop&auto=format', 'Start your day with a peaceful sunrise yoga session among heritage temples.', 0, TRUE, FALSE, FALSE, '', 'Bhaktapur Wellness'),
('indie-music-night-patan', 'Indie Music Night', (SELECT id FROM categories WHERE slug='music'), 4.7, 'NPR 800', 800, 'Sat, 29 Aug 2026', '7:00 PM – 11:00 PM', 'Mangal Bazaar, Patan', 'patan', 'Trending', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=340&fit=crop&auto=format', 'Rising indie bands take the stage for a night of original music.', 0, TRUE, TRUE, FALSE, '', 'Patan Live'),
('startup-grind-pokhara', 'Startup Grind Pokhara', (SELECT id FROM categories WHERE slug='business'), 4.6, 'Free', 0, 'Sun, 30 Aug 2026', '4:00 PM – 7:00 PM', 'Lakeside, Pokhara', 'pokhara', 'Free', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=340&fit=crop&auto=format', 'Founders share stories, failures, and lessons at Pokhara''s lakeside hub.', 0, FALSE, FALSE, FALSE, '', 'Startup Grind Nepal'),
('chitwan-jungle-fest', 'Chitwan Jungle Fest', (SELECT id FROM categories WHERE slug='outdoor'), 4.8, 'NPR 2,000', 2000, 'Fri, 28 Aug 2026', '8:00 AM – 6:00 PM', 'Sauraha, Chitwan', 'chitwan', 'Featured', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=340&fit=crop&auto=format', 'A day of nature walks, canoe rides, and wildlife talks in Chitwan.', 0, TRUE, FALSE, FALSE, '', 'Chitwan Eco Club'),
('classical-dance-bhaktapur', 'Classical Dance Evening', (SELECT id FROM categories WHERE slug='culture'), 4.8, 'NPR 900', 900, 'Sun, 30 Aug 2026', '6:30 PM – 9:00 PM', 'Bhaktapur Durbar Square', 'bhaktapur', '', 'https://imgs.search.brave.com/5JjPJUDQrJw0I1k0NhlMQMUYq4WVxbV-q4v67t-_5jI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lbi5z/ZXRvcGF0aS5jb20v/dXBsb2Fkcy9lZGl0/b3IvSGVyaXRhZ2Ut/V2Fsay9IZXJpdGFnZS1XYWxrLTEwLmpw/ZWc', 'Traditional Nepali dance performances in a lit heritage courtyard.', 0, FALSE, FALSE, FALSE, '', 'Bhaktapur Heritage'),
('dharan-food-festival', 'Dharan Food Festival', (SELECT id FROM categories WHERE slug='food'), 4.7, 'Free', 0, 'Sat, 29 Aug 2026', '11:00 AM – 9:00 PM', 'Bhanu Chowk, Dharan', 'dharan', 'Free', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=340&fit=crop&auto=format', 'Street food, live music, and family fun in the heart of Dharan.', 0, FALSE, FALSE, FALSE, '', 'Dharan Foodies'),

-- THIS MONTH (other August 2026 dates)
('tech-talk-ai-kathmandu', 'AI & The Future Tech Talk', (SELECT id FROM categories WHERE slug='tech'), 4.8, 'NPR 600', 600, 'Tue, 1 Sep 2026', '2:00 PM – 5:00 PM', 'Inovation Hub, Kathmandu', 'kathmandu', 'Featured', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=340&fit=crop&auto=format', 'Industry experts discuss applied AI, agents, and what''s next.', 0, TRUE, FALSE, FALSE, '', 'Inovation Hub'),
('butwal-business-summit', 'Butwal Business Summit', (SELECT id FROM categories WHERE slug='business'), 4.5, 'NPR 1,200', 1200, 'Wed, 2 Sep 2026', '9:00 AM – 5:00 PM', 'Traffic Chowk, Butwal', 'butwal', '', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=340&fit=crop&auto=format', 'Regional entrepreneurs connect at western Nepal''s flagship business event.', 0, FALSE, FALSE, FALSE, '', 'Butwal Chamber'),
('itahari-tech-meetup', 'Itahari Tech Meetup', (SELECT id FROM categories WHERE slug='tech'), 4.4, 'Free', 0, 'Mon, 31 Aug 2026', '5:00 PM – 7:00 PM', 'Itahari City Mall', 'itahari', 'Free', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=340&fit=crop&auto=format', 'Casual meetup for developers and tech enthusiasts in Itahari.', 0, FALSE, FALSE, FALSE, '', 'Itahari Devs'),

-- FUTURE MONTH (September 2026 — for contrast, should NOT match This Month)
('biratnagar-runners-meet', 'Biratnagar Runners Meet', (SELECT id FROM categories WHERE slug='sports'), 4.6, 'Free', 0, 'Sat, 5 Sep 2026', '6:00 AM – 9:00 AM', 'Kanchanjunga Stadium, Biratnagar', 'biratnagar', 'Free', 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=340&fit=crop&auto=format', 'Morning run and community breakfast for runners of all levels.', 0, FALSE, FALSE, FALSE, '', 'Biratnagar Runners'),
('pokhara-lakeside-concert', 'Lakeside Concert', (SELECT id FROM categories WHERE slug='music'), 4.7, 'NPR 1,000', 1000, 'Fri, 4 Sep 2026', '5:00 PM – 10:00 PM', 'Lakeside, Pokhara', 'pokhara', 'Trending', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=340&fit=crop&auto=format', 'Open-air lakeside concert featuring popular Nepali bands.', 0, TRUE, TRUE, FALSE, '', 'Pokhara Live');

-- Coordinates for the additional test events
UPDATE events SET lat = 27.7172, lng = 85.3240 WHERE slug = 'live-coding-bootcamp';
UPDATE events SET lat = 27.7164, lng = 85.3082 WHERE slug = 'kathmandu-food-crawl';
UPDATE events SET lat = 27.6588, lng = 85.3247 WHERE slug = 'poetry-open-mic-lalitpur';
UPDATE events SET lat = 27.6719, lng = 85.4298 WHERE slug = 'sunrise-yoga-bhaktapur';
UPDATE events SET lat = 27.6875, lng = 85.3172 WHERE slug = 'indie-music-night-patan';
UPDATE events SET lat = 28.2096, lng = 83.9856 WHERE slug = 'startup-grind-pokhara';
UPDATE events SET lat = 27.5291, lng = 84.3542 WHERE slug = 'chitwan-jungle-fest';
UPDATE events SET lat = 27.6719, lng = 85.4298 WHERE slug = 'classical-dance-bhaktapur';
UPDATE events SET lat = 26.8098, lng = 87.2839 WHERE slug = 'dharan-food-festival';
UPDATE events SET lat = 27.7172, lng = 85.3240 WHERE slug = 'tech-talk-ai-kathmandu';
UPDATE events SET lat = 27.7006, lng = 83.4479 WHERE slug = 'butwal-business-summit';
UPDATE events SET lat = 26.6586, lng = 87.2859 WHERE slug = 'itahari-tech-meetup';
UPDATE events SET lat = 26.4525, lng = 87.2718 WHERE slug = 'biratnagar-runners-meet';
UPDATE events SET lat = 28.2096, lng = 83.9856 WHERE slug = 'pokhara-lakeside-concert';