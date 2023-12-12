CREATE SCHEMA IF NOT EXISTS cineverse_schema;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
    );

-- Create the roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id INTEGER PRIMARY KEY,
    authority VARCHAR(255) UNIQUE
);

-- Create the movies table
CREATE TABLE IF NOT EXISTS movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    poster VARCHAR(255),
    language VARCHAR(255),
    description TEXT,
    company VARCHAR(255),
    release_date DATE,
    runtime INTEGER
);

-- Create the user_movie_likes junction table
CREATE TABLE IF NOT EXISTS user_movie_likes (
    user_id INTEGER,
    movie_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    PRIMARY KEY (user_id, movie_id)
);

-- Create the user_movie_watch_later junction table
CREATE TABLE IF NOT EXISTS user_movie_watch_later (
    user_id INTEGER,
    movie_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    PRIMARY KEY (user_id, movie_id)
);

-- Create the user_role_junction junction table
CREATE TABLE IF NOT EXISTS user_role_junction (
    user_id INTEGER,
    role_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    PRIMARY KEY (user_id, role_id)
);