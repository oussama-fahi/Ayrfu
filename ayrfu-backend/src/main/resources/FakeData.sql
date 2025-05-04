-- Roles
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'Administrator with full access to the system'),
('ROLE_SUPER_USER', 'UDDAN employee with access to the back-office'),
('ROLE_CANDIDATE', 'Candidate user with limited access to apply for positions'),
('ROLE_CLIENT', 'Client user with access to view services');

-- Users
INSERT INTO users (user_name, email, password, active, created_at, updated_at) VALUES
('Admin User', 'admin@UDDAN.com', '$2a$10$EqKcp1WBKSBZpEfpYQHX3eCsqWIEKj4n2f9ZYtMl3CsvZnIaAYgyy', true, NOW(), NOW()), -- password: admin123
('Super User', 'super@UDDAN.com', '$2a$10$XK3jTU8n2AnYmBq7A5rfZOyQnzP.hYuCZ.kMWn0.qfH6jx0yRXSme', true, NOW(), NOW()), -- password: super123
('John Doe', 'john.doe@example.com', '$2a$10$fHqHVTj.uQJe9NnQ0/F3XO5NX4PDrMhf3OaGcDpZlWoYBB8dqQwrK', true, NOW(), NOW()), -- password: john123
('Jane Smith', 'jane.smith@example.com', '$2a$10$s65I1N.GfgAX0TqkYhOCiOLl8c4n0BYz3XS.qKwHYEl1vwh9OE3s.', true, NOW(), NOW()); -- password: jane123

-- User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Admin has ROLE_ADMIN
(2, 2), -- Super User has ROLE_SUPER_USER
(3, 3), -- John has ROLE_CANDIDATE
(4, 4); -- Jane has ROLE_CLIENT

-- Candidates
INSERT INTO candidates (full_name, email, phone_number, address, date_of_birth, gender, experience_level, preferred_location, preferred_work_model, cv_path, created_at, updated_at) VALUES
('John Doe', 'john.doe@example.com', '+1234567890', '123 Main St, Boston, MA', '1990-05-15', 'Male', 'Senior', 'Boston', 'Hybrid', 'uploads/john-doe-cv.pdf', NOW(), NOW()),
('Alice Johnson', 'alice.j@example.com', '+1987654321', '456 Elm St, New York, NY', '1992-07-22', 'Female', 'Mid-Level', 'New York', 'Remote', 'uploads/alice-johnson-cv.pdf', NOW(), NOW()),
('Robert Brown', 'robert.b@example.com', '+1567891234', '789 Oak St, San Francisco, CA', '1988-03-10', 'Male', 'Senior', 'San Francisco', 'On-Site', 'uploads/robert-brown-cv.pdf', NOW(), NOW()),
('Emily Davis', 'emily.d@example.com', '+1654321987', '321 Pine St, Chicago, IL', '1995-11-05', 'Female', 'Junior', 'Chicago', 'Hybrid', 'uploads/emily-davis-cv.pdf', NOW(), NOW()),
('Michael Wilson', 'michael.w@example.com', '+1765432198', '654 Cedar St, Seattle, WA', '1991-09-28', 'Male', 'Mid-Level', 'Seattle', 'Remote', 'uploads/michael-wilson-cv.pdf', NOW(), NOW());

-- Candidate Technologies
INSERT INTO candidate_technologies (candidate_id, technology) VALUES
(1, 'Java'), (1, 'Spring Boot'), (1, 'React'), (1, 'PostgreSQL'),
(2, 'Python'), (2, 'Django'), (2, 'JavaScript'), (2, 'MongoDB'),
(3, 'Java'), (3, 'Angular'), (3, 'MySQL'), (3, 'Docker'),
(4, 'JavaScript'), (4, 'React'), (4, 'Node.js'), (4, 'MongoDB'),
(5, 'Python'), (5, 'Flask'), (5, 'PostgreSQL'), (5, 'AWS');

-- Candidate Languages
INSERT INTO candidate_languages (candidate_id, language) VALUES
(1, 'English'), (1, 'French'),
(2, 'English'), (2, 'Spanish'),
(3, 'English'), (3, 'German'),
(4, 'English'), (4, 'Italian'),
(5, 'English'), (5, 'Chinese');

