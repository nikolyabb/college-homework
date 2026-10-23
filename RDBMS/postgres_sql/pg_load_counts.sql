-- Финальная верификация: count(*) и count(DISTINCT pk) для всех таблиц
-- Сравнение фактического количества строк с целевым значением
-- и проверка на дубликаты
--
-- Версии для PostgreSQL и MariaDB отличаются только синтаксисом
-- count(DISTINCT) для составных PK в junction-таблицах:
--   PostgreSQL: count(DISTINCT (col1, col2)) — row expression
--   MariaDB: count(DISTINCT col1, col2) — multi-column DISTINCT


-- =====================================================================
-- PostgreSQL  (yambda2)
-- =====================================================================
SELECT
    table_name,
    target,
    actual,
    distinct_pk,
    CASE
        WHEN actual = target AND actual = distinct_pk THEN 'OK'
        ELSE 'MISMATCH'
    END AS status
FROM (
    SELECT
        'event_type' AS table_name,
        5 AS target,
        count(*) AS actual,
        count(DISTINCT event_type_id) AS distinct_pk
    FROM event_type
    UNION ALL
    SELECT
        'usr' AS table_name,
        100000 AS target,
        count(*) AS actual,
        count(DISTINCT user_id) AS distinct_pk
    FROM usr
    UNION ALL
    SELECT
        'artist' AS table_name,
        1293394 AS target,
        count(*) AS actual,
        count(DISTINCT artist_id) AS distinct_pk
    FROM artist
    UNION ALL
    SELECT
        'album' AS table_name,
        3367691 AS target,
        count(*) AS actual,
        count(DISTINCT album_id) AS distinct_pk
    FROM album
    UNION ALL
    SELECT
        'track' AS table_name,
        8088303 AS target,
        count(*) AS actual,
        count(DISTINCT track_id) AS distinct_pk
    FROM track
    UNION ALL
    SELECT
        'artist_track' AS table_name,
        9271906 AS target,
        count(*) AS actual,
        count(DISTINCT artist_id, track_id) AS distinct_pk
    FROM artist_track
    UNION ALL
    SELECT
        'album_track' AS table_name,
        9651644 AS target,
        count(*) AS actual,
        count(DISTINCT album_id, track_id) AS distinct_pk
    FROM album_track
    UNION ALL
    SELECT
        'event' AS table_name,
        480255564 AS target,
        count(*) AS actual,
        count(DISTINCT event_id) AS distinct_pk
    FROM event
) AS t
ORDER BY target;
