-- Temporarily disable triggers (PostgreSQL equivalent of disabling foreign key checks)
SET session_replication_role = 'replica';



-- Insert admin users
INSERT INTO users (id, user_name, email, password, active, created_at, updated_at) VALUES
(2, 'Super User', 'super@example.com', '$2a$10$1gJJgBlL75OIjkSgkYPXI.mV7ihEpjkWzOkORoOU7D/3pTgmx2wVK', true, NOW(), NOW()); -- password: admin123

-- Assign roles to admin users
INSERT INTO user_roles (user_id, role_id) VALUES
(2, 2); -- Super User has ROLE_SUPER_USER

-- Insert candidate users
INSERT INTO users (id, user_name, email, password, active, created_at, updated_at) VALUES
(3, 'John Smith', 'john@example.com', '$2a$10$1gJJgBlL75OIjkSgkYPXI.mV7ihEpjkWzOkORoOU7D/3pTgmx2wVK', true, NOW(), NOW()),
(4, 'Emily Johnson', 'emily@example.com', '$2a$10$1gJJgBlL75OIjkSgkYPXI.mV7ihEpjkWzOkORoOU7D/3pTgmx2wVK', true, NOW(), NOW()),
(5, 'Michael Brown', 'michael@example.com', '$2a$10$1gJJgBlL75OIjkSgkYPXI.mV7ihEpjkWzOkORoOU7D/3pTgmx2wVK', true, NOW(), NOW());

-- Assign candidate role to users
INSERT INTO user_roles (user_id, role_id) VALUES
(3, 3), -- John Smith has ROLE_CANDIDATE
(4, 3), -- Emily Johnson has ROLE_CANDIDATE
(5, 3); -- Michael Brown has ROLE_CANDIDATE

-- Insert client users
INSERT INTO users (id, user_name, email, password, active, created_at, updated_at) VALUES
(6, 'Sarah Wilson', 'sarah@techcorp.com', '$2a$10$1gJJgBlL75OIjkSgkYPXI.mV7ihEpjkWzOkORoOU7D/3pTgmx2wVK', true, NOW(), NOW()),
(7, 'David Lee', 'david@innovatech.com', '$2a$10$1gJJgBlL75OIjkSgkYPXI.mV7ihEpjkWzOkORoOU7D/3pTgmx2wVK', true, NOW(), NOW()),
(8, 'Jennifer Martinez', 'jennifer@globalinc.com', '$2a$10$1gJJgBlL75OIjkSgkYPXI.mV7ihEpjkWzOkORoOU7D/3pTgmx2wVK', true, NOW(), NOW());

-- Assign client role to users
INSERT INTO user_roles (user_id, role_id) VALUES
(6, 4), -- Sarah Wilson has ROLE_CLIENT
(7, 4), -- David Lee has ROLE_CLIENT
(8, 4); -- Jennifer Martinez has ROLE_CLIENT

-- Insert candidate profiles
INSERT INTO candidates (id, user_id, full_name, email, phone_number, address, date_of_birth, gender, experience_level, preferred_location, preferred_work_model, cv_path, created_at, updated_at) VALUES
(1, 3, 'John Smith', 'john@example.com', '+1234567890', '123 Main St, New York, NY', '1990-05-15', 'Male', 'Senior', 'New York', 'Remote', 'john_smith_cv.pdf', NOW(), NOW()),
(2, 4, 'Emily Johnson', 'emily@example.com', '+1987654321', '456 Park Ave, San Francisco, CA', '1992-08-22', 'Female', 'Mid-Level', 'San Francisco', 'Hybrid', 'emily_johnson_cv.pdf', NOW(), NOW()),
(3, 5, 'Michael Brown', 'michael@example.com', '+1122334455', '789 Oak St, Austin, TX', '1988-03-10', 'Male', 'Junior', 'Austin', 'On-Site', 'michael_brown_cv.pdf', NOW(), NOW());

-- Insert candidate technologies
INSERT INTO candidate_technologies (candidate_id, technology) VALUES
(1, 'Java'), (1, 'Spring Boot'), (1, 'React'), (1, 'Angular'),
(2, 'Python'), (2, 'Django'), (2, 'Vue.js'), (2, 'AWS'),
(3, 'JavaScript'), (3, 'Node.js'), (3, 'React'), (3, 'MongoDB');

-- Insert candidate languages
INSERT INTO candidate_languages (candidate_id, language) VALUES
(1, 'English'), (1, 'French'),
(2, 'English'), (2, 'Spanish'), (2, 'Chinese'),
(3, 'English'), (3, 'German');

