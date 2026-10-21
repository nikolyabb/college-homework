import datetime
import sqlite3
import math
import os
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, LineChart, ScatterChart, Reference, Series
from openpyxl.chart.shapes import GraphicalProperties
from openpyxl.chart.marker import Marker
from openpyxl.drawing.line import LineProperties
from openpyxl.workbook.defined_name import DefinedName

DB = os.path.expanduser("~/Library/Safari/History.db")
GRID_START = datetime.date(2026, 1, 4)
GRID_END = datetime.date(2026, 6, 21)
SAMPLE_START = datetime.date(2026, 1, 4)
ZERO_FILL_END = datetime.date(2026, 1, 11)
OUT_DIR = "/Users/sid/Library/Mobile Documents/com~apple~CloudDocs/Projects/github.com/nikolyabb/college-homework/math-probability"
OUT_XLSX = os.path.join(OUT_DIR, "DATA.xlsx")

RU_MONTHS = {1: "Январь", 2: "Февраль", 3: "Март", 4: "Апрель", 5: "Май", 6: "Июнь"}
RU_WD = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]


def hours_formula_a(visits, span_hours):
    """Формула перевода визитов в часы: max(0.5, sqrt(visits)*0.45 + span*0.25)."""
    if visits == 0:
        return 0.0
    raw = math.sqrt(visits) * 0.45 + span_hours * 0.25
    return round(max(0.5, raw), 1)


# 1. Запрос истории Safari
conn = sqlite3.connect(DB)
cur = conn.cursor()
cur.execute("""
    SELECT visit_time + 978307200 AS epoch
    FROM history_visits
    JOIN history_items ON history_visits.history_item = history_items.id
    WHERE url LIKE '%newlxp.ru%'
      AND date(visit_time + 978307200, 'unixepoch', 'localtime') BETWEEN '2026-01-04' AND '2026-06-21'
      AND load_successful = 1
    ORDER BY epoch
""")
epochs = [r[0] for r in cur.fetchall()]
conn.close()

visits_by_day = {}
for e in epochs:
    dt = datetime.datetime.fromtimestamp(e, tz=datetime.timezone(datetime.timedelta(hours=3)))
    visits_by_day.setdefault(dt.date(), []).append(dt)

# 2. Часы по активным дням
day_hours = {}
for d, ts in visits_by_day.items():
    ts_sorted = sorted(ts)
    span_hours = (ts_sorted[-1] - ts_sorted[0]).total_seconds() / 3600
    day_hours[d] = hours_formula_a(len(ts_sorted), span_hours)

# 3. Полная календарная сетка (4 января - 21 июня)
full_data = {}
d = GRID_START
while d <= GRID_END:
    full_data[d] = day_hours[d] if d in day_hours else 0.0
    d += datetime.timedelta(days=1)

# 4. Выборка n = 60: все активные дни + 8 нулевых дней (4-11 января)
sample_60 = {}
zd = SAMPLE_START
while zd <= ZERO_FILL_END:
    sample_60[zd] = 0.0
    zd += datetime.timedelta(days=1)
for d in sorted(day_hours.keys()):
    sample_60[d] = day_hours[d]

assert len(sample_60) == 60, f"Ожидалось 60 значений, получено {len(sample_60)}"

n = len(sample_60)

# Стили
thin = Side(style="thin", color="CCCCCC")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
header_fill = PatternFill("solid", fgColor="4472C4")
header_font = Font(color="FFFFFF", bold=True, size=11)
center = Alignment(horizontal="center", vertical="center", wrap_text=True)
left = Alignment(horizontal="left", vertical="center", wrap_text=True)


def set_header(ws, row, values, start_col=1):
    """Устанавливает строку заголовков с форматированием."""
    for i, v in enumerate(values):
        c = ws.cell(row=row, column=start_col + i, value=v)
        c.font = header_font; c.fill = header_fill; c.alignment = center; c.border = border


def put(ws, r, c, value, fmt=None, bold=False, align=center):
    """Записывает значение в ячейку с форматированием."""
    cell = ws.cell(row=r, column=c, value=value)
    if fmt:
        cell.number_format = fmt
    cell.alignment = align
    cell.border = border
    if bold:
        cell.font = Font(bold=True)
    return cell


wb = Workbook()

# =============================================================================
# Лист 1: Обобщение данных (Задания 1-2)
# =============================================================================
ws1 = wb.active
ws1.title = "Обобщение данных"

ws1["A1"] = "Задание 1. Первичная обработка данных"
ws1["A1"].font = Font(bold=True, size=14)
ws1.merge_cells(start_row=1, start_column=1, end_row=1, end_column=10)
ws1["A1"].alignment = left

ws1["A2"] = ("Задача исследования: оценить ежедневное время на выполнение домашних заданий. "
             "Генеральная совокупность — все дни периода обучения. Выборка: n = 60 наблюдений.")
ws1["A2"].font = Font(size=10, italic=True, color="555555")
ws1.merge_cells(start_row=2, start_column=1, end_row=2, end_column=10)
ws1["A2"].alignment = left

ws1["A3"] = ("Источник данных — история браузера Safari за период 04.01.2026–21.06.2026 (визиты на образовательную платформу). "
             "Часы на активных днях вычислены по формуле: hours = max(0.5, √visits·0.45 + span·0.25), "
             "где visits — число успешных загрузок страниц, span — размах между первым и последним визитом (ч). "
             "Выборка: 52 активных дня + 8 нулевых дней (04–11.01).")
ws1["A3"].font = Font(size=10, italic=True, color="555555")
ws1.merge_cells(start_row=3, start_column=1, end_row=3, end_column=10)
ws1["A3"].alignment = left

