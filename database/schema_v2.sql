-- C2S Garments Management System - Normalized Relational Schema v2.0
-- Comprehensive schema supporting all 15 modules and end-to-end user flows.

CREATE DATABASE IF NOT EXISTS garments_management;
USE garments_management;

-- 1. Users & RBAC
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'line_manager', 'worker', 'qc_inspector', 'maintenance_staff', 'auditor') DEFAULT 'worker',
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Workers & HR Profiles
CREATE TABLE IF NOT EXISTS workers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department ENUM('Cutting', 'Sewing', 'Finishing', 'Packaging', 'Quality Control', 'Maintenance') NOT NULL,
    position VARCHAR(50),
    hourly_rate DECIMAL(10, 2) DEFAULT 80.00,
    skill_level ENUM('Trainee', 'Semi-Skilled', 'Skilled', 'Master Operator') DEFAULT 'Semi-Skilled',
    current_line_id INT NULL,
    hire_date DATE,
    status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Worker Recognition & Rewards
CREATE TABLE IF NOT EXISTS worker_rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    worker_id INT NOT NULL,
    reward_type ENUM('promotion', 'bonus', 'best_performer', 'zero_defect_award') NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    bonus_amount DECIMAL(10, 2) DEFAULT 0.00,
    awarded_date DATE NOT NULL,
    awarded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (awarded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Worker Training Assignments
CREATE TABLE IF NOT EXISTS training_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    worker_id INT NOT NULL,
    training_module VARCHAR(150) NOT NULL,
    supervisor_id INT NOT NULL,
    start_date DATE NOT NULL,
    target_completion_date DATE NOT NULL,
    status ENUM('assigned', 'in_progress', 'completed', 'overdue') DEFAULT 'assigned',
    score DECIMAL(5, 2) NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES workers(id) ON DELETE CASCADE
);

-- 5. Inventory & Fabric Products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_code VARCHAR(30) UNIQUE NOT NULL,
    category ENUM('Apparel', 'Raw Material', 'Trim & Accessories', 'Packaging') NOT NULL,
    buying_price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 0,
    threshold_value INT DEFAULT 10,
    unit VARCHAR(20) DEFAULT 'pcs',
    manufacture_date DATE,
    expiry_date DATE,
    supplier VARCHAR(100),
    status ENUM('in_stock', 'low_stock', 'out_of_stock') DEFAULT 'in_stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Production Lines
CREATE TABLE IF NOT EXISTS production_lines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    line_name VARCHAR(30) UNIQUE NOT NULL,
    line_type ENUM('Cutting', 'Sewing', 'Finishing', 'Packaging', 'Quality Control') NOT NULL,
    supervisor_id INT NULL,
    capacity INT DEFAULT 50,
    current_workers INT DEFAULT 0,
    target_output_per_hour INT DEFAULT 100,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supervisor_id) REFERENCES workers(id) ON DELETE SET NULL
);

-- 7. Orders & Job Sequencing
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    total_quantity INT DEFAULT 0,
    total_amount DECIMAL(12, 2) DEFAULT 0.00,
    status ENUM('pending', 'in_production', 'completed', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_sequences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    line_id INT NOT NULL,
    quantity INT NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    sequence_order INT DEFAULT 1,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('queued', 'running', 'paused', 'completed') DEFAULT 'queued',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (line_id) REFERENCES production_lines(id) ON DELETE CASCADE
);

-- 8. Attendance & Shift Records
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    worker_id INT NOT NULL,
    date DATE NOT NULL,
    shift ENUM('morning', 'evening', 'night') DEFAULT 'morning',
    check_in TIME NULL,
    check_out TIME NULL,
    status ENUM('present', 'absent', 'late', 'half_day', 'on_leave') DEFAULT 'present',
    overtime_hours DECIMAL(4, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);

