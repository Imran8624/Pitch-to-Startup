-- ============================================================================
-- STARTUPHUB: PostgreSQL 16 DDL Schema with pgvector extension
-- Multi-Role Startup Ecosystem, Talent Marketplace & Investor Matchmaking
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. ENUM Types
CREATE TYPE user_role AS ENUM (
    'STUDENT_FOUNDER',
    'INVESTOR',
    'TALENT',
    'VENDOR',
    'ADMIN'
);

CREATE TYPE kyc_status_type AS ENUM (
    'PENDING',
    'UNDER_REVIEW',
    'VERIFIED',
    'REJECTED'
);

CREATE TYPE funding_stage_type AS ENUM (
    'PRE_SEED',
    'SEED',
    'SERIES_A',
    'SERIES_B',
    'SERIES_C_PLUS'
);

CREATE TYPE stakeholder_type AS ENUM (
    'FOUNDER',
    'INVESTOR',
    'ENTERPRISE_PARTNER',
    'VENDOR'
);

CREATE TYPE employment_type AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'FREELANCE',
    'CONTRACT'
);

CREATE TYPE swipe_direction AS ENUM (
    'LEFT_PASS',
    'RIGHT_LIKE'
);

CREATE TYPE notification_category AS ENUM (
    'SWIPE_MATCH',
    'NEW_STARTUP',
    'SYSTEM_ALERT',
    'MEETING',
    'JOB_APPLICATION'
);

-- ============================================================================
-- TABLE: Users & RBAC
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT_FOUNDER',
    company_name VARCHAR(255),
    cin_gstin VARCHAR(50),
    bio TEXT,
    avatar_url VARCHAR(512),
    kyc_status kyc_status_type NOT NULL DEFAULT 'PENDING',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kyc ON users(kyc_status);

-- ============================================================================
-- TABLE: KYC Verification Documents
-- ============================================================================
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- e.g., 'CIN', 'GSTIN', 'PASSPORT', 'ACCREDITATION_CERT'
    document_number VARCHAR(100),
    file_url VARCHAR(512) NOT NULL,
    status kyc_status_type NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: Startups
-- ============================================================================
CREATE TABLE startups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    founder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    description TEXT,
    sector VARCHAR(100) NOT NULL, -- e.g., 'FinTech', 'HealthTech', 'AI/ML', 'CleanTech'
    stage funding_stage_type NOT NULL DEFAULT 'PRE_SEED',
    valuation DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    arr DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- Annual Recurring Revenue
    arr_growth_pct DECIMAL(6, 2) NOT NULL DEFAULT 0.00, -- YoY Growth %
    mrr DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- Monthly Recurring Revenue
    traction_users INT NOT NULL DEFAULT 0,
    total_funding_raised DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    funding_ask_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    equity_offered_pct DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    pitch_deck_url VARCHAR(512),
    logo_url VARCHAR(512),
    verification_status kyc_status_type NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_startups_sector ON startups(sector);
CREATE INDEX idx_startups_stage ON startups(stage);
CREATE INDEX idx_startups_verification ON startups(verification_status);

-- ============================================================================
-- TABLE: Cap Table & Stakeholders
-- ============================================================================
CREATE TABLE stakeholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    type stakeholder_type NOT NULL DEFAULT 'FOUNDER',
    equity_share_pct DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    title VARCHAR(150),
    joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stakeholders_startup ON stakeholders(startup_id);

-- ============================================================================
-- TABLE: Funding Transaction Ledger (Immutable Audit)
-- ============================================================================
CREATE TABLE funding_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    round_name VARCHAR(100) NOT NULL, -- e.g., 'Pre-Seed', 'Seed Round', 'Series A'
    amount DECIMAL(15, 2) NOT NULL,
    equity_taken_pct DECIMAL(5, 2) NOT NULL,
    lead_backer_name VARCHAR(255) NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_funding_tx_startup ON funding_transactions(startup_id);

-- ============================================================================
-- TABLE: Job Posts (Talent Marketplace)
-- ============================================================================
CREATE TABLE job_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    role_type employment_type NOT NULL DEFAULT 'FULL_TIME',
    tech_stack VARCHAR(255)[] NOT NULL, -- e.g., ARRAY['React', 'Spring Boot', 'PostgreSQL']
    min_rate DECIMAL(10, 2) NOT NULL,
    max_rate DECIMAL(10, 2) NOT NULL,
    rate_period VARCHAR(20) NOT NULL DEFAULT 'HOURLY', -- 'HOURLY' or 'MONTHLY'
    location VARCHAR(150) NOT NULL DEFAULT 'Remote',
    description TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_posts_startup ON job_posts(startup_id);
