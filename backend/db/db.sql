-- =====================================================
-- TRADING PLATFORM DATABASE - POSTGRESQL SCHEMA
-- =====================================================

-- Create database
-- CREATE DATABASE trading_platform;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Create custom types
-- =====================================================
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE order_type AS ENUM ('BUY', 'SELL');
CREATE TYPE movement_type AS ENUM ('D', 'W');

-- =====================================================
-- TABLE: users
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role user_role DEFAULT 'USER' NOT NULL,
    limit_id UUID,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- TABLE: limits
-- =====================================================
CREATE TABLE limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    max_amount DECIMAL(20,8) NOT NULL,
    max_daily_orders INTEGER NOT NULL,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =====================================================
-- TABLE: assets
-- =====================================================
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_assets_symbol ON assets(symbol);
CREATE INDEX idx_assets_name ON assets(name);

-- =====================================================
-- TABLE: trading_pairs
-- =====================================================
CREATE TABLE trading_pairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_asset_id UUID NOT NULL,
    quote_asset_id UUID NOT NULL,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT uk_trading_pairs UNIQUE (base_asset_id, quote_asset_id)
);

-- =====================================================
-- TABLE: orders
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type order_type NOT NULL,
    trading_pairs_id UUID NOT NULL,
    quote_price DECIMAL(20,8) NOT NULL,
    base_quantity DECIMAL(20,8) NOT NULL,
    base_remaining DECIMAL(20,8) NOT NULL,
    cancelled BOOLEAN DEFAULT TRUE NOT NULL,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT chk_base_remaining CHECK (base_remaining >= 0 AND base_remaining <= base_quantity)
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_type ON orders(type);
CREATE INDEX idx_orders_trading_pairs ON orders(trading_pairs_id);

-- =====================================================
-- TABLE: orders_match
-- =====================================================
CREATE TABLE orders_match (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buy_order UUID NOT NULL,
    sell_order UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =====================================================
-- TABLE: balances
-- =====================================================
CREATE TABLE balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    asset_id UUID NOT NULL,
    amount DECIMAL(20,8) DEFAULT 0 NOT NULL,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT uk_user_asset UNIQUE (user_id, asset_id)
);

CREATE INDEX idx_balances_user ON balances(user_id);

-- =====================================================
-- TABLE: movements
-- =====================================================
CREATE TABLE movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(20,8) NOT NULL,
    movement_type movement_type not null,
    order_match_id UUID,
    balance_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_movement_balance ON movements(balance_id);
CREATE INDEX idx_movement_created ON movements(created_at);

-- =====================================================
-- FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Users foreign keys
ALTER TABLE users
    ADD CONSTRAINT fk_users_limit 
    FOREIGN KEY (limit_id) REFERENCES limits(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_trading_pairs_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Trading pairs foreign keys
ALTER TABLE trading_pairs
    ADD CONSTRAINT fk_trading_pairs_base_asset 
    FOREIGN KEY (base_asset_id) REFERENCES assets(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_trading_pairs_quote_asset 
    FOREIGN KEY (quote_asset_id) REFERENCES assets(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_trading_pairs_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Orders foreign keys
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_orders_trading_pairs 
    FOREIGN KEY (trading_pairs_id) REFERENCES trading_pairs(id) ON DELETE RESTRICT;

-- Order match foreign keys
ALTER TABLE orders_match
    ADD CONSTRAINT fk_orders_match_buy 
    FOREIGN KEY (buy_order) REFERENCES orders(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_orders_match_sell 
    FOREIGN KEY (sell_order) REFERENCES orders(id) ON DELETE RESTRICT;

-- Balances foreign keys
ALTER TABLE balances
    ADD CONSTRAINT fk_balances_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_balances_asset 
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE RESTRICT;

-- Movements foreign keys
ALTER TABLE movements
    ADD CONSTRAINT fk_movements_balance 
    FOREIGN KEY (balance_id) REFERENCES balances(id) ON DELETE RESTRICT;

-- Assets foreign keys
ALTER TABLE assets
    ADD CONSTRAINT fk_asset_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Limits foreign keys
ALTER TABLE limits
    ADD CONSTRAINT fk_limits_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- =====================================================
-- END OF DATABASE SCHEMA
-- =====================================================
