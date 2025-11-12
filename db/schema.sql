
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  phone VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_ref VARCHAR(50) NOT NULL UNIQUE,
  user_id INT,
  total DECIMAL(8,2) NOT NULL CHECK (total >= 0),
  notes VARCHAR(240),
  payload JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
