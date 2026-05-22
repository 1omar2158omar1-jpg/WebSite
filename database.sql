-- Luxury Services Database Schema
-- MySQL Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS luxury_services CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE luxury_services;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('inactive', 'active', 'expired', 'banned') DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INT NOT NULL,
    description TEXT,
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- Serial keys table
CREATE TABLE IF NOT EXISTS serial_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial_key VARCHAR(24) NOT NULL UNIQUE,
    plan_id INT NOT NULL,
    status ENUM('available', 'used', 'expired', 'revoked') DEFAULT 'available',
    used_by INT DEFAULT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    FOREIGN KEY (used_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_serial_key (serial_key),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    serial_key_id INT NOT NULL,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    FOREIGN KEY (serial_key_id) REFERENCES serial_keys(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB;

-- Device sessions table (for tracking connected devices)
CREATE TABLE IF NOT EXISTS device_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_info VARCHAR(255),
    ip_address VARCHAR(45),
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Insert default plans
INSERT INTO plans (name, price, duration_days, description, features) VALUES
('3 Months', 5.00, 90, '3 months subscription', JSON_ARRAY(
    'تخطي iCloud لأجهزة iPhone و iPad',
    'يدعم أحدث إصدارات iOS',
    'بدون فقد بيانات الجهاز',
    'تحديثات دورية مجانية',
    'دعم فني سريع 24/7',
    'واجهة سهلة الاستخدام'
)),
('1 Year', 10.00, 365, '1 year subscription', JSON_ARRAY(
    'تخطي iCloud لأجهزة iPhone و iPad',
    'يدعم أحدث إصدارات iOS',
    'بدون فقد بيانات الجهاز',
    'تحديثات دورية مجانية',
    'دعم فني سريع 24/7',
    'واجهة سهلة الاستخدام'
));

-- Sample serial keys (for testing)
-- In production, generate these securely
INSERT INTO serial_keys (serial_key, plan_id) VALUES
('LUXS-TEST-0001-AAAA-1111', 1),
('LUXS-TEST-0002-BBBB-2222', 1),
('LUXS-YEAR-0001-CCCC-3333', 2),
('LUXS-YEAR-0002-DDDD-4444', 2);
