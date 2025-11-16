-- Database Initialization Script
-- This script runs when PostgreSQL container starts for the first time

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For trigram similarity searches
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive searches

-- Set timezone
SET timezone = 'America/Sao_Paulo';

-- Create additional schemas if needed (optional)
-- CREATE SCHEMA IF NOT EXISTS cms;
-- CREATE SCHEMA IF NOT EXISTS analytics;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE asof_cms TO postgres;

-- Performance tuning (adjust based on your hardware)
-- These are commented out but can be added to postgresql.conf
/*
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
maintenance_work_mem = 64MB
*/

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'Database initialized successfully';
  RAISE NOTICE 'Extensions enabled: uuid-ossp, pg_trgm, unaccent';
  RAISE NOTICE 'Timezone set to: America/Sao_Paulo';
END $$;
