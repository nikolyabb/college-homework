-- ============================================================
-- pg_functions.sql
-- Пользовательские функции (UDF) PostgreSQL: 2 функции
-- ============================================================

-- Подсчёт количества событий пользователя
CREATE OR REPLACE FUNCTION fn_user_event_count(p_user_id BIGINT)
RETURNS BIGINT LANGUAGE plpgsql AS $$
DECLARE v_count BIGINT;
BEGIN
    SELECT COUNT(*) INTO v_count FROM event WHERE user_id = p_user_id;
    RETURN v_count;
END; $$;

-- Список артистов трека в виде строки
CREATE OR REPLACE FUNCTION fn_track_artist_list(p_track_id INT)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE v_list TEXT;
BEGIN
    SELECT STRING_AGG(artist_id::text, ', ')
    INTO v_list
    FROM artist_track WHERE track_id = p_track_id;
    RETURN COALESCE(v_list, '-');
END; $$;