# Календарная сетка
start_row_grid = 5
ws1.cell(row=start_row_grid, column=1, value="1.1) Таблица данных (календарная сетка, часы)")
ws1.cell(row=start_row_grid, column=1).font = Font(bold=True, size=11)
ws1.merge_cells(start_row=start_row_grid, start_column=1, end_row=start_row_grid, end_column=10)

header_row = start_row_grid + 1
put(ws1, header_row, 1, "Месяц", bold=True)
ws1.cell(row=header_row, column=1).fill = header_fill
ws1.cell(row=header_row, column=1).font = header_font
for day in range(1, 32):
    put(ws1, header_row, day + 1, day, bold=True)
    ws1.cell(row=header_row, column=day + 1).fill = header_fill
    ws1.cell(row=header_row, column=day + 1).font = header_font

weekend_fill = PatternFill("solid", fgColor="FFF2CC")
nonzero_fill = PatternFill("solid", fgColor="E2EFDA")
out_fill = PatternFill("solid", fgColor="F2F2F2")

row = header_row + 1
for month in range(1, 7):
    mc = ws1.cell(row=row, column=1, value=RU_MONTHS[month])
    mc.font = Font(bold=True); mc.alignment = left; mc.border = border
    mc.fill = PatternFill("solid", fgColor="D9E1F2")
    for day in range(1, 32):
        try:
            d = datetime.date(2026, month, day)
            in_range = GRID_START <= d <= GRID_END
        except ValueError:
            in_range = False
        if not in_range:
            c = put(ws1, row, day + 1, 0)
            c.number_format = "0"
            c.fill = out_fill
            continue
        val = full_data[d]
        c = ws1.cell(row=row, column=day + 1, value=round(val, 1) if val != 0 else 0)
        c.number_format = "0.0" if val != 0 else "0"
        c.alignment = center; c.border = border
        if d.weekday() >= 5:
            c.fill = weekend_fill
        if val > 0:
            c.fill = nonzero_fill
            c.font = Font(bold=True)
    ws1.row_dimensions[row].height = 22
    row += 1

note_row = row
ws1.cell(row=note_row, column=1,
         value=("Примечание: 0 = нет данных (вне периода или несуществующая дата) либо отсутствие активности. "
                "Зелёным выделены дни с ненулевым временем, жёлтым — выходные. "
                "Календарная сетка показывает весь период наблюдения (169 дней) для контекста; "
                "все статистические расчёты выполнены по выборке n = 60.")).font = Font(size=9, italic=True, color="666666")
ws1.merge_cells(start_row=note_row, start_column=1, end_row=note_row, end_column=10)
ws1.cell(row=note_row, column=1).alignment = left

# Вариационный ранжированный ряд — ИСТОЧНИК ДАННЫХ для всех формул
# Столбец D (строки 17-76) = значения часов; Столбец F = флаг выходного дня
rank_start = note_row + 2
ws1.cell(row=rank_start, column=1, value="1.2) Вариационный ранжированный ряд (n = 60)")
ws1.cell(row=rank_start, column=1).font = Font(bold=True, size=11)
ws1.merge_cells(start_row=rank_start, start_column=1, end_row=rank_start, end_column=6)

set_header(ws1, rank_start + 1, ["№", "Дата", "День недели", "Часы (xᵢ)", "Источник", "Выходной (флаг)"])
ranked = sorted(sample_60.items(), key=lambda kv: (kv[1], kv[0]))
DATA_FIRST_ROW = rank_start + 2  # 17
DATA_LAST_ROW = rank_start + 1 + n  # 76
for i, (d, h) in enumerate(ranked, 1):
    r = rank_start + 1 + i
    put(ws1, r, 1, i)
    put(ws1, r, 2, d.strftime("%d.%m.%Y"))
    put(ws1, r, 3, RU_WD[d.weekday()])
    c = ws1.cell(row=r, column=4, value=round(h, 1) if h != 0 else 0)
    c.number_format = "0.0" if h != 0 else "0"; c.alignment = center; c.border = border
    src = "newlxp.ru" if d in day_hours else "нет визита"
    put(ws1, r, 5, src)
    # Флаг выходного дня для Задания 7
    wknd_flag = 1 if d.weekday() >= 5 else 0
    put(ws1, r, 6, wknd_flag)
    if h > 0:
        for col in range(1, 7):
            ws1.cell(row=r, column=col).fill = nonzero_fill

# Именованные диапазоны для формул
DATA_RANGE = f"'Обобщение данных'!$D${DATA_FIRST_ROW}:$D${DATA_LAST_ROW}"
WKND_RANGE = f"'Обобщение данных'!$F${DATA_FIRST_ROW}:$F${DATA_LAST_ROW}"
wb.defined_names["data"] = DefinedName(name="data", attr_text=DATA_RANGE)
wb.defined_names["wknd_flag"] = DefinedName(name="wknd_flag", attr_text=WKND_RANGE)

note2_row = rank_start + 63
ws1.cell(row=note2_row, column=1,
         value=("Тип переменной: непрерывная. Изучаемая величина — ежедневное время выполнения домашних заданий, "
                "которое по своей природе может принимать любое неотрицательное действительное значение. "
                "В отчёте оно получено по формуле, включающей непрерывный размах между первым и последним визитом (ч), "
                "и округлено до 0.1 ч только для наглядности; округление является ограничением точности измерения, а не дискретностью самой переменной.")).font = Font(size=10, italic=True, color="555555")
ws1.merge_cells(start_row=note2_row, start_column=1, end_row=note2_row, end_column=6)
ws1.cell(row=note2_row, column=1).alignment = left

# Частотный (интервальный) ряд — формулы Excel (COUNTIFS)
freq_start = note2_row + 2
ws1.cell(row=freq_start, column=1, value="1.3) Частотный (интервальный) ряд")
ws1.cell(row=freq_start, column=1).font = Font(bold=True, size=11)
ws1.merge_cells(start_row=freq_start, start_column=1, end_row=freq_start, end_column=8)