-- Insert client profiles
INSERT INTO clients (id, user_id, company_name, contact_person, email, phone_number, industry, company_size, requirements, created_at, updated_at) VALUES
(1, 6, 'TechCorp Inc.', 'Sarah Wilson', 'sarah@techcorp.com', '+1555111222', 'Technology', '100-500', 'Looking for experienced Java developers for our enterprise applications team.', NOW(), NOW()),
(2, 7, 'InnovaTech Solutions', 'David Lee', 'david@innovatech.com', '+1555333444', 'Fintech', '10-50', 'Need skilled Python developers with machine learning experience.', NOW(), NOW()),
(3, 8, 'Global Inc.', 'Jennifer Martinez', 'jennifer@globalinc.com', '+1555555666', 'E-Commerce', '500+', 'Building a new web platform and need full-stack JavaScript developers.', NOW(), NOW());

-- Insert services
INSERT INTO services (id, title, description, benefits, availability, active, created_at, updated_at) VALUES
(1, 'Talent Recruitment', 'Full-cycle recruitment service to find top tech talent for your company.', 'Access to vetted candidates, reduced time-to-hire, specialized technical assessment.', 'Available worldwide', true, NOW(), NOW()),
(2, 'Technical Screening', 'Thorough assessment of candidates'' technical skills and knowledge.', 'Expert evaluation, standardized process, detailed feedback reports.', 'Available for all positions', true, NOW(), NOW()),
(3, 'HR Consulting', 'Strategic HR advice to improve your talent acquisition and retention.', 'Market insights, competitive analysis, retention strategies.', 'Available with 1-week notice', true, NOW(), NOW()),
(4, 'Remote Team Setup', 'Help establish and manage remote teams across different locations.', 'Infrastructure setup, communication protocols, legal compliance.', 'Limited availability', true, NOW(), NOW()),
(5, 'Technical Training', 'Custom training programs for your development teams.', 'Up-to-date content, hands-on projects, expert instructors.', 'Available quarterly', true, NOW(), NOW());

-- Insert service keywords
INSERT INTO service_keywords (service_id, keyword) VALUES
(1, 'recruitment'), (1, 'hiring'), (1, 'talent'), (1, 'staffing'),
(2, 'screening'), (2, 'assessment'), (2, 'evaluation'), (2, 'skills'),
(3, 'consulting'), (3, 'hr'), (3, 'strategy'), (3, 'retention'),
(4, 'remote'), (4, 'team'), (4, 'distributed'), (4, 'global'),
(5, 'training'), (5, 'learning'), (5, 'skills'), (5, 'development');

-- Insert service requests
INSERT INTO service_requests (id, client_id, service_id, details, status, created_at, updated_at) VALUES
(1, 1, 1, 'We need to hire 5 Java developers in the next 2 months.', 'IN_REVIEW', NOW(), NOW()),
(2, 2, 2, 'Looking for help to screen 10 Python candidates next week.', 'ACCEPTED', NOW() - INTERVAL '5 days', NOW()),
(3, 3, 4, 'Need assistance setting up remote team of 15 people in Europe.', 'PENDING', NOW() - INTERVAL '2 days', NOW()),
(4, 1, 5, 'Interested in Spring Boot training for our development team.', 'COMPLETED', NOW() - INTERVAL '30 days', NOW()),
(5, 2, 3, 'Need consulting on competitive salary structures in fintech.', 'REJECTED', NOW() - INTERVAL '15 days', NOW());