CREATE INDEX idx_job_posts_active ON job_posts(is_active);

-- ============================================================================
-- TABLE: Job Applications
-- ============================================================================
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_url VARCHAR(512),
    cover_note TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED', -- 'SUBMITTED', 'SHORTLISTED', 'REJECTED'
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: Investor Swipes
-- ============================================================================
CREATE TABLE investor_swipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    direction swipe_direction NOT NULL,
    swiped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_investor_startup_swipe UNIQUE (investor_id, startup_id)
);

-- ============================================================================
-- TABLE: Swipe Matches
-- ============================================================================
CREATE TABLE swipe_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    founder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    meeting_scheduled BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT unique_match UNIQUE (investor_id, startup_id)
);

-- ============================================================================
-- TABLE: Meeting Schedules
-- ============================================================================
CREATE TABLE meeting_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES swipe_matches(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    founder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    room_id VARCHAR(100) NOT NULL UNIQUE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'COMPLETED', 'CANCELLED'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: Real-Time Notifications
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category notification_category NOT NULL DEFAULT 'SYSTEM_ALERT',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ============================================================================
-- TABLE: Super-Admin Immutable System Audit Logs
-- ============================================================================
CREATE TABLE system_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    action_type VARCHAR(100) NOT NULL, -- e.g., 'KYC_VERIFIED', 'FUNDING_ROUND_RECORDED', 'EQUITY_TRANSFERRED'
    entity_name VARCHAR(100) NOT NULL, -- e.g., 'Startup', 'User', 'FundingTransaction'
    entity_id VARCHAR(255),
    change_details_json JSONB NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_actor ON system_audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON system_audit_logs(action_type);
CREATE INDEX idx_audit_logs_created ON system_audit_logs(created_at DESC);

-- ============================================================================
-- TABLE: Vector Store for Spring AI RAG (pgvector HNSW Index)
-- ============================================================================
CREATE TABLE IF NOT EXISTS vector_store (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT,
    metadata JSONB,
    embedding VECTOR(1536) -- OpenAI text-embedding-3-small dimension
);

CREATE INDEX IF NOT EXISTS vector_store_embedding_idx
    ON vector_store USING hnsw (embedding vector_cosine_ops);

-- ============================================================================
-- SEED DATA FOR DEMONSTRATION & VERIFICATION
-- ============================================================================
INSERT INTO users (id, email, password_hash, full_name, role, company_name, cin_gstin, kyc_status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@startuphub.com', '$2a$10$e8W/49...adminhash', 'System Administrator', 'ADMIN', 'StartupHub Inc.', 'GSTIN999000111', 'VERIFIED'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'founder.alex@quantumai.io', '$2a$10$e8W/49...founderhash', 'Alex Vance', 'STUDENT_FOUNDER', 'Quantum AI Labs', 'CIN-U72900KA2024PTC1001', 'VERIFIED'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'investor.sarah@apexvc.com', '$2a$10$e8W/49...investorhash', 'Sarah Jenkins', 'INVESTOR', 'Apex Capital Partners', 'VC-REG-2023-887', 'VERIFIED'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'dev.devon@talent.com', '$2a$10$e8W/49...talenthash', 'Devon Chen', 'TALENT', 'Freelance Senior Engineer', NULL, 'VERIFIED');

INSERT INTO startups (id, founder_id, name, tagline, description, sector, stage, valuation, arr, arr_growth_pct, mrr, traction_users, total_funding_raised, funding_ask_amount, equity_offered_pct, verification_status) VALUES
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Quantum AI Labs', 'Autonomous Agent Infrastructure for Enterprise Finance', 'Building specialized LLM multi-agent orchestration for financial audits and automated compliance.', 'AI/ML', 'SEED', 8500000.00, 420000.00, 185.50, 35000.00, 14200, 1200000.00, 2500000.00, 8.50, 'VERIFIED');

INSERT INTO stakeholders (startup_id, user_id, name, type, equity_share_pct, title) VALUES
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Alex Vance', 'FOUNDER', 65.00, 'Chief Executive Officer'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Apex Capital Partners', 'INVESTOR', 15.00, 'Lead Seed Investor');

INSERT INTO funding_transactions (startup_id, investor_id, round_name, amount, equity_taken_pct, lead_backer_name) VALUES
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Seed Round', 1200000.00, 15.00, 'Apex Capital Partners');

INSERT INTO system_audit_logs (actor_id, actor_name, action_type, entity_name, entity_id, change_details_json) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'System Administrator', 'KYC_VERIFIED', 'User', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '{"verified": true, "notes": "CIN document verified against MCA database."}');