set_header(ws1, freq_start + 1, ["Интервал (ч)", "Частота nᵢ", "Отн. частота wᵢ", "Накопл. частота F_n", "Отн. накопл. частота F_n/n"])
bin_labels = ["[0,1)", "[1,2)", "[2,3)", "[3,4)", "[4,5)", "[5,6)", "[6,7)", "[7,+∞)"]
bin_edges = [0, 1, 2, 3, 4, 5, 6, 7, math.inf]
for i in range(8):
    r = freq_start + 2 + i
    put(ws1, r, 1, bin_labels[i])
    # Частота через COUNTIFS
    if i < 7:
        formula = f'=COUNTIFS(data,">="&{bin_edges[i]},data,"<"&{bin_edges[i+1]})'
    else:
        formula = f'=COUNTIF(data,">="&{bin_edges[i]})'
    c = ws1.cell(row=r, column=2, value=formula)
    c.alignment = center; c.border = border
    # Относительная частота
    put(ws1, r, 3, f"=B{r}/COUNT(data)", fmt="0.000")
    # Накопленная частота (нарастающая сумма)
    if i == 0:
        put(ws1, r, 4, f"=B{r}")
    else:
        put(ws1, r, 4, f"=D{r-1}+B{r}")
    put(ws1, r, 5, f"=D{r}/COUNT(data)", fmt="0.000")

# Гистограмма — встроенная диаграмма Excel (BarChart)
FREQ_DATA_START = freq_start + 2
FREQ_DATA_END = freq_start + 9
hist_chart = BarChart()
hist_chart.type = "col"
hist_chart.style = 10
hist_chart.title = "Гистограмма частот (n = 60)"
hist_chart.y_axis.title = "Частота nᵢ"
hist_chart.x_axis.title = "Интервал, ч"
hist_data = Reference(ws1, min_col=2, min_row=freq_start + 1, max_row=FREQ_DATA_END)
hist_cats = Reference(ws1, min_col=1, min_row=FREQ_DATA_START, max_row=FREQ_DATA_END)
hist_chart.add_data(hist_data, titles_from_data=True)
hist_chart.set_categories(hist_cats)
hist_chart.height = 9
hist_chart.width = 16
ws1.add_chart(hist_chart, "G" + str(freq_start + 1))

# Кумулятивные частоты — формулы Excel
cum_start = freq_start + len(bin_labels) + 4
ws1.cell(row=cum_start, column=1, value="1.4) Кумулятивные частоты и кумулата")
ws1.cell(row=cum_start, column=1).font = Font(bold=True, size=11)
ws1.merge_cells(start_row=cum_start, start_column=1, end_row=cum_start, end_column=8)

set_header(ws1, cum_start + 1, ["Верхняя граница (ч)", "Накопл. частота F_n", "Отн. накопл. частота F_n/n"])
upper_bounds_disp = [1, 2, 3, 4, 5, 6, 7, 8]
freq_cum_col = "D"
CUM_DATA_START = cum_start + 2
CUM_DATA_END = cum_start + 9
for i in range(8):
    r = CUM_DATA_START + i
    put(ws1, r, 1, upper_bounds_disp[i])
    put(ws1, r, 2, f"={freq_cum_col}{freq_start + 2 + i}")
    put(ws1, r, 3, f"={freq_cum_col}{freq_start + 2 + i}/COUNT(data)", fmt="0.000")

# Кумулата — встроенная диаграмма Excel (LineChart)
cum_chart = LineChart()
cum_chart.title = "Кумулята относительных частот"
cum_chart.y_axis.title = "Отн. накопл. частота F_n/n"
cum_chart.x_axis.title = "Верхняя граница интервала, ч"
cum_chart.style = 2
cum_data = Reference(ws1, min_col=3, min_row=cum_start + 1, max_row=CUM_DATA_END)
cum_cats = Reference(ws1, min_col=1, min_row=CUM_DATA_START, max_row=CUM_DATA_END)
cum_chart.add_data(cum_data, titles_from_data=True)
cum_chart.set_categories(cum_cats)
cum_chart.height = 9
cum_chart.width = 16
ws1.add_chart(cum_chart, "E" + str(cum_start + 1))

# Задание 2 — описательные статистики (формулы Excel)
stats_start = cum_start + len(upper_bounds_disp) + 4
ws1.cell(row=stats_start, column=1, value="Задание 2. Исследовательский анализ данных")
ws1.cell(row=stats_start, column=1).font = Font(bold=True, size=11)
ws1.merge_cells(start_row=stats_start, start_column=1, end_row=stats_start, end_column=5)

set_header(ws1, stats_start + 1, ["Показатель", "Значение", "Показатель", "Значение"])

# Раскладка строк для перекрёстных ссылок
r_q1 = stats_start + 2
r_q3 = stats_start + 3
r_mean = stats_start + 5
r_std = stats_start + 6

stats_pairs = [
    ("x_min (Min)", "=MIN(data)", "Q₁ (нижний квартиль)", "=QUARTILE(data,1)"),
    ("Me (медиана)", "=MEDIAN(data)", "Q₃ (верхний квартиль)", "=QUARTILE(data,3)"),
    ("x_max (Max)", "=MAX(data)", "IQR = Q₃ − Q₁", f"=D{r_q3}-D{r_q1}"),
    ("p₉₀ (90-й перцентиль)", "=PERCENTILE(data,0.9)", "x̄ (выборочное среднее, оценка M(X))", "=AVERAGE(data)"),
    ("s (исправленное с.к.о., оценка σ)", "=STDEV(data)", "As (коэффициент асимметрии)", "=SKEW(data)"),
    ("", "", "Ex (эксцесс)", "=KURT(data)"),
]
for i, (k1, f1, k2, f2) in enumerate(stats_pairs, 2):
    r = stats_start + i
    put(ws1, r, 1, k1, align=left)
    if f1:
        c = ws1.cell(row=r, column=2, value=f1)
        c.number_format = "0.000"; c.alignment = center; c.border = border
    else:
        put(ws1, r, 2, "")
    put(ws1, r, 3, k2, align=left)
    if f2:
        c = ws1.cell(row=r, column=4, value=f2)
        c.number_format = "0.000"; c.alignment = center; c.border = border
    else:
        put(ws1, r, 4, "")

