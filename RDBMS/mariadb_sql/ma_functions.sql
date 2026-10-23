-- ============================================================
-- ma_functions.sql
-- Пользовательские функции (UDF) MariaDB: 3 функции
-- 1. Подсчёт событий пользователя
-- 2. Список артистов трека
-- 3. Косинусное сходство двух треков (векторный поиск)
-- ============================================================

DELIMITER //

-- 1. Подсчёт количества событий пользователя
DROP FUNCTION IF EXISTS fn_user_event_count //
CREATE FUNCTION fn_user_event_count(p_user_id BIGINT)
RETURNS BIGINT
READS SQL DATA
BEGIN
    DECLARE v_count BIGINT;
    SELECT COUNT(*) INTO v_count FROM event WHERE user_id = p_user_id;
    RETURN v_count;
END //

-- 2. Список артистов трека в виде строки
DROP FUNCTION IF EXISTS fn_track_artist_list //
CREATE FUNCTION fn_track_artist_list(p_track_id INT)
RETURNS TEXT
READS SQL DATA
BEGIN
    DECLARE v_list TEXT;
    SELECT GROUP_CONCAT(artist_id SEPARATOR ', ')
    INTO v_list
    FROM artist_track WHERE track_id = p_track_id;
    RETURN COALESCE(v_list, '-');
END //

-- 3. Косинусное сходство между двумя треками (1 = идентичны, 0 = ортогональны)
-- Использует VEC_Distance_Cosine из MariaDB Vector
DROP FUNCTION IF EXISTS fn_track_similarity //
CREATE FUNCTION fn_track_similarity(p_track1 INT, p_track2 INT)
RETURNS DECIMAL(10,6)
READS SQL DATA
BEGIN
    DECLARE v1 VECTOR(128);
    DECLARE v2 VECTOR(128);
    DECLARE dist DOUBLE;
    SELECT embed INTO v1 FROM track WHERE track_id = p_track1;
    SELECT embed INTO v2 FROM track WHERE track_id = p_track2;
    SET dist = VEC_Distance_Cosine(v1, v2);
    RETURN CAST(1.0 - dist AS DECIMAL(10,6));
END //

DELIMITER ;