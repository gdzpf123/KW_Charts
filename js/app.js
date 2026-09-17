let charts = {};
let currentStore = "西乡店";
let currentMonth = "2026-08";

const $ = (id) => document.getElementById(id);

function money(value) {
    return "¥" + Number(value || 0).toLocaleString("zh-CN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function wan(value) {
    const n = Number(value || 0) / 10000;
    return n.toFixed(n >= 100 ? 0 : 1) + "万";
}

function monthText(month) {
    const [y, m] = month.split("-");
    return `${y}年${Number(m)}月`;
}

function getStores() {
    return [...new Set(STORE_DATA.map(x => x.store))];
}

function getMonths(store = null) {
    return [...new Set(
        STORE_DATA
            .filter(x => !store || x.store === store)
            .map(x => x.month)
    )].sort().reverse();
}

function getRecord(store, month) {
    return STORE_DATA.find(x => x.store === store && x.month === month);
}

function getStoreRecords(store) {
    return STORE_DATA
        .filter(x => x.store === store)
        .sort((a, b) => a.month.localeCompare(b.month));
}

function initSelectors() {
    const storeSelect = $("storeSelect");
    storeSelect.innerHTML = getStores()
        .map(s => `<option value="${s}">${s}</option>`)
        .join("");

    storeSelect.value = currentStore;
    refreshMonthOptions();

    storeSelect.addEventListener("change", () => {
        currentStore = storeSelect.value;
        const months = getMonths(currentStore);
        currentMonth = months[0] || currentMonth;
        refreshMonthOptions();
        renderAll();
    });

    $("monthSelect").addEventListener("change", (e) => {
        currentMonth = e.target.value;
        renderAll();
    });
}

function refreshMonthOptions() {
    $("monthSelect").innerHTML = getMonths(currentStore)
        .map(m => `<option value="${m}">${monthText(m)}</option>`)
        .join("");

    $("monthSelect").value = currentMonth;
}

function renderSummary() {
    const record = getRecord(currentStore, currentMonth);

    if (!record) {
        $("summaryCards").innerHTML = `<div class="metric-card">暂无数据</div>`;
        return;
    }

    const prev = getPreviousRecord(currentStore, currentMonth);
    let changeHtml = "暂无上月数据";

    if (prev && prev.revenue) {
        const change = (record.revenue - prev.revenue) / prev.revenue * 100;
        const cls = change >= 0 ? "up" : "down";
        changeHtml = `<span class="${cls}">${change >= 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}%</span> 较上月`;
    }

    $("summaryCards").innerHTML = `
        <div class="metric-card primary">
            <div class="metric-label">营业收入</div>
            <div class="metric-value">${money(record.revenue)}</div>
            <div class="metric-extra">${changeHtml}</div>
        </div>

        <div class="metric-card">
            <div class="metric-label">毛利润</div>
            <div class="metric-value">${money(record.grossProfit)}</div>
            <div class="metric-extra">毛利率 ${record.grossMargin.toFixed(2)}%</div>
        </div>

        <div class="metric-card">
            <div class="metric-label">净利润</div>
            <div class="metric-value">${money(record.netProfit)}</div>
            <div class="metric-extra">${monthText(currentMonth)}</div>
        </div>
    `;
}

function getPreviousRecord(store, month) {
    return getStoreRecords(store)
        .filter(x => x.month < month)
        .sort((a, b) => b.month.localeCompare(a.month))[0];
}

function initChart(name, elementId) {
    const el = $(elementId);
    if (!charts[name]) {
        charts[name] = echarts.init(el);
    }
    return charts[name];
}

function renderRevenueTrend() {
    const records = getStoreRecords(currentStore).slice(-6);
    const chart = initChart("revenueTrend", "revenueTrend");

    chart.setOption({
        animationDuration: 500,
        grid: { left: 48, right: 18, top: 25, bottom: 30 },
        tooltip: {
            trigger: "axis",
            formatter: params => {
                const p = params[0];
                return `${monthText(p.axisValue)}<br/>营业收入：${money(p.value)}`;
            }
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: records.map(x => monthText(x.month)),
            axisLine: { lineStyle: { color: "#e5e8ec" } },
            axisLabel: { color: "#8a8f98", fontSize: 10 }
        },
        yAxis: {
            type: "value",
            axisLabel: {
                color: "#8a8f98",
                fontSize: 10,
                formatter: value => wan(value)
            },
            splitLine: { lineStyle: { color: "#f0f2f5" } }
        },
        series: [{
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 7,
            data: records.map(x => x.revenue),
            lineStyle: { width: 3, color: "#ef233c" },
            itemStyle: { color: "#ef233c" },
            areaStyle: { color: "rgba(239,35,60,.08)" }
        }]
    });
}

function renderStoreCompare() {
    const records = STORE_DATA
        .filter(x => x.month === currentMonth)
        .sort((a, b) => b.revenue - a.revenue);

    const chart = initChart("storeCompare", "storeCompare");

    chart.setOption({
        animationDuration: 500,
        grid: { left: 72, right: 22, top: 10, bottom: 20 },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: params => {
                const p = params[0];
                return `${p.name}<br/>营业收入：${money(p.value)}`;
            }
        },
        xAxis: {
            type: "value",
            axisLabel: {
                color: "#8a8f98",
                fontSize: 10,
                formatter: value => wan(value)
            },
            splitLine: { lineStyle: { color: "#f0f2f5" } }
        },
        yAxis: {
            type: "category",
            data: records.map(x => x.store),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: "#555b64", fontSize: 11 }
        },
        series: [{
            type: "bar",
            data: records.map(x => x.revenue),
            barMaxWidth: 18,
            itemStyle: {
                color: "#ef233c",
                borderRadius: [0, 6, 6, 0]
            },
            label: {
                show: true,
                position: "right",
                color: "#555b64",
                fontSize: 10,
                formatter: p => wan(p.value)
            }
        }]
    });
}