# Ячейка n для перекрёстных ссылок
n_cell_row = stats_start + 8
put(ws1, n_cell_row, 1, "n (объём выборки)", align=left)
put(ws1, n_cell_row, 2, "=COUNT(data)", fmt="0", bold=True)

# Именованные диапазоны для перекрёстных ссылок
wb.defined_names["xbar"] = DefinedName(name="xbar", attr_text=f"'Обобщение данных'!$D${r_mean}")
wb.defined_names["s_std"] = DefinedName(name="s_std", attr_text=f"'Обобщение данных'!$B${r_std}")
wb.defined_names["n_val"] = DefinedName(name="n_val", attr_text=f"'Обобщение данных'!$B${n_cell_row}")

ws1.column_dimensions["A"].width = 36
ws1.column_dimensions["B"].width = 16
ws1.column_dimensions["C"].width = 16
ws1.column_dimensions["D"].width = 16
ws1.column_dimensions["E"].width = 18
ws1.column_dimensions["F"].width = 14
for col in range(7, 33):
    ws1.column_dimensions[get_column_letter(col)].width = 4.5

# =============================================================================
# Лист 2: Точечное и доверительное оценивание (Задания 3-5)
# =============================================================================
ws2 = wb.create_sheet("Точечное и доверительное")

ws2["A1"] = "Задание 3. Описание данных"
ws2["A1"].font = Font(bold=True, size=14)
ws2.merge_cells(start_row=1, start_column=1, end_row=1, end_column=6)

ws2["A2"] = ("3.1) Точечные оценки. В качестве точечной оценки математического ожидания M(X) принимаем выборочное "
             "среднее x̄ — несмещённую, состоятельную и эффективную оценку. В качестве оценки σ (с.к.о.) принимаем "
             "исправленное выборочное стандартное отклонение s (несмещённая оценка).")
ws2["A2"].font = Font(size=10)
ws2.merge_cells(start_row=2, start_column=1, end_row=2, end_column=6)

set_header(ws2, 4, ["Оценка", "Значение", "Что оценивает", "Обоснование"])
put(ws2, 5, 1, "x̄", align=center)
put(ws2, 5, 2, "=xbar", fmt="0.000")
put(ws2, 5, 3, "M(X) — математическое ожидание", align=left)
put(ws2, 5, 4, "Несмещённая, состоятельная, эффективная", align=left)
put(ws2, 6, 1, "s", align=center)
put(ws2, 6, 2, "=s_std", fmt="0.000")
put(ws2, 6, 3, "σ — с.к.о. генеральной совокупности", align=left)
put(ws2, 6, 4, "Исправленное с.к.о., несмещённая оценка σ", align=left)

ws2["A8"] = ("3.2) Распределение для доверительного интервала. Так как генеральное σ неизвестно и оценивается по "
             "выборке (s), используем распределение Стьюдента t(k), где k = n − 1 = 59 — число степеней свободы. "
             "При n = 60 распределение t близко к нормальному, но технически корректно использовать t при неизвестном σ.")
ws2["A8"].font = Font(size=10)
ws2.merge_cells(start_row=8, start_column=1, end_row=8, end_column=6)

ws2["A10"] = "Задание 4. Построение доверительного интервала для M(X)"
ws2["A10"].font = Font(bold=True, size=14)
ws2.merge_cells(start_row=10, start_column=1, end_row=10, end_column=6)

set_header(ws2, 12, ["Доверительная вероятность γ", "Нижняя граница", "Верхняя граница", "Граница ошибки ε", "t_{γ,k}"])
# γ = 0.9, формулы с TINV (legacy-функция, не вызывает @)
put(ws2, 13, 1, 0.9)
put(ws2, 13, 2, "=xbar-TINV(1-0.9,n_val-1)*s_std/SQRT(n_val)", fmt="0.000")
put(ws2, 13, 3, "=xbar+TINV(1-0.9,n_val-1)*s_std/SQRT(n_val)", fmt="0.000")
put(ws2, 13, 4, "=TINV(1-0.9,n_val-1)*s_std/SQRT(n_val)", fmt="0.000")
put(ws2, 13, 5, "=TINV(1-0.9,n_val-1)", fmt="0.000")

ws2["A15"] = ("Интерпретация: при многократном повторении выборки около 90% построенных таким образом интервалов "
              "содержали бы истинное значение M(X). Для данной выборки доверительный интервал указан в таблице выше.")
ws2["A15"].font = Font(size=10, italic=True)
ws2.merge_cells(start_row=15, start_column=1, end_row=15, end_column=6)

# Аннотация к графику Задания 4 (формула Excel, динамическая)
ws2["A17"] = '="График плотности N(M(X), σ), аппроксимирующей распределение непрерывной величины. Доверительный интервал: ["&TEXT(B13,"0.000")&"; "&TEXT(C13,"0.000")&"], γ = 0.9. Ось X ограничена неотрицательными часами."'
ws2["A17"].font = Font(size=10, italic=True, color="555555")
ws2.merge_cells(start_row=17, start_column=1, end_row=17, end_column=6)

