-- ============================================================
-- ma_ddl.sql
-- DDL: создание таблиц MariaDB (yambda) — 8 таблиц
-- даталогической модели Yandex Yambda (sequential/500m)
-- ============================================================

CREATE TABLE IF NOT EXISTS event_type (
    event_type_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    event_type_name VARCHAR(20) NOT NULL UNIQUE CHECK (event_type_name IN
        ('listen', 'like', 'dislike', 'unlike', 'undislike'))
);

CREATE TABLE IF NOT EXISTS usr (
    user_id BIGINT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS artist (
    artist_id INT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS album (
    album_id INT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS track (
    track_id INT NOT NULL PRIMARY KEY,
    track_length_seconds INT NULL,
    embed VECTOR(128) NOT NULL,
    normalized_embed VECTOR(128) NOT NULL,
    VECTOR INDEX IDX_track_embed (embed) DISTANCE=cosine
);

CREATE TABLE IF NOT EXISTS artist_track (
    artist_id INT NOT NULL REFERENCES artist (artist_id),
    track_id INT NOT NULL REFERENCES track (track_id),
    PRIMARY KEY (artist_id, track_id)
);

CREATE TABLE IF NOT EXISTS album_track (
    album_id INT NOT NULL REFERENCES album (album_id),
    track_id INT NOT NULL REFERENCES track (track_id),
    PRIMARY KEY (album_id, track_id)
);

CREATE TABLE IF NOT EXISTS event (
    event_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES usr (user_id),
    track_id INT NOT NULL REFERENCES track (track_id),
    event_type_id INT NOT NULL REFERENCES event_type (event_type_id),
    ts BIGINT NOT NULL,
    is_organic TINYINT NOT NULL CHECK (is_organic IN (0, 1)),
    played_ratio_pct FLOAT NULL
);