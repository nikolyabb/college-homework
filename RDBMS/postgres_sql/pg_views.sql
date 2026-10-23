-- ============================================================
-- pg_views.sql
-- Виртуальные таблицы (VIEW) PostgreSQL: 5 представлений
-- ============================================================

-- 1. Полная информация о треке
CREATE OR REPLACE VIEW vw_track_full AS
SELECT
    t.track_length_seconds AS length_sec,
    STRING_AGG(DISTINCT a.artist_id::text, ', ') AS artists,
    STRING_AGG(DISTINCT al.album_id::text, ', ') AS albums
FROM track AS t
LEFT JOIN artist_track AS att ON t.track_id = att.track_id
LEFT JOIN artist AS a ON att.artist_id = a.artist_id
LEFT JOIN album_track AS abt ON t.track_id = abt.track_id
LEFT JOIN album AS al ON abt.album_id = al.album_id
GROUP BY t.track_id, t.track_length_seconds;

-- 2. Статистика событий по типу
CREATE OR REPLACE VIEW vw_event_stats AS
SELECT
    et.event_type_name AS event_type,
    COUNT(*) AS cnt,
    ROUND(AVG(e.played_ratio_pct)::numeric, 2) AS avg_played_pct,
    SUM(CASE WHEN e.is_organic = 1 THEN 1 ELSE 0 END) AS organic
FROM event AS e
INNER JOIN event_type AS et ON e.event_type_id = et.event_type_id
INNER JOIN usr AS u ON e.user_id = u.user_id
INNER JOIN track AS t ON e.track_id = t.track_id
GROUP BY et.event_type_name;

-- 3. Топ треков по прослушиваниям
CREATE OR REPLACE VIEW vw_top_tracks AS
SELECT
    t.track_length_seconds AS length_sec,
    COUNT(*) AS listens,
    ROUND(AVG(e.played_ratio_pct)::numeric, 1) AS avg_played_pct
FROM event AS e
INNER JOIN event_type AS et ON e.event_type_id = et.event_type_id
INNER JOIN usr AS u ON e.user_id = u.user_id
INNER JOIN track AS t ON e.track_id = t.track_id
WHERE et.event_type_name = 'listen'
GROUP BY t.track_id, t.track_length_seconds
ORDER BY COUNT(*) DESC;

-- 4. Сводка активности пользователей
CREATE OR REPLACE VIEW vw_user_activity AS
SELECT
    COUNT(*) AS total_events,
    SUM(CASE WHEN et.event_type_name = 'listen' THEN 1 ELSE 0 END) AS listens,
    SUM(CASE WHEN et.event_type_name = 'like' THEN 1 ELSE 0 END) AS likes,
    SUM(CASE WHEN et.event_type_name = 'dislike' THEN 1 ELSE 0 END)
        AS dislikes,
    ROUND(AVG(e.played_ratio_pct)::numeric, 1) AS avg_played_pct
FROM event AS e
INNER JOIN event_type AS et ON e.event_type_id = et.event_type_id
INNER JOIN usr AS u ON e.user_id = u.user_id
INNER JOIN track AS t ON e.track_id = t.track_id
GROUP BY u.user_id;

-- 5. Органические прослушивания
CREATE OR REPLACE VIEW vw_organic_listens AS
SELECT
    et.event_type_name AS event_type,
    t.track_length_seconds AS track_length_sec,
    ROUND(e.played_ratio_pct::numeric, 1) AS played_pct
FROM event AS e
INNER JOIN event_type AS et ON e.event_type_id = et.event_type_id
INNER JOIN usr AS u ON e.user_id = u.user_id
INNER JOIN track AS t ON e.track_id = t.track_id
WHERE e.is_organic = 1;
