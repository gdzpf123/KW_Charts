let charts = {};

let currentStore = "西乡店";

let currentMonth = "2026-08";


const $ = (id) => document.getElementById(id);


/**
 * 金额格式化
 */
function money(value) {

    return "¥" + Number(value || 0).toLocaleString("zh-CN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}


/**
 * 万元格式化
 */
function wan(value) {

    const n = Number(value || 0) / 10000;

    return n.toFixed(n >= 100 ? 0 : 1) + "万";
}


/**
 * 月份格式化
 */
function monthText(month) {

    const [y, m] = month.split("-");

    return `${y}年${Number(m)}月`;
}


/**
 * 获取门店
 */
function getStores() {

    return [...new Set(
        STORE_DATA.map(x => x.store)
    )];
}


/**
 * 获取月份
 */
function getMonths(store = null) {

    return [...new Set(
        STORE_DATA
            .filter(x => !store || x.store === store)
            .map(x => x.month)
    )].sort().reverse();
}


/**
 * 获取指定门店 / 月份的数据
 */
function getRecord(store, month) {

    return STORE_DATA.find(
        x => x.store === store && x.month === month
    );
}


/**
 * 获取指定门店所有月份数据
 */
function getStoreRecords(store) {

    return STORE_DATA
        .filter(x => x.store === store)
        .sort((a, b) => a.month.localeCompare(b.month));
}


/**
 * 初始化门店 / 月份选择器
 */
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


/**
 * 刷新月份选择
 */
function refreshMonthOptions() {

    $("monthSelect").innerHTML = getMonths(currentStore)
        .map(m => `<option value="${m}">${monthText(m)}</option>`)
        .join("");

    $("monthSelect").value = currentMonth;
}


/**
 * 初始化 Chart
 */
function initChart(name, elementId) {

    const el = $(elementId);

    if (!charts[name]) {

        charts[name] = echarts.init(el);
    }

    return charts[name];
}


/**
 * ==============================
 * 当月经营概览
 * ==============================
 */
function renderBusinessOverview() {

    const record = getRecord(
        currentStore,
        currentMonth
    );


    if (!record) {
        return;
    }


    // 收入

    $("totalRevenue").textContent =
        money(record.totalRevenue);

    $("totalDiscount").textContent =
        money(record.totalDiscount);

    $("revenue").textContent =
        money(record.revenue);

    $("totalFee").textContent =
        money(record.totalFee);

    $("operatingIncome").textContent =
        money(record.operatingIncome);


    // 货佬款项

    $("foodPayment").textContent =
        money(record.foodPayment);

    $("nonFoodPayment").textContent =
        money(record.nonFoodPayment);

    $("supplierPayment").textContent =
        money(record.supplierPayment);


    // 毛利

    $("grossProfit").textContent =
        money(record.grossProfit);

    $("grossMargin").textContent =
        Number(record.grossMargin || 0).toFixed(2) + "%";


    // 支出

    $("fixedExpense").textContent =
        money(record.fixedExpense);

    $("otherExpense").textContent =
        money(record.otherExpense);

    $("hqExpense").textContent =
        money(record.hqExpense);


    // 净利润

    $("netProfit").textContent =
        money(record.netProfit);

    $("netMargin").textContent =
        Number(record.netMargin || 0).toFixed(2) + "%";


    // 标题

    $("overviewSubtitle").textContent =
        `${currentStore} · ${monthText(currentMonth)}`;
}


/**
 * ==============================
 * 营业收入趋势
 * ==============================
 */
function renderRevenueTrend() {

    const records =
        getStoreRecords(currentStore).slice(-6);


    const chart =
        initChart(
            "revenueTrend",
            "revenueTrend"
        );


    chart.setOption({

        animationDuration: 500,

        grid: {
            left: 48,
            right: 18,
            top: 25,
            bottom: 30
        },

        tooltip: {

            trigger: "axis",

            formatter: params => {

                const p = params[0];

                return `${p.axisValue}<br/>营业收入：${money(p.value)}`;
            }
        },

        xAxis: {

            type: "category",

            boundaryGap: false,

            data:
                records.map(
                    x => monthText(x.month)
                ),

            axisLine: {

                lineStyle: {
                    color: "#e5e8ec"
                }
            },

            axisLabel: {

                color: "#8a8f98",

                fontSize: 10
            }
        },

        yAxis: {

            type: "value",

            axisLabel: {

                color: "#8a8f98",

                fontSize: 10,

                formatter:
                    value => wan(value)
            },

            splitLine: {

                lineStyle: {
                    color: "#f0f2f5"
                }
            }
        },

        series: [{

            type: "line",

            smooth: true,

            symbol: "circle",

            symbolSize: 7,

            data:
                records.map(
                    x => x.revenue
                ),

            lineStyle: {

                width: 3,

                color: "#ef233c"
            },

            itemStyle: {

                color: "#ef233c"
            },

            areaStyle: {

                color:
                    "rgba(239,35,60,.08)"
            }
        }]
    });
}


/**
 * ==============================
 * 供应商货款趋势
 * ==============================
 */
function renderSupplierPaymentTrend() {

    const records =
        getStoreRecords(currentStore).slice(-6);


    const chart =
        initChart(
            "supplierPaymentTrend",
            "supplierPaymentTrend"
        );


    chart.setOption({

        animationDuration: 500,

        grid: {

            left: 48,

            right: 18,

            top: 25,

            bottom: 30
        },

        tooltip: {

            trigger: "axis",

            formatter: params => {

                const p = params[0];

                return `${p.axisValue}<br/>货佬款项：${money(p.value)}`;
            }
        },

        xAxis: {

            type: "category",

            boundaryGap: false,

            data:
                records.map(
                    x => monthText(x.month)
                ),

            axisLine: {

                lineStyle: {
                    color: "#e5e8ec"
                }
            },

            axisLabel: {

                color: "#8a8f98",

                fontSize: 10
            }
        },

        yAxis: {

            type: "value",

            axisLabel: {

                color: "#8a8f98",

                fontSize: 10,

                formatter:
                    value => wan(value)
            },

            splitLine: {

                lineStyle: {
                    color: "#f0f2f5"
                }
            }
        },

        series: [{

            name: "货佬款项",

            type: "line",

            smooth: true,

            symbol: "circle",

            symbolSize: 7,

            data:
                records.map(
                    x => x.supplierPayment
                ),

            lineStyle: {

                width: 3,

                color: "#f59e0b"
            },

            itemStyle: {

                color: "#f59e0b"
            },

            areaStyle: {

                color:
                    "rgba(245,158,11,.08)"
            }
        }]
    });
}


/**
 * ==============================
 * 经营收入构成
 * ==============================
 */
function renderComposition() {

    const r =
        getRecord(
            currentStore,
            currentMonth
        );


    const chart =
        initChart(
            "composition",
            "composition"
        );


    if (!r) {
        return;
    }


    const values = [

        {
            name: "货佬款项",
            value: r.supplierPayment
        },

        {
            name: "固定支出",
            value: r.fixedExpense
        },

        {
            name: "其他支出",
            value: r.otherExpense
        },

        {
            name: "总部运营",
            value: r.hqExpense
        },

        {
            name: "净利润",
            value: Math.max(
                r.netProfit,
                0
            )
        }

    ];


    chart.setOption({

        animationDuration: 500,

        tooltip: {

            trigger: "item",

            formatter:
                p =>
                    `${p.name}<br/>${money(p.value)}（${p.percent}%）`
        },

        legend: {

            bottom: 5,

            left: "center",

            textStyle: {

                color: "#666",

                fontSize: 10
            }
        },

        series: [{

            type: "pie",

            radius: [
                "42%",
                "68%"
            ],

            center: [
                "50%",
                "45%"
            ],

            avoidLabelOverlap: true,

            itemStyle: {

                borderRadius: 5,

                borderColor: "#fff",

                borderWidth: 2
            },

            label: {

                formatter:
                    "{b}\\n{d}%",

                fontSize: 10
            },

            data: values
        }]
    });


    $("compositionSubtitle").textContent =
        `${currentStore} · ${monthText(currentMonth)}`;
}


/**
 * ==============================
 * 历史月结
 * ==============================
 */
function renderHistory() {

    const records =
        [...STORE_DATA]
            .sort(
                (a, b) =>
                    b.month.localeCompare(a.month)
                    ||
                    a.store.localeCompare(b.store)
            );


    $("historyList").innerHTML =
        records.map(r => `

            <div class="history-item">

                <div class="history-head">

                    <div class="history-month">
                        ${monthText(r.month)}
                    </div>

                    <div class="history-store">
                        ${r.store}
                    </div>

                </div>


                <div class="history-values">

                    <div class="history-value">

                        <span>
                            营业收入
                        </span>

                        <strong>
                            ${money(r.revenue)}
                        </strong>

                    </div>


                    <div class="history-value">

                        <span>
                            毛利率
                        </span>

                        <strong>
                            ${Number(r.grossMargin).toFixed(2)}%
                        </strong>

                    </div>


                    <div class="history-value">

                        <span>
                            净利润
                        </span>

                        <strong>
                            ${money(r.netProfit)}
                        </strong>

                    </div>

                </div>

            </div>

        `).join("");
}


/**
 * ==============================
 * 净利润趋势
 * ==============================
 */
function renderProfitTrend() {

    const records =
        getStoreRecords(currentStore).slice(-6);


    const chart =
        initChart(
            "profitTrend",
            "profitTrend"
        );


    chart.setOption({

        animationDuration: 500,

        grid: {

            left: 48,

            right: 18,

            top: 25,

            bottom: 30
        },

        tooltip: {

            trigger: "axis",

            formatter: params => {

                const p = params[0];

                return `${p.axisValue}<br/>净利润：${money(p.value)}`;
            }
        },

        xAxis: {

            type: "category",

            data:
                records.map(
                    x => monthText(x.month)
                ),

            axisLine: {

                lineStyle: {
                    color: "#e5e8ec"
                }
            },

            axisLabel: {

                color: "#8a8f98",

                fontSize: 10
            }
        },

        yAxis: {

            type: "value",

            axisLabel: {

                color: "#8a8f98",

                fontSize: 10,

                formatter:
                    value => wan(value)
            },

            splitLine: {

                lineStyle: {
                    color: "#f0f2f5"
                }
            }
        },

        series: [{

            type: "line",

            smooth: true,

            symbol: "circle",

            symbolSize: 7,

            data:
                records.map(
                    x => x.netProfit
                ),

            lineStyle: {

                width: 3,

                color: "#16a36a"
            },

            itemStyle: {

                color: "#16a36a"
            },

            areaStyle: {

                color:
                    "rgba(22,163,106,.08)"
            }
        }]
    });
}


/**
 * ==============================
 * 毛利率趋势
 * ==============================
 */
function renderMarginTrend() {

    const records =
        getStoreRecords(currentStore).slice(-6);


    const chart =
        initChart(
            "marginTrend",
            "marginTrend"
        );


    chart.setOption({

        animationDuration: 500,

        grid: {

            left: 45,

            right: 18,

            top: 25,

            bottom: 30
        },

        tooltip: {

            trigger: "axis",

            formatter: params => {

                const p = params[0];

                return `${p.axisValue}<br/>毛利率：${Number(p.value).toFixed(2)}%`;
            }
        },

        xAxis: {

            type: "category",

            data:
                records.map(
                    x => monthText(x.month)
                ),

            axisLine: {

                lineStyle: {
                    color: "#e5e8ec"
                }
            },

            axisLabel: {

                color: "#8a8f98",

                fontSize: 10
            }
        },

        yAxis: {

            type: "value",

            min: 40,

            max: 70,

            axisLabel: {

                color: "#8a8f98",

                fontSize: 10,

                formatter:
                    value => value + "%"
            },

            splitLine: {

                lineStyle: {
                    color: "#f0f2f5"
                }
            }
        },

        series: [{

            type: "line",

            smooth: true,

            symbol: "circle",

            symbolSize: 7,

            data:
                records.map(
                    x => x.grossMargin
                ),

            lineStyle: {

                width: 3,

                color: "#3478f6"
            },

            itemStyle: {

                color: "#3478f6"
            }
        }]
    });
}


/**
 * ==============================
 * 分析指标
 * ==============================
 */
function renderAnalysisMetrics() {

    const records =
        getStoreRecords(currentStore);


    if (!records.length) {
        return;
    }


    const latest =
        records[records.length - 1];


    const previous =
        records.length > 1
            ? records[records.length - 2]
            : null;


    let revenueChange = "—";

    let profitChange = "—";


    if (previous) {

        revenueChange =
            (
                (latest.revenue - previous.revenue)
                /
                previous.revenue
                *
                100
            ).toFixed(1)
            + "%";


        profitChange =
            (
                (latest.netProfit - previous.netProfit)
                /
                previous.netProfit
                *
                100
            ).toFixed(1)
            + "%";
    }


    $("analysisMetrics").innerHTML = `

        <div class="analysis-box">

            <span>
                最新营业收入
            </span>

            <strong>
                ${money(latest.revenue)}
            </strong>

        </div>


        <div class="analysis-box">

            <span>
                最新净利润
            </span>

            <strong>
                ${money(latest.netProfit)}
            </strong>

        </div>


        <div class="analysis-box">

            <span>
                营收环比
            </span>

            <strong>
                ${revenueChange}
            </strong>

        </div>


        <div class="analysis-box">

            <span>
                净利环比
            </span>

            <strong>
                ${profitChange}
            </strong>

        </div>

    `;


    $("analysisSubtitle").textContent =
        `${currentStore} · ${monthText(latest.month)}`;
}


/**
 * ==============================
 * 页面统一刷新
 * ==============================
 */
function renderAll() {

    renderBusinessOverview();

    renderRevenueTrend();

    renderSupplierPaymentTrend();

    renderComposition();

    renderHistory();

    renderProfitTrend();

    renderMarginTrend();

    renderAnalysisMetrics();


    Object.values(charts)
        .forEach(chart => chart.resize());
}


/**
 * ==============================
 * 底部导航
 * ==============================
 */
function initNavigation() {

    document
        .querySelectorAll(".nav-item")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const page =
                    btn.dataset.page;


                document
                    .querySelectorAll(".nav-item")
                    .forEach(x =>
                        x.classList.remove("active")
                    );


                btn.classList.add("active");


                document
                    .querySelectorAll(".page")
                    .forEach(x =>
                        x.classList.remove("active")
                    );


                $("page-" + page)
                    .classList.add("active");


                setTimeout(() => {

                    Object.values(charts)
                        .forEach(chart =>
                            chart.resize()
                        );

                }, 50);

            });

        });
}


/**
 * ==============================
 * Toast
 * ==============================
 */
function showToast(message) {

    const toast = $("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        window.__toastTimer
    );


    window.__toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 1600);
}


/**
 * ==============================
 * 初始化
 * ==============================
 */
function init() {

    initSelectors();

    initNavigation();

    renderAll();


    $("refreshBtn")
        .addEventListener("click", () => {

            renderAll();

            showToast("数据已刷新");

        });


    window.addEventListener(
        "resize",
        () => {

            Object.values(charts)
                .forEach(chart =>
                    chart.resize()
                );

        }
    );
}


document.addEventListener(
    "DOMContentLoaded",
    init
);