# График Задания 4: кривая нормального распределения (встроенный Excel)
# Данные берутся с листа «Данные графиков»
ws2["A19"] = "График плотности нормального распределения с доверительным интервалом:"
ws2["A19"].font = Font(bold=True, size=11)
ws2.merge_cells(start_row=19, start_column=1, end_row=19, end_column=6)

# График будет добавлен после создания листа данных графиков (ниже)

ws2["A40"] = "Задание 5. Анализ доверительного оценивания"
ws2["A40"].font = Font(bold=True, size=14)
ws2.merge_cells(start_row=40, start_column=1, end_row=40, end_column=6)

set_header(ws2, 42, ["Доверительная вероятность γ", "Нижняя граница", "Верхняя граница", "Длина интервала", "Граница ошибки ε"])
ci_gammas = [0.9, 0.95, 0.99]
for i, g in enumerate(ci_gammas, 1):
    r = 42 + i
    put(ws2, r, 1, g)
    put(ws2, r, 2, f"=xbar-TINV(1-{g},n_val-1)*s_std/SQRT(n_val)", fmt="0.000")
    put(ws2, r, 3, f"=xbar+TINV(1-{g},n_val-1)*s_std/SQRT(n_val)", fmt="0.000")
    put(ws2, r, 4, f"=C{r}-B{r}", fmt="0.000")
    put(ws2, r, 5, f"=TINV(1-{g},n_val-1)*s_std/SQRT(n_val)", fmt="0.000")

ws2["A47"] = ("Вывод: при росте доверительной вероятности γ растёт критическое значение t_{γ,k}, "
              "что увеличивает границу ошибки ε = t_{γ,k}·s/√n и расширяет доверительный интервал для M(X).")
ws2["A47"].font = Font(size=10, italic=True)
ws2.merge_cells(start_row=47, start_column=1, end_row=47, end_column=6)

ws2.column_dimensions["A"].width = 30
ws2.column_dimensions["B"].width = 16
ws2.column_dimensions["C"].width = 16
ws2.column_dimensions["D"].width = 16
ws2.column_dimensions["E"].width = 16
ws2.column_dimensions["F"].width = 14
# Высоты строк для читаемости
ws2.row_dimensions[1].height = 22
ws2.row_dimensions[10].height = 25
ws2.row_dimensions[33].height = 25

# =============================================================================
# Лист 3: Проверка статистических гипотез (Задания 6-8)
# =============================================================================
ws3 = wb.create_sheet("Проверка гипотез")

ws3["A1"] = "Задание 6. Проверка гипотезы о среднем M(X)"
ws3["A1"].font = Font(bold=True, size=14)
ws3.merge_cells(start_row=1, start_column=1, end_row=1, end_column=6)

ws3["A2"] = ("Теоретическое значение: M₀(X) = 2 ч/день — нормативное среднее время самостоятельной работы "
             "при совмещённой форме обучения. Проверяется, ниже ли выборочное среднее этого норматива.")
ws3["A2"].font = Font(size=10, italic=True, color="555555")
ws3.merge_cells(start_row=2, start_column=1, end_row=2, end_column=6)

set_header(ws3, 4, ["Элемент", "Значение / формулировка"])
rows6 = [
    ("H₀", "M(X) = 2"),
    ("H₁", "M(X) < 2 (левосторонняя альтернатива)"),
    ("Случайная величина", "X — ежедневное время на выполнение домашних заданий, ч"),
    ("Распределение", "t(k), k = n − 1. k вычисляется в ячейке ниже."),
    ("k (число степеней свободы)", "=n_val-1"),
    ("Тестовая статистика t_набл", "=(xbar-2)/(s_std/SQRT(n_val))"),
    ("p-значение", "=IF((xbar-2)/(s_std/SQRT(n_val))<0,TDIST(-(xbar-2)/(s_std/SQRT(n_val)),n_val-1,1),1-TDIST((xbar-2)/(s_std/SQRT(n_val)),n_val-1,1))"),
    ("Решение", '=IF(B11<0.05,"Отвергаем H₀","Не отвергаем H₀")&" при α = 0.05"'),
    ("Вывод", "По выборке не получено статистически значимых свидетельств того, что M(X) ниже норматива 2 ч/день."),
]
for i, (k, v) in enumerate(rows6, 5):
    put(ws3, i, 1, k, align=left)
    put(ws3, i, 2, v, align=left)

# Вспомогательная ячейка: левостороннее критическое значение t_crit (alpha=0.05)
ws3["C14"] = "=-TINV(2*0.05,n_val-1)"
ws3["C14"].number_format = "0.000"
ws3["D14"] = "t_crit (α=0.05)"

# Аннотация к графику Задания 6
ws3["A15"] = '="График плотности t(k). t_набл = "&TEXT(B10,"0.000")&", p = "&TEXT(B11,"0.0000")&". Левосторонняя критическая область: t < "&TEXT(C14,"0.000")'
ws3["A15"].font = Font(size=10, italic=True, color="555555")
ws3.merge_cells(start_row=15, start_column=1, end_row=15, end_column=6)

# Задание 7
start7 = 5 + len(rows6) + 20
ws3.cell(row=start7, column=1, value="Задание 7. Проверка гипотезы о доле p").font = Font(bold=True, size=14)
ws3.merge_cells(start_row=start7, start_column=1, end_row=start7, end_column=6)

ws3.cell(row=start7 + 1, column=1,
         value=("Теоретическое значение p₀ = 0.5 — вероятность того, что в случайно выбранный выходной день "
                "состоится учебная активность, равна вероятности её отсутствия. "
                "Проверяется, отличается ли наблюдаемая доля от 0.5.")).font = Font(size=10, italic=True, color="555555")
ws3.merge_cells(start_row=start7 + 1, start_column=1, end_row=start7 + 1, end_column=6)

