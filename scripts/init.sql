-- CreateTable
CREATE TYPE user_status AS ENUM ('pending', 'validated');
CREATE TABLE users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(64) UNIQUE NOT NULL,
  hashed_password VARCHAR(64) NOT NULL,
  status user_status DEFAULT 'pending' NOT NULL
);

CREATE TYPE application_status AS ENUM ('applied', 'pending', 'rejected', 'accepted');
CREATE TABLE applications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(100) NOT NULL,
  company_name VARCHAR(50) NOT NULL,
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status application_status DEFAULT 'applied',
  description VARCHAR(200),
  annual_salary INT,

  user_id BIGINT REFERENCES users ON DELETE CASCADE NOT NULL 
);

CREATE INDEX user_id_idx ON applications (user_id);


-- Seed
WITH user_a AS (
  INSERT INTO users (email, hashed_password, status) 
  -- raw password: 2XH$F9n*^NsB$M0
  VALUES ('test@example.com', '$2b$10$bgoaLf6wZyLXUEVFduTon.WSTcLN9vu8Dx6SaLehYjmfRDE435kF6', 'validated')
   RETURNING id
), data_a AS (
  SELECT 
      title, company_name, application_date, status, description, annual_salary
  FROM(
    VALUES
    ('Job 1', 'Company 1', '2025-01-12', 'rejected', 'Job description', NULL),
    ('Job 2', 'Company 2', '2025-02-12', 'pending', 'This is awesome !', 45000),
    ('Job 3', 'Company 3', '2025-03-12', 'applied', NULL, NULL),
    ('Job 4', 'Company 4', '2025-02-14', 'accepted', 'Super job description with some text', 42000)
  ) Data(title, company_name, application_date, status, description, annual_salary)
), cross_product AS (
  SELECT *
  FROM user_a CROSS JOIN data_a
)
INSERT into applications (user_id, title, company_name, application_date , status, description, annual_salary)
SELECT cross_product.id, cross_product.title, cross_product.company_name, TO_DATE(cross_product.application_date,'YYYY-MM-DD'), cross_product.status::application_status, cross_product.description, CAST(cross_product.annual_salary AS INTEGER)
FROM cross_product;


INSERT INTO users (email, hashed_password, status) 
  -- raw password: 2XH$F9n*^NsB$M0
  VALUES ('empty@example.com', '$2b$10$bgoaLf6wZyLXUEVFduTon.WSTcLN9vu8Dx6SaLehYjmfRDE435kF6', 'validated')