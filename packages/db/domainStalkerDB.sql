CREATE TYPE domain_status as ENUM ('scanning', 'scheduled', 'not-scheduled');

CREATE TABLE domain(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(256) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    total_subdomains TEXT,
    scan_interval INTERVAL NOT NULL,
    next_scan TIMESTAMP,
    status domain_status
);


CREATE TABLE scan(
    id BIGSERIAL PRIMARY KEY,
    domain_id BIGINT NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP NOT NULL,
    discovered_subdomains TEXT
);