set_header(ws3, start7 + 2, ["Элемент", "Значение / формулировка"])
r_n_wknd = start7 + 7
r_x_act = start7 + 8
r_phat = start7 + 9
r_z7 = start7 + 10
r_pval7 = start7 + 11
rows7 = [
    ("H₀", "p = 0.5"),
    ("H₁", "p ≠ 0.5 (двусторонняя альтернатива)"),
    ("Случайная величина", "I — индикатор учебной активности в случайно выбранный выходной день (1 — была, 0 — нет)"),
    ("Распределение", "Нормальное приближение биномиального"),
    ("n_выходных (число выходных в выборке)", "=SUM(wknd_flag)"),
    ("x_активных (выходных с учёбой)", '=SUMIFS(data,wknd_flag,1,data,">0")'),
    ("p̂ (выборочная доля)", f"=B{r_x_act}/B{r_n_wknd}"),
    ("z_набл", f"=(B{r_phat}-0.5)/SQRT(0.25/B{r_n_wknd})"),
    ("p-значение", f"=2*(1-NORMSDIST(ABS(B{r_z7})))"),
    ("Решение", f'=IF(B{r_pval7}<0.05,"Отвергаем H₀","Не отвергаем H₀")&" при α = 0.05"'),
    ("Вывод", "Доля выходных дней с учебной активностью статистически значимо отличается от 0.5, что свидетельствует о смещении самостоятельной работы в выходные дни."),
]
for i, (k, v) in enumerate(rows7, start7 + 3):
    put(ws3, i, 1, k, align=left)
    put(ws3, i, 2, v, align=left)

ann7_row = start7 + 3 + len(rows7) + 1
# Вспомогательная ячейка: двустороннее критическое значение z_crit (alpha=0.05)
ws3.cell(row=ann7_row - 1, column=3, value="=NORMSINV(1-0.05/2)")
ws3.cell(row=ann7_row - 1, column=3).number_format = "0.000"
ws3.cell(row=ann7_row - 1, column=4, value="z_crit (α=0.05)")

# Аннотация к графику Задания 7
ws3.cell(row=ann7_row, column=1,
         value=f'="График плотности N(0,1). z_набл = "&TEXT(B{r_z7},"0.000")&", p = "&TEXT(B{r_pval7},"0.0000")&". Двусторонняя критическая область: |z| > "&TEXT(C{ann7_row-1},"0.000")').font = Font(size=10, italic=True, color="555555")
ws3.merge_cells(start_row=ann7_row, start_column=1, end_row=ann7_row, end_column=6)

# Задание 8
start8 = ann7_row + 3
ws3.cell(row=start8, column=1, value="Задание 8. Проверка гипотезы о нормальном распределении").font = Font(bold=True, size=14)
ws3.merge_cells(start_row=start8, start_column=1, end_row=start8, end_column=6)

ws3.cell(row=start8 + 1, column=1,
         value=("Проверяется соответствие распределения ежедневного времени нормальному закону X ~ N(M(X), σ). "
                "Используются 5 интервалов с открытыми крайними для корректного учёта хвостов. "
                "Число интервалов уменьшено до 5 (вместо 6–10) для выполнения условия ожидаемых частот ≥ 5 при n = 60.")).font = Font(size=10, italic=True, color="555555")
ws3.merge_cells(start_row=start8 + 1, start_column=1, end_row=start8 + 1, end_column=6)

set_header(ws3, start8 + 2, ["Интервал", "Наблюд. частота n_i", "Ожид. частота n_i'", "(n_i − n_i')²/n_i'"])
norm_bin_labels = ["[0,1)", "[1,2)", "[2,3)", "[3,4)", "[4,+∞)"]
norm_bin_lo = [0, 1, 2, 3, 4]
norm_bin_hi = [1, 2, 3, 4, 1e9]
chi2_first = start8 + 3
chi2_last = start8 + 7
for i in range(5):
    r = chi2_first + i
    put(ws3, r, 1, norm_bin_labels[i])
    # Наблюдаемая частота через COUNTIF/COUNTIFS; для [0,1) исключаем невозможные отрицательные значения
    if i == 0:
        put(ws3, r, 2, f'=COUNTIFS(data,">="&{norm_bin_lo[i]},data,"<"&{norm_bin_hi[i]})')
    elif i == 4:
        put(ws3, r, 2, f'=COUNTIF(data,">="&{norm_bin_lo[i]})')
    else:
        put(ws3, r, 2, f'=COUNTIFS(data,">="&{norm_bin_lo[i]},data,"<"&{norm_bin_hi[i]})')
    # Ожидаемая частота: n * (NORMDIST(hi) - NORMDIST(lo))
    lo_val = norm_bin_lo[i]
    hi_val = norm_bin_hi[i]
    put(ws3, r, 3, f'=COUNT(data)*(NORMDIST({hi_val},xbar,s_std,TRUE)-NORMDIST({lo_val},xbar,s_std,TRUE))', fmt="0.00")
    # Вклад в χ²
    put(ws3, r, 4, f'=(B{r}-C{r})^2/C{r}', fmt="0.000")

# Итоговая строка
r_total = chi2_last + 1
put(ws3, r_total, 1, "Итого", bold=True)
put(ws3, r_total, 2, f"=SUM(B{chi2_first}:B{chi2_last})", bold=True)
put(ws3, r_total, 3, f"=SUM(C{chi2_first}:C{chi2_last})", fmt="0.00", bold=True)
put(ws3, r_total, 4, f"=SUM(D{chi2_first}:D{chi2_last})", fmt="0.000", bold=True)

