-- ============================================================
-- ma_vector_search.sql
-- Векторный поиск MariaDB (VECTOR INDEX): поиск 5 наиболее
-- похожих треков по косинусному расстоянию VEC_Distance_Cosine
-- ============================================================

-- Поиск 5 треков, наиболее похожих на трек с минимальным ID.
-- VEC_Distance_Cosine возвращает косинусное расстояние
-- (0 = идентичны, 2 = противоположны). Использует VECTOR INDEX.
SELECT
    t.track_length_seconds AS length_sec,
    ROUND(VEC_DISTANCE_COSINE(
        t.embed,
        (
            SELECT q.embed FROM track AS q
            ORDER BY q.track_id LIMIT 1
        )
    ), 4) AS cosine_distance
FROM track AS t
ORDER BY
    VEC_DISTANCE_COSINE(
        t.embed,
        (
            SELECT q.embed FROM track AS q
            ORDER BY q.track_id LIMIT 1
        )
    )
LIMIT 5;
