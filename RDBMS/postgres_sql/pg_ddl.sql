-- ============================================================
-- pg_ddl.sql
-- DDL: создание таблиц PostgreSQL (yambda2) — 8 таблиц
-- даталогической модели Yandex Yambda (sequential/500m)
-- ============================================================

CREATE TABLE IF NOT EXISTS event_type (
    event_type_id SERIAL NOT NULL CONSTRAINT pk_event_type PRIMARY KEY,
    event_type_name VARCHAR(20) NOT NULL CONSTRAINT uq_event_type_name UNIQUE
    CONSTRAINT ch_event_type_name
    CHECK (
        event_type_name IN
        ('listen', 'like', 'dislike', 'unlike', 'undislike')
    )
);
CREATE TABLE IF NOT EXISTS usr (
    user_id BIGINT NOT NULL CONSTRAINT pk_usr PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS artist (
    artist_id INTEGER NOT NULL CONSTRAINT pk_artist PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS album (
    album_id INTEGER NOT NULL CONSTRAINT pk_album PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS track (
    track_id INTEGER NOT NULL CONSTRAINT pk_track PRIMARY KEY,
    track_length_seconds INTEGER NULL,
    embed VECTOR(128) NULL,
    normalized_embed VECTOR(128) NULL
);
CREATE INDEX IF NOT EXISTS idx_track_embed
ON track USING hnsw (embed vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_track_norm_embed
ON track USING hnsw (normalized_embed vector_cosine_ops);
CREATE TABLE IF NOT EXISTS artist_track (
    artist_id INTEGER NOT NULL REFERENCES artist (artist_id),
    track_id INTEGER NOT NULL REFERENCES track (track_id),
    CONSTRAINT pk_artist_track PRIMARY KEY (artist_id, track_id)
);
CREATE TABLE IF NOT EXISTS album_track (
    album_id INTEGER NOT NULL REFERENCES album (album_id),
    track_id INTEGER NOT NULL REFERENCES track (track_id),
    CONSTRAINT pk_album_track PRIMARY KEY (album_id, track_id)
);
CREATE TABLE IF NOT EXISTS event (
    event_id BIGSERIAL NOT NULL CONSTRAINT pk_event PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES usr (user_id),
    track_id INTEGER NOT NULL REFERENCES track (track_id),
    event_type_id INTEGER NOT NULL REFERENCES event_type (event_type_id),
    ts BIGINT NOT NULL,
    is_organic SMALLINT NOT NULL CONSTRAINT ch_is_organic
    CHECK (is_organic IN (0, 1)),
    played_ratio_pct REAL NULL
);
