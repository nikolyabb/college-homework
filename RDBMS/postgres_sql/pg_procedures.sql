-- ============================================================
-- pg_procedures.sql
-- Хранимые процедуры PostgreSQL: 3 процедуры на каждую
-- из 8 таблиц (insert, update, delete) — всего 24
-- ============================================================

-- event_type
CREATE OR REPLACE PROCEDURE event_type_insert(
    p_name VARCHAR(20)
) LANGUAGE plpgsql AS $$
BEGIN INSERT INTO event_type(event_type_name) VALUES(p_name) ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN RAISE NOTICE 'event_type_insert: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE event_type_update(
    p_id INT, p_name VARCHAR(20)
) LANGUAGE plpgsql AS $$
BEGIN UPDATE event_type SET event_type_name=p_name WHERE event_type_id=p_id;
EXCEPTION WHEN others THEN RAISE NOTICE 'event_type_update: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE event_type_delete(p_id INT) LANGUAGE plpgsql AS $$
DECLARE v INT; BEGIN SELECT COUNT(*) INTO v FROM event WHERE event_type_id=p_id;
IF v>0 THEN RAISE NOTICE 'event_type_delete: % related events, delete blocked', v;
ELSE DELETE FROM event_type WHERE event_type_id=p_id; END IF; END; $$;

-- usr
CREATE OR REPLACE PROCEDURE usr_insert(p_id BIGINT) LANGUAGE plpgsql AS $$
BEGIN INSERT INTO usr(user_id) VALUES(p_id) ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN RAISE NOTICE 'usr_insert: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE usr_update(
    p_old BIGINT, p_new BIGINT
) LANGUAGE plpgsql AS $$
BEGIN UPDATE usr SET user_id=p_new WHERE user_id=p_old;
EXCEPTION WHEN others THEN RAISE NOTICE 'usr_update: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE usr_delete(p_id BIGINT) LANGUAGE plpgsql AS $$
DECLARE v INT; BEGIN SELECT COUNT(*) INTO v FROM event WHERE user_id=p_id;
IF v>0 THEN RAISE NOTICE 'usr_delete: % events exist for user, delete blocked', v;
ELSE DELETE FROM usr WHERE user_id=p_id; END IF; END; $$;

-- artist
CREATE OR REPLACE PROCEDURE artist_insert(p_id INT) LANGUAGE plpgsql AS $$
BEGIN INSERT INTO artist(artist_id) VALUES(p_id) ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN RAISE NOTICE 'artist_insert: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE artist_update(
    p_old INT, p_new INT
) LANGUAGE plpgsql AS $$
BEGIN UPDATE artist SET artist_id=p_new WHERE artist_id=p_old;
EXCEPTION WHEN others THEN RAISE NOTICE 'artist_update: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE artist_delete(p_id INT) LANGUAGE plpgsql AS $$
DECLARE v INT; BEGIN SELECT COUNT(*) INTO v FROM artist_track WHERE artist_id=p_id;
IF v>0 THEN RAISE NOTICE 'artist_delete: % tracks exist for artist, delete blocked', v;
ELSE DELETE FROM artist WHERE artist_id=p_id; END IF; END; $$;

-- album
CREATE OR REPLACE PROCEDURE album_insert(p_id INT) LANGUAGE plpgsql AS $$
BEGIN INSERT INTO album(album_id) VALUES(p_id) ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN RAISE NOTICE 'album_insert: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE album_update(
    p_old INT, p_new INT
) LANGUAGE plpgsql AS $$
BEGIN UPDATE album SET album_id=p_new WHERE album_id=p_old;
EXCEPTION WHEN others THEN RAISE NOTICE 'album_update: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE album_delete(p_id INT) LANGUAGE plpgsql AS $$
DECLARE v INT; BEGIN SELECT COUNT(*) INTO v FROM album_track WHERE album_id=p_id;
IF v>0 THEN RAISE NOTICE 'album_delete: % tracks exist in album, delete blocked', v;
ELSE DELETE FROM album WHERE album_id=p_id; END IF; END; $$;

