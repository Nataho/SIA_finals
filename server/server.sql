CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password_hash) VALUES
('admin', 'OPlo12@#'),
('owen', 'SIA123'),
('john', 'SIA123'),
('adrieanne', 'SIA123'),
('ezra', 'SIA123'),
('sam', 'SIA123'),
('kyle', 'SIA123');

CREATE TABLE devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO devices (user_id, device_name, device_type) VALUES
(2, 'Owen\'s Laptop', 'Laptop'),
(3, 'John\'s Smartphone', 'Smartphone'),
(4, 'Adrieanne\'s Tablet', 'Tablet'),
(5, 'Ezra\'s Desktop', 'Desktop'),
(6, 'Sam\'s Smartwatch', 'Smartwatch'),
(7, 'Kyle\'s Gaming Console', 'Gaming Console');

CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    action VARCHAR(255),  -- e.g. "Turned On", "Temperature set to 24"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);