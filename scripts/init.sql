-- CreateTable
CREATE TYPE application_status AS ENUM ('applied', 'pending', 'rejected', 'accepted');
CREATE TABLE applications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(100) NOT NULL,
  company_name VARCHAR(50) NOT NULL,
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status application_status DEFAULT 'applied',
  description VARCHAR(200),
  annual_salary INT
);

CREATE TYPE user_status AS ENUM ('pending', 'validated');
CREATE TABLE users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(64) UNIQUE NOT NULL,
  hashed_password VARCHAR(64) NOT NULL,
  status user_status DEFAULT 'pending' NOT NULL
);


-- Seed
INSERT INTO applications (title, company_name, application_date, status, description, annual_salary)
VALUES
  ('Job 1', 'Company 1', '2025-01-12', 'rejected', 'Job description', NULL),
  ('Job 2', 'Company 2', '2025-02-12', 'pending', 'This is awesome !', 45000),
  ('Job 3', 'Company 3', '2025-03-12', DEFAULT, NULL, NULL),
  ('Job 4', 'Company 4', '2025-02-14', 'accepted', 'Super job description with some text', 42000);