-- track
CREATE OR REPLACE PROCEDURE track_insert(
    p_id INT, p_len INT
) LANGUAGE plpgsql AS $$
BEGIN INSERT INTO track(track_id,track_length_seconds) VALUES(p_id,p_len) ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN RAISE NOTICE 'track_insert: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE track_update(
    p_id INT, p_len INT
) LANGUAGE plpgsql AS $$
BEGIN UPDATE track SET track_length_seconds=p_len WHERE track_id=p_id;
EXCEPTION WHEN others THEN RAISE NOTICE 'track_update: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE track_delete(p_id INT) LANGUAGE plpgsql AS $$
DECLARE v INT; BEGIN SELECT COUNT(*) INTO v FROM event WHERE track_id=p_id;
IF v>0 THEN RAISE NOTICE 'track_delete: % events exist for track, delete blocked', v;
ELSE DELETE FROM artist_track WHERE track_id=p_id;
     DELETE FROM album_track  WHERE track_id=p_id;
     DELETE FROM track WHERE track_id=p_id; END IF; END; $$;

-- artist_track
CREATE OR REPLACE PROCEDURE artist_track_insert(
    p_art INT, p_trk INT
) LANGUAGE plpgsql AS $$
BEGIN INSERT INTO artist_track(artist_id,track_id) VALUES(p_art,p_trk) ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN RAISE NOTICE 'artist_track_insert: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE artist_track_update(
    p_art_old INT, p_trk_old INT, p_art_new INT, p_trk_new INT
)
LANGUAGE plpgsql AS $$
BEGIN DELETE FROM artist_track WHERE artist_id=p_art_old AND track_id=p_trk_old;
INSERT INTO artist_track(artist_id,track_id) VALUES(p_art_new,p_trk_new) ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN RAISE NOTICE 'artist_track_update: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE artist_track_delete(
    p_art INT, p_trk INT
) LANGUAGE plpgsql AS $$
BEGIN DELETE FROM artist_track WHERE artist_id=p_art AND track_id=p_trk;
EXCEPTION WHEN others THEN RAISE NOTICE 'artist_track_delete: %', SQLERRM; END; $$;

-- album_track
CREATE OR REPLACE PROCEDURE album_track_insert(
    p_alb INT, p_trk INT
) LANGUAGE plpgsql AS $$
BEGIN INSERT INTO album_track(album_id,track_id) VALUES(p_alb,p_trk) ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN RAISE NOTICE 'album_track_insert: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE album_track_update(
    p_alb_old INT, p_trk_old INT, p_alb_new INT, p_trk_new INT
)
LANGUAGE plpgsql AS $$
BEGIN DELETE FROM album_track WHERE album_id=p_alb_old AND track_id=p_trk_old;
INSERT INTO album_track(album_id,track_id) VALUES(p_alb_new,p_trk_new) ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN RAISE NOTICE 'album_track_update: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE album_track_delete(
    p_alb INT, p_trk INT
) LANGUAGE plpgsql AS $$
BEGIN DELETE FROM album_track WHERE album_id=p_alb AND track_id=p_trk;
EXCEPTION WHEN others THEN RAISE NOTICE 'album_track_delete: %', SQLERRM; END; $$;

-- event
CREATE OR REPLACE PROCEDURE event_insert(
    p_uid BIGINT, p_tid INT, p_etid INT,
    p_ts BIGINT, p_org SMALLINT, p_ratio REAL
)
LANGUAGE plpgsql AS $$
BEGIN INSERT INTO event(user_id,track_id,event_type_id,ts,is_organic,played_ratio_pct)
      VALUES(p_uid,p_tid,p_etid,p_ts,p_org,p_ratio);
EXCEPTION WHEN others THEN RAISE NOTICE 'event_insert: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE event_update(
    p_id BIGINT, p_ratio REAL
) LANGUAGE plpgsql AS $$
BEGIN UPDATE event SET played_ratio_pct=p_ratio WHERE event_id=p_id;
EXCEPTION WHEN others THEN RAISE NOTICE 'event_update: %', SQLERRM; END; $$;

CREATE OR REPLACE PROCEDURE event_delete(p_id BIGINT) LANGUAGE plpgsql AS $$
BEGIN DELETE FROM event WHERE event_id=p_id;
EXCEPTION WHEN others THEN RAISE NOTICE 'event_delete: %', SQLERRM; END; $$;
