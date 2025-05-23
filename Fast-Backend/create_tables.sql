-- Drop existing table if it exists
DROP TABLE IF EXISTS users;

-- Create users table with all required columns
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_token_expires TIMESTAMP,
    birthdate DATE,
    is_salaried BOOLEAN DEFAULT FALSE,
    address VARCHAR(255)
);