-- Positions
INSERT INTO positions (title, description, technology, location, experience_level, work_model, active, created_at, updated_at) VALUES
('Senior Java Developer', 'We are looking for a Senior Java Developer with experience in Spring Boot to join our team. The ideal candidate will have strong problem-solving skills and be able to mentor junior developers.', 'Java', 'Boston', 'Senior', 'Hybrid', true, NOW(), NOW()),
('Full Stack Developer', 'We need a Full Stack Developer with experience in React and Node.js. The candidate should be able to work on both frontend and backend development.', 'JavaScript', 'Remote', 'Mid-Level', 'Remote', true, NOW(), NOW()),
('Python Developer', 'We are seeking a Python Developer with experience in Django or Flask. The candidate will be responsible for developing and maintaining our web applications.', 'Python', 'New York', 'Mid-Level', 'On-Site', true, NOW(), NOW()),
('DevOps Engineer', 'We are looking for a DevOps Engineer with experience in AWS, Docker, and Kubernetes. The candidate will be responsible for managing our cloud infrastructure.', 'DevOps', 'San Francisco', 'Senior', 'Hybrid', true, NOW(), NOW()),
('Frontend Developer', 'We need a Frontend Developer with experience in React and Redux. The candidate should be able to create responsive and user-friendly interfaces.', 'JavaScript', 'Chicago', 'Junior', 'Remote', true, NOW(), NOW());

-- Position Languages
INSERT INTO position_languages (position_id, language) VALUES
(1, 'English'), (1, 'French'),
(2, 'English'),
(3, 'English'), (3, 'Spanish'),
(4, 'English'),
(5, 'English');

INSERT INTO applications (candidate_id, position_id, applied_at, cover_letter, status) VALUES
(1, 1, NOW() - INTERVAL '5 days', 'I am very interested in this position as I have extensive experience with Java and Spring Boot. I am confident that I can contribute to your team and help mentor junior developers.', 'PENDING'),
(2, 3, NOW() - INTERVAL '7 days', 'I am excited about this position as I have been working with Python and Django for the past 3 years. I am looking for a new challenge and I believe this position would be a great fit.', 'PENDING'),
(3, 4, NOW() - INTERVAL '3 days', 'I have been working as a DevOps Engineer for the past 5 years and I have extensive experience with AWS, Docker, and Kubernetes. I am looking for a new opportunity where I can further develop my skills.', 'ACCEPTED'),
(4, 5, NOW() - INTERVAL '10 days', 'I am a Frontend Developer with 2 years of experience in React. I am passionate about creating user-friendly interfaces and I am always eager to learn new technologies.', 'REJECTED'),
(5, 2, NOW() - INTERVAL '2 days', 'I am a Full Stack Developer with experience in both frontend and backend technologies. I have been working with React and Node.js for the past 3 years and I am looking for a remote position.', 'PENDING');

-- Clients
INSERT INTO clients (company_name, contact_person, email, phone_number, industry, company_size, requirements, created_at, updated_at) VALUES
('Tech Solutions Inc.', 'Jane Smith', 'jane.smith@example.com', '+1765432109', 'Technology', 'Large', 'We need help with developing a new mobile application for our customers. The app should be available on both iOS and Android platforms.', NOW(), NOW()),
('Finance Pro LLC', 'Robert Johnson', 'robert.j@example.com', '+1654321098', 'Finance', 'Medium', 'We are looking for a team to help us develop a secure web application for our financial services.', NOW(), NOW()),
('Health Care Services', 'Emily Brown', 'emily.b@example.com', '+1543210987', 'Healthcare', 'Large', 'We need assistance with developing a patient management system that is compliant with HIPAA regulations.', NOW(), NOW()),
('Retail Enterprises', 'Michael Davis', 'michael.d@example.com', '+1432109876', 'Retail', 'Small', 'We need help with setting up an e-commerce platform for our retail business.', NOW(), NOW()),
('Education Group', 'Sarah Wilson', 'sarah.w@example.com', '+1321098765', 'Education', 'Medium', 'We are looking for a team to help us develop an online learning platform for our students.', NOW(), NOW());

