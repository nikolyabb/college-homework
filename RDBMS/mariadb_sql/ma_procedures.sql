-- ============================================================
-- ma_procedures.sql
-- Хранимые процедуры MariaDB: 3 процедуры на каждую
-- из 8 таблиц (insert, update, delete) — всего 24
-- ============================================================

DELIMITER //

-- event_type
DROP PROCEDURE IF EXISTS event_type_insert //
CREATE PROCEDURE event_type_insert(IN p_name VARCHAR(20))
BEGIN
    INSERT IGNORE INTO event_type(event_type_name) VALUES(p_name);
END //

DROP PROCEDURE IF EXISTS event_type_update //
CREATE PROCEDURE event_type_update(IN p_id INT, IN p_name VARCHAR(20))
BEGIN
    UPDATE event_type SET event_type_name=p_name WHERE event_type_id=p_id;
END //

DROP PROCEDURE IF EXISTS event_type_delete //
CREATE PROCEDURE event_type_delete(IN p_id INT)
BEGIN
    DECLARE v INT DEFAULT 0;
    SELECT COUNT(*) INTO v FROM event WHERE event_type_id = p_id;
    IF v > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Delete blocked: related events exist';
    ELSE
        DELETE FROM event_type WHERE event_type_id = p_id;
    END IF;
END //

-- usr
DROP PROCEDURE IF EXISTS usr_insert //
CREATE PROCEDURE usr_insert(IN p_id BIGINT)
BEGIN
    INSERT IGNORE INTO usr(user_id) VALUES(p_id);
END //

DROP PROCEDURE IF EXISTS usr_update //
CREATE PROCEDURE usr_update(IN p_old BIGINT, IN p_new BIGINT)
BEGIN
    UPDATE usr SET user_id=p_new WHERE user_id=p_old;
END //

DROP PROCEDURE IF EXISTS usr_delete //
CREATE PROCEDURE usr_delete(IN p_id BIGINT)
BEGIN
    DECLARE v INT DEFAULT 0;
    SELECT COUNT(*) INTO v FROM event WHERE user_id = p_id;
    IF v > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Delete blocked: user has events';
    ELSE
        DELETE FROM usr WHERE user_id = p_id;
    END IF;
END //

-- artist
DROP PROCEDURE IF EXISTS artist_insert //
CREATE PROCEDURE artist_insert(IN p_id INT)
BEGIN
    INSERT IGNORE INTO artist(artist_id) VALUES(p_id);
END //

DROP PROCEDURE IF EXISTS artist_update //
CREATE PROCEDURE artist_update(IN p_old INT, IN p_new INT)
BEGIN
    UPDATE artist SET artist_id=p_new WHERE artist_id=p_old;
END //

DROP PROCEDURE IF EXISTS artist_delete //
CREATE PROCEDURE artist_delete(IN p_id INT)
BEGIN
    DECLARE v INT DEFAULT 0;
    SELECT COUNT(*) INTO v FROM artist_track WHERE artist_id = p_id;
    IF v > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Delete blocked: artist has tracks';
    ELSE
        DELETE FROM artist WHERE artist_id = p_id;
    END IF;
END //

-- album
DROP PROCEDURE IF EXISTS album_insert //
CREATE PROCEDURE album_insert(IN p_id INT)
BEGIN
    INSERT IGNORE INTO album(album_id) VALUES(p_id);
END //

DROP PROCEDURE IF EXISTS album_update //
CREATE PROCEDURE album_update(IN p_old INT, IN p_new INT)
BEGIN
    UPDATE album SET album_id=p_new WHERE album_id=p_old;
END //

DROP PROCEDURE IF EXISTS album_delete //
CREATE PROCEDURE album_delete(IN p_id INT)
BEGIN
    DECLARE v INT DEFAULT 0;
    SELECT COUNT(*) INTO v FROM album_track WHERE album_id = p_id;
    IF v > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Delete blocked: album has tracks';
    ELSE
        DELETE FROM album WHERE album_id = p_id;
    END IF;
END //

