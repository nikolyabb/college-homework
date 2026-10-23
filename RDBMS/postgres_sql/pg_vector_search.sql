-- ============================================================
-- pg_vector_search.sql
-- Векторный поиск PostgreSQL (pgvector): поиск 5 наиболее
-- похожих треков по косинусному расстоянию
-- ============================================================

-- Поиск 5 треков, наиболее похожих на трек с минимальным ID.
-- Оператор <=> — косинусное расстояние (pgvector HNSW).
-- Замените :query_vec на конкретный вектор эмбеддинга при использовании.
SELECT
    t.track_length_seconds AS length_sec,
    ROUND(
        (t.embed <=> (
            SELECT q.embed FROM track AS q
            WHERE q.embed IS NOT NULL
            ORDER BY q.track_id LIMIT 1
        ))::numeric, 4
    )
        AS cosine_distance
FROM track AS t
WHERE t.embed IS NOT NULL
ORDER BY
    t.embed <=> (
        SELECT q.embed FROM track AS q
        WHERE q.embed IS NOT NULL
        ORDER BY q.track_id LIMIT 1
    )
LIMIT 5;