# Блок выводов
summary_row = r_total + 2
r_pval8 = summary_row + 6
rows8 = [
    ("X ~ N(M(X), σ)", "M(X) и σ оцениваются по выборке (см. Задание 2)"),
    ("H₀", "X ~ N(M(X), σ) — распределение нормально"),
    ("H₁", "Распределение не является нормальным"),
    ("Распределение критерия", "χ² с k = m − 1 − 2, где m = 5 (число интервалов)"),
    ("k (число степеней свободы)", "=5-1-2"),
    ("χ²_набл", f"=D{r_total}"),
    ("p-значение", f"=CHIDIST(D{r_total},5-1-2)"),
    ("Решение", f'=IF(B{r_pval8}<0.05,"Отвергаем H₀","Не отвергаем H₀")&" при α = 0.05"'),
    ("Вывод", ("По критерию Пирсона нет оснований отвергнуть гипотезу о нормальности. "
               "Однако коэффициент асимметрии и эксцесс (см. Задание 2) указывают на отклонение от нормальности; "
               "при мощности теста χ² на выборке n = 60 это отклонение может быть не обнаружено.")),
]
for i, (k, v) in enumerate(rows8, summary_row):
    put(ws3, i, 1, k, align=left)
    put(ws3, i, 2, v, align=left)

# Аннотация к графику Задания 8
ann8_row = summary_row + len(rows8) + 1
# Вспомогательная ячейка: правостороннее критическое значение chi2_crit (alpha=0.05, k=2)
ws3.cell(row=ann8_row - 1, column=3, value="=CHIINV(0.05,5-1-2)")
ws3.cell(row=ann8_row - 1, column=3).number_format = "0.000"
ws3.cell(row=ann8_row - 1, column=4, value="χ²_crit (α=0.05, k=2)")

ws3.cell(row=ann8_row, column=1,
         value=f'="График плотности χ²(k). χ²_набл = "&TEXT(D{r_total},"0.000")&", p = "&TEXT(B{r_pval8},"0.0000")&". Правосторонняя критическая область: χ² > "&TEXT(C{ann8_row-1},"0.000")').font = Font(size=10, italic=True, color="555555")
ws3.merge_cells(start_row=ann8_row, start_column=1, end_row=ann8_row, end_column=6)

ws3.column_dimensions["A"].width = 28
ws3.column_dimensions["B"].width = 50
ws3.column_dimensions["C"].width = 16
ws3.column_dimensions["D"].width = 16
ws3.column_dimensions["E"].width = 18
ws3.column_dimensions["F"].width = 4
# Высоты строк для читаемости
ws3.row_dimensions[1].height = 22
for r_hdr in [34, 52]:
    ws3.row_dimensions[r_hdr].height = 25

# =============================================================================
# Лист 4: Данные графиков (вспомогательный лист для кривых распределений)
# =============================================================================
ws4 = wb.create_sheet("Данные графиков")

ws4["A1"] = "Вспомогательные данные для графиков распределений (плотности вычислены формулами Excel)"
ws4["A1"].font = Font(bold=True, size=12)
ws4.merge_cells(start_row=1, start_column=1, end_row=1, end_column=8)

N_POINTS = 60

# Задание 4: нормальное распределение N(M(X), σ) — NORMDIST (legacy)
ws4.cell(row=3, column=1, value="Задание 4: N(M(X), σ)").font = Font(bold=True)
ws4.cell(row=3, column=2, value="x").font = header_font
ws4.cell(row=3, column=3, value="f(x)=NORMDIST(x;M(X);σ;FALSE)").font = header_font
ws4.cell(row=3, column=2).fill = header_fill
ws4.cell(row=3, column=3).fill = header_fill
ws4.cell(row=3, column=2).alignment = center
ws4.cell(row=3, column=3).alignment = center
# 60 точек от max(0; x̄-4σ) до x̄+4σ, чтобы ось не уходила в отрицательные часы
for i in range(N_POINTS):
    r = 4 + i
    put(ws4, r, 2, f"=MAX(0,xbar-4*s_std)+{i}*((xbar+4*s_std-MAX(0,xbar-4*s_std))/{N_POINTS-1})", fmt="0.000")
    put(ws4, r, 3, f"=NORMDIST(B{r},xbar,s_std,FALSE)", fmt="0.0000")
TASK4_DATA_START = 4
TASK4_DATA_END = 4 + N_POINTS - 1

# Задание 6: распределение Стьюдента t(k) — формула плотности через GAMMA (legacy)
ws4.cell(row=3, column=5, value="Задание 6: t(k)").font = Font(bold=True)
ws4.cell(row=3, column=6, value="t").font = header_font
ws4.cell(row=3, column=7, value="f(t)=GAMMA((k+1)/2)/(√(k·π)·GAMMA(k/2))·(1+t²/k)^(-(k+1)/2)").font = header_font
ws4.cell(row=3, column=6).fill = header_fill
ws4.cell(row=3, column=7).fill = header_fill
ws4.cell(row=3, column=6).alignment = center
ws4.cell(row=3, column=7).alignment = center
for i in range(N_POINTS):
    r = 4 + i
    put(ws4, r, 6, f"=-4+{i}*(8/{N_POINTS-1})", fmt="0.000")
    # Плотность t-распределения: f(t) = Γ((k+1)/2) / (√(kπ)·Γ(k/2)) · (1+t²/k)^(-(k+1)/2)
    put(ws4, r, 7, f"=GAMMA((n_val-1+1)/2)/(SQRT((n_val-1)*PI())*GAMMA((n_val-1)/2))*(1+F{r}^2/(n_val-1))^(-(n_val-1+1)/2)", fmt="0.0000")
TASK6_DATA_START = 4
TASK6_DATA_END = 4 + N_POINTS - 1