-- Insert positions
INSERT INTO positions (id, title, description, technology, location, experience_level, work_model, active, created_at, updated_at) VALUES
(1, 'Senior Java Developer', 'We''re looking for an experienced Java developer to join our enterprise applications team. You''ll work on designing and implementing high-performance, scalable applications using Spring Boot and microservices architecture.', 'Java', 'New York', 'Senior', 'Hybrid', true, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
(2, 'Front-end React Developer', 'Join our UI team to create responsive and intuitive user interfaces using React. You''ll collaborate with designers and back-end developers to deliver seamless user experiences.', 'React', 'Remote', 'Mid-Level', 'Remote', true, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
(3, 'Python Machine Learning Engineer', 'We''re expanding our data science team and need a Python ML engineer to develop and implement machine learning models for our fintech products.', 'Python', 'San Francisco', 'Senior', 'On-Site', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
(4, 'Full Stack JavaScript Developer', 'Work on our e-commerce platform using Node.js, React, and MongoDB. You''ll be responsible for implementing new features and optimizing existing functionality.', 'JavaScript', 'Austin', 'Mid-Level', 'Hybrid', true, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(5, 'DevOps Engineer', 'Help us build and maintain our CI/CD pipelines using AWS, Docker, and Kubernetes. You''ll work closely with development teams to automate deployments and ensure system reliability.', 'DevOps', 'Seattle', 'Senior', 'Remote', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- Insert position languages
INSERT INTO position_languages (position_id, language) VALUES
(1, 'English'), (1, 'French'),
(2, 'English'),
(3, 'English'), (3, 'Chinese'),
(4, 'English'), (4, 'Spanish'),
(5, 'English');

-- Insert applications
INSERT INTO applications (id, candidate_id, position_id, applied_at, cover_letter, status, created_at, updated_at) VALUES
-- John Smith's applications
(1, 1, 1, NOW() - INTERVAL '29 days', 'I am very interested in the Senior Java Developer position. With over 10 years of experience in Java development and a strong background in Spring Boot and microservices, I believe I would be a great fit for your team.', 'INTERVIEW_SCHEDULED', NOW() - INTERVAL '29 days', NOW() - INTERVAL '25 days'),
(2, 1, 5, NOW() - INTERVAL '9 days', 'I''m applying for the DevOps Engineer position. While my background is primarily in Java development, I''ve been increasingly involved in DevOps practices over the past few years.', 'PENDING', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),

-- Emily Johnson's applications
(3, 2, 3, NOW() - INTERVAL '18 days', 'As a Python developer with a strong background in machine learning, I''m excited about the Python Machine Learning Engineer position.', 'TECHNICAL_TEST', NOW() - INTERVAL '18 days', NOW() - INTERVAL '15 days'),

-- Michael Brown's applications
(4, 3, 2, NOW() - INTERVAL '23 days', 'I''m applying for the Front-end React Developer position. I have 3 years of experience building responsive and intuitive user interfaces with React.', 'INTERVIEW_COMPLETED', NOW() - INTERVAL '23 days', NOW() - INTERVAL '20 days'),
(5, 3, 4, NOW() - INTERVAL '14 days', 'The Full Stack JavaScript Developer position aligns perfectly with my skills and interests. I have experience with Node.js, React, and MongoDB.', 'IN_REVIEW', NOW() - INTERVAL '14 days', NOW() - INTERVAL '10 days');

-- Insert conversations
INSERT INTO conversations (id, subject, initiator_id, recipient_id, created_at, updated_at) VALUES
(1, 'Java Development Position', 3, 1, NOW() - INTERVAL '10 days', NOW()),
(2, 'Python Developer Opportunity', 4, 2, NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day'),
(3, 'Technical Training Request', 6, 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'),
(4, 'Remote Work Inquiry', 7, 2, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(5, 'Talent Recruitment Service', 8, 1, NOW() - INTERVAL '1 day', NOW());

-- Insert messages
INSERT INTO messages (id, type, sender_id, sender_name, sender_email, sender_phone, conversation_id, content, read, read_at, created_at, updated_at) VALUES
-- Conversation 1: John Smith (Candidate) and Admin
(1, 'CANDIDATE', 3, 'John Smith', 'john@example.com', '+1234567890', 1, 'Hello, I''m interested in the Java developer position. Could you provide more details?', true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(2, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 1, 'Hi John, thanks for your interest. The position is for a senior Java developer with Spring Boot experience. Would you like to schedule an interview?', true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
(3, 'CANDIDATE', 3, 'John Smith', 'john@example.com', '+1234567890', 1, 'That sounds great! I have extensive experience with Spring Boot. I''m available for an interview next week.', true, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(4, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 1, 'Perfect! I''ve scheduled an interview for next Tuesday at 2 PM. I''ll send you a calendar invite with the details.', true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(5, 'CANDIDATE', 3, 'John Smith', 'john@example.com', '+1234567890', 1, 'Thank you! I''ve received the invite and confirmed my attendance. Looking forward to discussing the opportunity.', false, NULL, NOW(), NOW()),

-- Conversation 2: Emily Johnson (Candidate) and Super User
(6, 'SUPER_USER', 2, 'Super User', 'super@example.com', NULL, 2, 'Emily, we have an exciting Python developer role that matches your profile. Are you currently looking for new opportunities?', true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(7, 'CANDIDATE', 4, 'Emily Johnson', 'emily@example.com', '+1987654321', 2, 'Yes, I''m open to new opportunities! Could you tell me more about the role and the company?', true, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(8, 'SUPER_USER', 2, 'Super User', 'super@example.com', NULL, 2, 'It''s for a fintech company working on machine learning applications. They offer competitive salary and remote work options.', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(9, 'CANDIDATE', 4, 'Emily Johnson', 'emily@example.com', '+1987654321', 2, 'That sounds perfect for my background. I''ve reviewed the job description and I''m definitely interested. How should we proceed?', true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(10, 'SUPER_USER', 2, 'Super User', 'super@example.com', NULL, 2, 'Great! The next step would be a technical screening. Are you available this Friday for a 1-hour assessment?', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Conversation 3: Sarah Wilson (Client) and Admin
(11, 'CLIENT', 6, 'Sarah Wilson', 'sarah@techcorp.com', '+1555111222', 3, 'Hello, we''re interested in your technical training services for our Java team. Do you offer custom Spring Boot training?', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(12, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 3, 'Hi Sarah, yes we do! We can create a custom training program tailored to your team''s needs. Would you like to schedule a call to discuss the details?', true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(13, 'CLIENT', 6, 'Sarah Wilson', 'sarah@techcorp.com', '+1555111222', 3, 'That would be great. We have about 15 developers who need advanced Spring Boot training. How about a call tomorrow at 11 AM?', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(14, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 3, 'Perfect, I''ve scheduled the call for tomorrow at 11 AM. I''ll send you a meeting invite with the conference details.', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Conversation 4: David Lee (Client) and Super User
(15, 'CLIENT', 7, 'David Lee', 'david@innovatech.com', '+1555333444', 4, 'I''d like to know more about your remote team setup services. We''re expanding to Europe and need help with this process.', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(16, 'SUPER_USER', 2, 'Super User', 'super@example.com', NULL, 4, 'Hi David, we specialize in setting up remote teams globally. We can help with everything from legal compliance to team communication. Would you like to see our service package?', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(17, 'CLIENT', 7, 'David Lee', 'david@innovatech.com', '+1555333444', 4, 'Yes, please send over the service package. Also, do you have experience specifically with setting up teams in Germany and France?', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(18, 'SUPER_USER', 2, 'Super User', 'super@example.com', NULL, 4, 'I''ve attached our service package. And yes, we have extensive experience in Germany and France. We''ve helped 12 companies set up teams there in the past year alone.', false, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Conversation 5: Jennifer Martinez (Client) and Admin
(19, 'CLIENT', 8, 'Jennifer Martinez', 'jennifer@globalinc.com', '+1555555666', 5, 'We need to hire several JavaScript developers for our new e-commerce platform. Can you help us with the recruitment process?', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(20, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 5, 'Hi Jennifer, we''d be happy to help with your JavaScript developer recruitment. Could you provide more details about the specific skills and experience you''re looking for?', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(21, 'CLIENT', 8, 'Jennifer Martinez', 'jennifer@globalinc.com', '+1555555666', 5, 'We need developers experienced with React, Node.js, and MongoDB. We''re looking for 3 seniors and 2 mid-level developers. They should have e-commerce experience if possible.', true, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
(22, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 5, 'Thanks for the details. I''ve started a search in our database and have already identified several potential candidates. I''ll send you profiles by the end of the day.', true, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
(23, 'CLIENT', 8, 'Jennifer Martinez', 'jennifer@globalinc.com', '+1555555666', 5, 'That''s great news! Looking forward to reviewing the profiles. Also, what are your typical timeframes for filling these types of positions?', false, NULL, NOW(), NOW());

-- Reset sequences (assuming your IDs start from 1)
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('candidates_id_seq', (SELECT MAX(id) FROM candidates));
SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
SELECT setval('service_requests_id_seq', (SELECT MAX(id) FROM service_requests));
SELECT setval('positions_id_seq', (SELECT MAX(id) FROM positions));
SELECT setval('applications_id_seq', (SELECT MAX(id) FROM applications));
SELECT setval('conversations_id_seq', (SELECT MAX(id) FROM conversations));
SELECT setval('messages_id_seq', (SELECT MAX(id) FROM messages));

-- Re-enable triggers
SET session_replication_role = 'origin';


-- Insert messages
INSERT INTO messages (id, type, sender_id, sender_name, sender_email, sender_phone, conversation_id, content, read, read_at, created_at, updated_at) VALUES
-- Conversation 1: John Smith (Candidate) and Admin
(1, 'CANDIDATE', 3, 'John Smith', 'john@example.com', '+1234567890', 1, 'Hello, I''m interested in the Java developer position. Could you provide more details?', true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(2, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 1, 'Hi John, thanks for your interest. The position is for a senior Java developer with Spring Boot experience. Would you like to schedule an interview?', true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
(3, 'CANDIDATE', 3, 'John Smith', 'john@example.com', '+1234567890', 1, 'That sounds great! I have extensive experience with Spring Boot. I''m available for an interview next week.', true, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(4, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 1, 'Perfect! I''ve scheduled an interview for next Tuesday at 2 PM. I''ll send you a calendar invite with the details.', true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(5, 'CANDIDATE', 3, 'John Smith', 'john@example.com', '+1234567890', 1, 'Thank you! I''ve received the invite and confirmed my attendance. Looking forward to discussing the opportunity.', false, NULL, NOW(), NOW()),

-- Conversation 2: Emily Johnson (Candidate) and Super User
(6, 'ADMIN', 2, 'Super User', 'super@example.com', NULL, 2, 'Emily, we have an exciting Python developer role that matches your profile. Are you currently looking for new opportunities?', true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(7, 'CANDIDATE', 4, 'Emily Johnson', 'emily@example.com', '+1987654321', 2, 'Yes, I''m open to new opportunities! Could you tell me more about the role and the company?', true, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(8, 'ADMIN', 2, 'Super User', 'super@example.com', NULL, 2, 'It''s for a fintech company working on machine learning applications. They offer competitive salary and remote work options.', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(9, 'CANDIDATE', 4, 'Emily Johnson', 'emily@example.com', '+1987654321', 2, 'That sounds perfect for my background. I''ve reviewed the job description and I''m definitely interested. How should we proceed?', true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(10, 'ADMIN', 2, 'Super User', 'super@example.com', NULL, 2, 'Great! The next step would be a technical screening. Are you available this Friday for a 1-hour assessment?', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Conversation 3: Sarah Wilson (Client) and Admin
(11, 'CLIENT', 6, 'Sarah Wilson', 'sarah@techcorp.com', '+1555111222', 3, 'Hello, we''re interested in your technical training services for our Java team. Do you offer custom Spring Boot training?', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(12, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 3, 'Hi Sarah, yes we do! We can create a custom training program tailored to your team''s needs. Would you like to schedule a call to discuss the details?', true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(13, 'CLIENT', 6, 'Sarah Wilson', 'sarah@techcorp.com', '+1555111222', 3, 'That would be great. We have about 15 developers who need advanced Spring Boot training. How about a call tomorrow at 11 AM?', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(14, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 3, 'Perfect, I''ve scheduled the call for tomorrow at 11 AM. I''ll send you a meeting invite with the conference details.', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Conversation 4: David Lee (Client) and Super User
(15, 'CLIENT', 7, 'David Lee', 'david@innovatech.com', '+1555333444', 4, 'I''d like to know more about your remote team setup services. We''re expanding to Europe and need help with this process.', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(16, 'ADMIN', 2, 'Super User', 'super@example.com', NULL, 4, 'Hi David, we specialize in setting up remote teams globally. We can help with everything from legal compliance to team communication. Would you like to see our service package?', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(17, 'CLIENT', 7, 'David Lee', 'david@innovatech.com', '+1555333444', 4, 'Yes, please send over the service package. Also, do you have experience specifically with setting up teams in Germany and France?', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(18, 'ADMIN', 2, 'Super User', 'super@example.com', NULL, 4, 'I''ve attached our service package. And yes, we have extensive experience in Germany and France. We''ve helped 12 companies set up teams there in the past year alone.', false, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Conversation 5: Jennifer Martinez (Client) and Admin
(19, 'CLIENT', 8, 'Jennifer Martinez', 'jennifer@globalinc.com', '+1555555666', 5, 'We need to hire several JavaScript developers for our new e-commerce platform. Can you help us with the recruitment process?', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(20, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 5, 'Hi Jennifer, we''d be happy to help with your JavaScript developer recruitment. Could you provide more details about the specific skills and experience you''re looking for?', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(21, 'CLIENT', 8, 'Jennifer Martinez', 'jennifer@globalinc.com', '+1555555666', 5, 'We need developers experienced with React, Node.js, and MongoDB. We''re looking for 3 seniors and 2 mid-level developers. They should have e-commerce experience if possible.', true, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
(22, 'ADMIN', 1, 'Admin User', 'admin@example.com', NULL, 5, 'Thanks for the details. I''ve started a search in our database and have already identified several potential candidates. I''ll send you profiles by the end of the day.', true, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
(23, 'CLIENT', 8, 'Jennifer Martinez', 'jennifer@globalinc.com', '+1555555666', 5, 'That''s great news! Looking forward to reviewing the profiles. Also, what are your typical timeframes for filling these types of positions?', false, NULL, NOW(), NOW());