-- 9. Safety Reporting (Bilingual: Bangla & English)
CREATE TABLE IF NOT EXISTS safety_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_code VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    category ENUM('Public Safety', 'Machine Hazard', 'Electrical', 'Chemical / Fire', 'Personal Protection') NOT NULL,
    severity ENUM('Minor', 'Major', 'Critical') DEFAULT 'Major',
    location VARCHAR(100) NOT NULL,
    description_bn TEXT NOT NULL,
    description_en TEXT NULL,
    reported_by INT NOT NULL,
    incident_date DATE NOT NULL,
    status ENUM('Unresolved', 'Pending', 'Resolved') DEFAULT 'Unresolved',
    image_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_by) REFERENCES workers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS safety_resolutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    safety_report_id INT NOT NULL,
    resolution_notes_bn TEXT NOT NULL,
    resolution_notes_en TEXT NULL,
    resolved_by INT NOT NULL,
    resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by_auditor BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (safety_report_id) REFERENCES safety_reports(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Quality Control & Inspections
CREATE TABLE IF NOT EXISTS inspections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_number VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    line_id INT NOT NULL,
    inspector_id INT NOT NULL,
    inspection_date DATE NOT NULL,
    sample_size INT DEFAULT 200,
    defects_found INT DEFAULT 0,
    pass_rate DECIMAL(5, 2) DEFAULT 100.00,
    status ENUM('Accepted', 'Rejected', 'Under_Review') DEFAULT 'Accepted',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (line_id) REFERENCES production_lines(id) ON DELETE CASCADE,
    FOREIGN KEY (inspector_id) REFERENCES workers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inspection_defects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inspection_id INT NOT NULL,
    defect_category ENUM('Fabric Defects', 'Embroidery Defects', 'Trims & Accessories Defects', 'Finishing Defects', 'Measurement & Fit Defects', 'Sewing Defects') NOT NULL,
    defect_count INT DEFAULT 1,
    severity ENUM('minor', 'major', 'critical') DEFAULT 'minor',
    FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE
);

-- 11. Waste Tracking & Patterns
CREATE TABLE IF NOT EXISTS waste_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    line_id INT NOT NULL,
    waste_type ENUM('Fabric Scraps', 'Yarn Waste', 'Packaging Plastic', 'Defective Trims', 'Other') NOT NULL,
    material VARCHAR(100) NOT NULL,
    quantity_kg DECIMAL(10, 2) NOT NULL,
    cost_usd DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (line_id) REFERENCES production_lines(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pattern_optimizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pattern_code VARCHAR(50) UNIQUE NOT NULL,
    fabric_type VARCHAR(100) NOT NULL,
    nesting_yield_projected DECIMAL(5, 2) NOT NULL,
    estimated_waste_reduction_kg DECIMAL(10, 2) NOT NULL,
    status ENUM('simulated', 'active_on_line', 'archived') DEFAULT 'active_on_line',
    applied_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Machinery & Predictive Maintenance Work Orders
CREATE TABLE IF NOT EXISTS machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    machine_name VARCHAR(100) NOT NULL,
    machine_code VARCHAR(30) UNIQUE NOT NULL,
    line_id INT NULL,
    model_number VARCHAR(50),
    health_index INT DEFAULT 95, -- 0 to 100 health score
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    status ENUM('operational', 'maintenance', 'broken') DEFAULT 'operational',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (line_id) REFERENCES production_lines(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS work_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(30) UNIQUE NOT NULL,
    machine_id INT NOT NULL,
    maintenance_type ENUM('Preventive', 'Corrective', 'Emergency Breakdown') NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    technician_id INT NULL,
    scheduled_date DATE NOT NULL,
    completed_date DATE NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES workers(id) ON DELETE SET NULL
);

-- 13. Reports, Compliance & Buyer Audit Dossiers
CREATE TABLE IF NOT EXISTS compliance_checklists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    standard_name VARCHAR(100) NOT NULL, -- e.g. Bangladesh Labor Act 2006, ILO Convention
    clause_code VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('Worker Rights & Remuneration', 'Workplace Safety & Health', 'Building & Electrical Integrity', 'Environmental & Waste Management') NOT NULL,
    is_compliant BOOLEAN DEFAULT TRUE,
    evidence_document_url VARCHAR(255) NULL,
    last_audited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    audited_by INT NULL,
    FOREIGN KEY (audited_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 14. Real-time Communication & Chats
CREATE TABLE IF NOT EXISTS chat_channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(200),
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channel_id INT NOT NULL,
    sender_user_id INT NOT NULL,
    message TEXT NOT NULL,
    attachment_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES chat_channels(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE
);