-- Services
INSERT INTO services (title, description, benefits, availability, active, created_at, updated_at) VALUES
('Web Development', 'Our web development services include building responsive and user-friendly websites using the latest technologies. We specialize in creating custom websites that are tailored to meet your specific business needs.', 'Responsive design, SEO optimization, User-friendly interface, Fast loading times', 'Immediate', true, NOW(), NOW()),
('Mobile App Development', 'We provide comprehensive mobile app development services for both iOS and Android platforms. Our team of experienced developers can help you bring your app idea to life, from concept to deployment.', 'Cross-platform compatibility, Intuitive UI/UX, Push notifications, Offline functionality', 'Within 2 weeks', true, NOW(), NOW()),
('Cloud Services', 'Our cloud services include migration, management, and optimization of your cloud infrastructure. We help you leverage the power of cloud computing to improve efficiency and reduce costs.', 'Scalability, Reliability, Cost-effective, 24/7 support', 'Immediate', true, NOW(), NOW()),
('AI and Machine Learning', 'We offer AI and machine learning solutions that can help you extract valuable insights from your data. Our team of data scientists can build custom models that address your specific business challenges.', 'Data-driven decisions, Automation, Improved efficiency, Competitive advantage', 'Within 4 weeks', true, NOW(), NOW()),
('IT Consulting', 'Our IT consulting services provide expert advice on how to use technology to achieve your business goals. We help you identify opportunities for improvement and develop strategies to leverage technology for growth.', 'Strategic planning, Technology roadmap, Cost optimization, Expert advice', 'Within 1 week', true, NOW(), NOW());

-- Service Keywords
INSERT INTO service_keywords (service_id, keyword) VALUES
(1, 'Web Development'), (1, 'Responsive Design'), (1, 'SEO'), (1, 'Frontend'), (1, 'Backend'),
(2, 'Mobile App'), (2, 'iOS'), (2, 'Android'), (2, 'Flutter'), (2, 'React Native'),
(3, 'Cloud'), (3, 'AWS'), (3, 'Azure'), (3, 'Google Cloud'), (3, 'DevOps'),
(4, 'AI'), (4, 'Machine Learning'), (4, 'Data Science'), (4, 'Big Data'), (4, 'Analytics'),
(5, 'Consulting'), (5, 'Strategy'), (5, 'Digital Transformation'), (5, 'Technology Roadmap'), (5, 'Project Management');

-- Messages
INSERT INTO messages (type, sender_name, sender_email, sender_phone, content, sent_at, read, read_at) VALUES
('CANDIDATE', 'David Lee', 'david.l@example.com', '+1210987654', 'I am interested in applying for the Senior Java Developer position. Could you please provide more information about the role and the team I would be working with?', NOW() - INTERVAL '3 days', true, NOW() - INTERVAL '2 days'),
('CLIENT', 'Lisa Chen', 'lisa.c@example.com', '+1109876543', 'We are looking for a team to help us develop a new web application for our business. Could you please provide more information about your web development services and pricing?', NOW() - INTERVAL '5 days', true, NOW() - INTERVAL '4 days'),
('CANDIDATE', 'Thomas White', 'thomas.w@example.com', '+1098765432', 'I am a Full Stack Developer with 4 years of experience. I am interested in the Full Stack Developer position. When can I expect to hear back after applying?', NOW() - INTERVAL '2 days', false, NULL),
('CLIENT', 'Amanda Garcia', 'amanda.g@example.com', '+1987654321', 'We are interested in your mobile app development services. We have an idea for an app and would like to discuss it with your team. When would be a good time for a meeting?', NOW() - INTERVAL '1 day', false, NULL),
('CANDIDATE', 'Kevin Martinez', 'kevin.m@example.com', '+1876543210', 'I noticed that the Python Developer position requires experience in Django. I have experience with Flask but not Django. Would you still consider my application?', NOW(), false, NULL);