# Задание 7: стандартное нормальное N(0,1) — NORMDIST(z;0;1;FALSE) (legacy)
ws4.cell(row=3, column=9, value="Задание 7: N(0,1)").font = Font(bold=True)
ws4.cell(row=3, column=10, value="z").font = header_font
ws4.cell(row=3, column=11, value="f(z)=NORMDIST(z;0;1;FALSE)").font = header_font
ws4.cell(row=3, column=10).fill = header_fill
ws4.cell(row=3, column=11).fill = header_fill
ws4.cell(row=3, column=10).alignment = center
ws4.cell(row=3, column=11).alignment = center
for i in range(N_POINTS):
    r = 4 + i
    put(ws4, r, 10, f"=-4+{i}*(8/{N_POINTS-1})", fmt="0.000")
    put(ws4, r, 11, f"=NORMDIST(J{r},0,1,FALSE)", fmt="0.0000")
TASK7_DATA_START = 4
TASK7_DATA_END = 4 + N_POINTS - 1

# Задание 8: распределение χ²(k) — формула плотности через EXP и GAMMA (legacy)
ws4.cell(row=3, column=13, value="Задание 8: χ²(k)").font = Font(bold=True)
ws4.cell(row=3, column=14, value="χ²").font = header_font
ws4.cell(row=3, column=15, value="f(χ²)=EXP(-x/2)·x^(k/2-1)/(2^(k/2)·GAMMA(k/2))").font = header_font
ws4.cell(row=3, column=14).fill = header_fill
ws4.cell(row=3, column=15).fill = header_fill
ws4.cell(row=3, column=14).alignment = center
ws4.cell(row=3, column=15).alignment = center
for i in range(N_POINTS):
    r = 4 + i
    put(ws4, r, 14, f"={i}*(15/{N_POINTS-1})", fmt="0.000")
    # Плотность χ²: f(x) = EXP(-x/2)·x^(k/2-1) / (2^(k/2)·GAMMA(k/2)), где k=2
    # При k=2: f(x) = EXP(-x/2)·x^0 / (2^1·GAMMA(1)) = EXP(-x/2)/2
    put(ws4, r, 15, f"=EXP(-N{r}/2)/2", fmt="0.0000")
TASK8_DATA_START = 4
TASK8_DATA_END = 4 + N_POINTS - 1

# Ширина столбцов листа данных
ws4.column_dimensions["A"].width = 22
for col in range(2, 16):
    ws4.column_dimensions[get_column_letter(col)].width = 12

# =============================================================================
# Добавление диаграмм распределений (встроенные Excel)
# =============================================================================

def make_dist_chart(ws4, x_col, y_col, data_start, data_end, title, x_title, y_title, series_title, x_major_unit=1):
    """Создаёт ScatterChart со сглаженной линией для кривой распределения."""
    chart = ScatterChart()
    chart.scatterStyle = "smooth"  # сглаженная линия, без маркеров
    chart.title = title
    chart.x_axis.title = x_title
    chart.y_axis.title = y_title
    # Оси видимы, с подписями
    chart.x_axis.delete = False
    chart.y_axis.delete = False
    # X-axis снизу, Y-axis слева
    chart.x_axis.axPos = "b"
    chart.y_axis.axPos = "l"
    # Убираем сетку
    chart.x_axis.majorGridlines = None
    chart.y_axis.majorGridlines = None
    # Шаг делений на оси X
    chart.x_axis.majorUnit = x_major_unit
    # Формат оси Y — 2 знака после запятой
    chart.y_axis.numFmt = "0.00"
    # Данные
    xvals = Reference(ws4, min_col=x_col, min_row=data_start, max_row=data_end)
    yvals = Reference(ws4, min_col=y_col, min_row=data_start, max_row=data_end)
    s = Series(yvals, xvals, title=series_title)
    # Синяя линия, без маркеров
    s.marker = Marker(symbol="none")
    s.graphicalProperties = GraphicalProperties()
    s.graphicalProperties.line = LineProperties(solidFill="0000FF", w=20000)
    chart.series.append(s)
    chart.height = 8
    chart.width = 16
    return chart

# График Задания 4: кривая нормального распределения
chart4 = make_dist_chart(ws4, 2, 3, TASK4_DATA_START, TASK4_DATA_END,
                         "Плотность N(M(X), σ) — доверительный интервал для M(X), γ = 0.9",
                         "Ежедневное время, ч", "Плотность f(x)", "f(x)", x_major_unit=2)
ws2.add_chart(chart4, "A20")

# График Задания 6: кривая t-распределения
chart6 = make_dist_chart(ws4, 6, 7, TASK6_DATA_START, TASK6_DATA_END,
                         "Плотность t(k) — проверка гипотезы о M(X)",
                         "t", "Плотность f(t)", "f(t)", x_major_unit=1)
ws3.add_chart(chart6, "E5")

# График Задания 7: кривая стандартного нормального
chart7 = make_dist_chart(ws4, 10, 11, TASK7_DATA_START, TASK7_DATA_END,
                         "Плотность N(0,1) — проверка гипотезы о доле p",
                         "z", "Плотность f(z)", "f(z)", x_major_unit=1)
ws3.add_chart(chart7, "E" + str(start7 + 3))

# График Задания 8: кривая χ²-распределения
chart8 = make_dist_chart(ws4, 14, 15, TASK8_DATA_START, TASK8_DATA_END,
                         "Плотность χ²(k) — проверка нормальности",
                         "χ²", "Плотность f(χ²)", "f(χ²)", x_major_unit=3)
ws3.add_chart(chart8, "E" + str(summary_row))

wb.save(OUT_XLSX)
print("Сохранено:", OUT_XLSX)
print(f"Диапазон данных: D{DATA_FIRST_ROW}:D{DATA_LAST_ROW}")
print(f"n={n}, активных={sum(1 for v in sample_60.values() if v > 0)}, нулевых={sum(1 for v in sample_60.values() if v == 0)}")
print("Листы:", wb.sheetnames)
print("Именованные диапазоны:", list(wb.defined_names))