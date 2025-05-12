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