-- track
DROP PROCEDURE IF EXISTS track_insert //
CREATE PROCEDURE track_insert(IN p_id INT, IN p_len INT)
BEGIN
    INSERT IGNORE INTO track(track_id, track_length_seconds) VALUES(p_id, p_len);
END //

DROP PROCEDURE IF EXISTS track_update //
CREATE PROCEDURE track_update(IN p_id INT, IN p_len INT)
BEGIN
    UPDATE track SET track_length_seconds=p_len WHERE track_id=p_id;
END //

DROP PROCEDURE IF EXISTS track_delete //
CREATE PROCEDURE track_delete(IN p_id INT)
BEGIN
    DECLARE v INT DEFAULT 0;
    SELECT COUNT(*) INTO v FROM event WHERE track_id = p_id;
    IF v > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Delete blocked: track has events';
    ELSE
        DELETE FROM artist_track WHERE track_id = p_id;
        DELETE FROM album_track  WHERE track_id = p_id;
        DELETE FROM track WHERE track_id = p_id;
    END IF;
END //

-- artist_track
DROP PROCEDURE IF EXISTS artist_track_insert //
CREATE PROCEDURE artist_track_insert(IN p_art INT, IN p_trk INT)
BEGIN
    INSERT IGNORE INTO artist_track(artist_id, track_id) VALUES(p_art, p_trk);
END //

DROP PROCEDURE IF EXISTS artist_track_update //
CREATE PROCEDURE artist_track_update(IN p_art_old INT, IN p_trk_old INT, IN p_art_new INT, IN p_trk_new INT)
BEGIN
    DELETE FROM artist_track WHERE artist_id=p_art_old AND track_id=p_trk_old;
    INSERT IGNORE INTO artist_track(artist_id, track_id) VALUES(p_art_new, p_trk_new);
END //

DROP PROCEDURE IF EXISTS artist_track_delete //
CREATE PROCEDURE artist_track_delete(IN p_art INT, IN p_trk INT)
BEGIN
    DELETE FROM artist_track WHERE artist_id=p_art AND track_id=p_trk;
END //

-- album_track
DROP PROCEDURE IF EXISTS album_track_insert //
CREATE PROCEDURE album_track_insert(IN p_alb INT, IN p_trk INT)
BEGIN
    INSERT IGNORE INTO album_track(album_id, track_id) VALUES(p_alb, p_trk);
END //

DROP PROCEDURE IF EXISTS album_track_update //
CREATE PROCEDURE album_track_update(IN p_alb_old INT, IN p_trk_old INT, IN p_alb_new INT, IN p_trk_new INT)
BEGIN
    DELETE FROM album_track WHERE album_id=p_alb_old AND track_id=p_trk_old;
    INSERT IGNORE INTO album_track(album_id, track_id) VALUES(p_alb_new, p_trk_new);
END //

DROP PROCEDURE IF EXISTS album_track_delete //
CREATE PROCEDURE album_track_delete(IN p_alb INT, IN p_trk INT)
BEGIN
    DELETE FROM album_track WHERE album_id=p_alb AND track_id=p_trk;
END //

-- event
DROP PROCEDURE IF EXISTS event_insert //
CREATE PROCEDURE event_insert(IN p_uid BIGINT, IN p_tid INT, IN p_etid INT,
                               IN p_ts BIGINT, IN p_org TINYINT, IN p_ratio FLOAT)
BEGIN
    INSERT INTO event(user_id, track_id, event_type_id, ts, is_organic, played_ratio_pct)
    VALUES(p_uid, p_tid, p_etid, p_ts, p_org, p_ratio);
END //

DROP PROCEDURE IF EXISTS event_update //
CREATE PROCEDURE event_update(IN p_id BIGINT, IN p_ratio FLOAT)
BEGIN
    UPDATE event SET played_ratio_pct=p_ratio WHERE event_id=p_id;
END //

DROP PROCEDURE IF EXISTS event_delete //
CREATE PROCEDURE event_delete(IN p_id BIGINT)
BEGIN
    DELETE FROM event WHERE event_id=p_id;
END //

DELIMITER ;