function renderComposition() {
    const r = getRecord(currentStore, currentMonth);
    const chart = initChart("composition", "composition");

    if (!r) return;

    const values = [
        { name: "经营成本", value: r.cost },
        { name: "固定支出", value: r.fixedExpense },
        { name: "其他支出", value: r.otherExpense },
        { name: "总部运营", value: r.hqExpense },
        { name: "净利润", value: Math.max(r.netProfit, 0) }
    ];

    chart.setOption({
        animationDuration: 500,
        tooltip: {
            trigger: "item",
            formatter: p => `${p.name}<br/>${money(p.value)}（${p.percent}%）`
        },
        legend: {
            bottom: 5,
            left: "center",
            textStyle: { color: "#666", fontSize: 10 }
        },
        series: [{
            type: "pie",
            radius: ["42%", "68%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 5, borderColor: "#fff", borderWidth: 2 },
            label: {
                formatter: "{b}\\n{d}%",
                fontSize: 10
            },
            data: values
        }]
    });
}

function renderHistory() {
    const records = [...STORE_DATA]
        .sort((a, b) => b.month.localeCompare(a.month) || a.store.localeCompare(b.store));

    $("historyList").innerHTML = records.map(r => `
        <div class="history-item">
            <div class="history-head">
                <div class="history-month">${monthText(r.month)}</div>
                <div class="history-store">${r.store}</div>
            </div>
            <div class="history-values">
                <div class="history-value">
                    <span>营业收入</span>
                    <strong>${money(r.revenue)}</strong>
                </div>
                <div class="history-value">
                    <span>毛利率</span>
                    <strong>${r.grossMargin.toFixed(2)}%</strong>
                </div>
                <div class="history-value">
                    <span>净利润</span>
                    <strong>${money(r.netProfit)}</strong>
                </div>
            </div>
        </div>
    `).join("");
}

function renderProfitTrend() {
    const records = getStoreRecords(currentStore).slice(-6);
    const chart = initChart("profitTrend", "profitTrend");

    chart.setOption({
        animationDuration: 500,
        grid: { left: 48, right: 18, top: 25, bottom: 30 },
        tooltip: {
            trigger: "axis",
            formatter: params => {
                const p = params[0];
                return `${p.axisValue}<br/>净利润：${money(p.value)}`;
            }
        },
        xAxis: {
            type: "category",
            data: records.map(x => monthText(x.month)),
            axisLine: { lineStyle: { color: "#e5e8ec" } },
            axisLabel: { color: "#8a8f98", fontSize: 10 }
        },
        yAxis: {
            type: "value",
            axisLabel: {
                color: "#8a8f98",
                fontSize: 10,
                formatter: value => wan(value)
            },
            splitLine: { lineStyle: { color: "#f0f2f5" } }
        },
        series: [{
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 7,
            data: records.map(x => x.netProfit),
            lineStyle: { width: 3, color: "#16a36a" },
            itemStyle: { color: "#16a36a" },
            areaStyle: { color: "rgba(22,163,106,.08)" }
        }]
    });
}

function renderMarginTrend() {
    const records = getStoreRecords(currentStore).slice(-6);
    const chart = initChart("marginTrend", "marginTrend");

    chart.setOption({
        animationDuration: 500,
        grid: { left: 45, right: 18, top: 25, bottom: 30 },
        tooltip: {
            trigger: "axis",
            formatter: params => {
                const p = params[0];
                return `${p.axisValue}<br/>毛利率：${Number(p.value).toFixed(2)}%`;
            }
        },
        xAxis: {
            type: "category",
            data: records.map(x => monthText(x.month)),
            axisLine: { lineStyle: { color: "#e5e8ec" } },
            axisLabel: { color: "#8a8f98", fontSize: 10 }
        },
        yAxis: {
            type: "value",
            min: 40,
            max: 70,
            axisLabel: {
                color: "#8a8f98",
                fontSize: 10,
                formatter: value => value + "%"
            },
            splitLine: { lineStyle: { color: "#f0f2f5" } }
        },
        series: [{
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 7,
            data: records.map(x => x.grossMargin),
            lineStyle: { width: 3, color: "#3478f6" },
            itemStyle: { color: "#3478f6" }
        }]
    });
}

function renderAnalysisMetrics() {
    const records = getStoreRecords(currentStore);
    if (!records.length) return;

    const latest = records[records.length - 1];
    const previous = records.length > 1 ? records[records.length - 2] : null;

    let revenueChange = "—";
    let profitChange = "—";

    if (previous) {
        revenueChange = ((latest.revenue - previous.revenue) / previous.revenue * 100).toFixed(1) + "%";
        profitChange = ((latest.netProfit - previous.netProfit) / previous.netProfit * 100).toFixed(1) + "%";
    }

    $("analysisMetrics").innerHTML = `
        <div class="analysis-box">
            <span>最新营业收入</span>
            <strong>${money(latest.revenue)}</strong>
        </div>
        <div class="analysis-box">
            <span>最新净利润</span>
            <strong>${money(latest.netProfit)}</strong>
        </div>
        <div class="analysis-box">
            <span>营收环比</span>
            <strong>${revenueChange}</strong>
        </div>
        <div class="analysis-box">
            <span>净利环比</span>
            <strong>${profitChange}</strong>
        </div>
    `;

    $("analysisSubtitle").textContent = `${currentStore} · ${monthText(latest.month)}`;
}

function renderAll() {
    renderSummary();
    renderRevenueTrend();
    renderStoreCompare();
    renderComposition();
    renderHistory();
    renderProfitTrend();
    renderMarginTrend();
    renderAnalysisMetrics();

    Object.values(charts).forEach(chart => chart.resize());
}

function initNavigation() {
    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;

            document.querySelectorAll(".nav-item")
                .forEach(x => x.classList.remove("active"));
            btn.classList.add("active");

            document.querySelectorAll(".page")
                .forEach(x => x.classList.remove("active"));
            $("page-" + page).classList.add("active");

            setTimeout(() => {
                Object.values(charts).forEach(chart => chart.resize());
            }, 50);
        });
    });
}

function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 1600);
}

function init() {
    initSelectors();
    initNavigation();
    renderAll();

    $("refreshBtn").addEventListener("click", () => {
        renderAll();
        showToast("数据已刷新");
    });

    window.addEventListener("resize", () => {
        Object.values(charts).forEach(chart => chart.resize());
    });
}

document.addEventListener("DOMContentLoaded", init);
