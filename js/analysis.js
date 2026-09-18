/**
 * ==============================
 * 经营分析
 * ==============================
 */

function initAnalysisPage() {

    renderProfitTrend();

    renderMarginTrend();

    renderAnalysisMetrics();

}


/**
 * ==============================
 * 公共方法
 * ==============================
 */

function analysisMoney(value) {

    return "¥" +
        Number(value || 0)
            .toLocaleString("zh-CN", {

                minimumFractionDigits: 0,

                maximumFractionDigits: 0

            });

}


function analysisWan(value) {

    const n =
        Number(value || 0) / 10000;


    return n.toFixed(
        n >= 100 ? 0 : 1
    ) + "万";

}


function analysisMonthText(month) {

    const [y, m] =
        month.split("-");


    return `${y}年${Number(m)}月`;

}


/**
 * ==============================
 * 获取当前门店
 * ==============================
 *
 * home.js 中的 currentStore
 * 需要提供给分析页面。
 *
 * ==============================
 */

function getAnalysisStore() {

    if (
        typeof currentStore !== "undefined"
    ) {

        return currentStore;

    }


    return "西乡店";

}


/**
 * ==============================
 * 获取门店数据
 * ==============================
 */

function getAnalysisRecords() {

    return STORE_DATA
        .filter(
            x =>
                x.store ===
                getAnalysisStore()
        )
        .sort(
            (a, b) =>
                a.month.localeCompare(
                    b.month
                )
        );

}


/**
 * ==============================
 * 净利润趋势
 * ==============================
 */

function renderProfitTrend() {

    const records =
        getAnalysisRecords()
            .slice(-6);


    const element =
        document.getElementById(
            "profitTrend"
        );


    if (!element) {

        return;

    }


    if (!window.charts) {

        window.charts = {};

    }


    if (!window.charts.profitTrend) {

        window.charts.profitTrend =
            echarts.init(element);

    }


    const chart =
        window.charts.profitTrend;


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

                const p =
                    params[0];

                return `${p.axisValue}<br/>净利润：${analysisMoney(p.value)}`;

            }

        },

        xAxis: {

            type: "category",

            data:
                records.map(
                    x =>
                        analysisMonthText(
                            x.month
                        )
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
                    value =>
                        analysisWan(value)

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
                    x =>
                        x.netProfit
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
        getAnalysisRecords()
            .slice(-6);


    const element =
        document.getElementById(
            "marginTrend"
        );


    if (!element) {

        return;

    }


    if (!window.charts) {

        window.charts = {};

    }


    if (!window.charts.marginTrend) {

        window.charts.marginTrend =
            echarts.init(element);

    }


    const chart =
        window.charts.marginTrend;


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

                const p =
                    params[0];

                return `${p.axisValue}<br/>毛利率：${Number(
                    p.value
                ).toFixed(2)}%`;

            }

        },

        xAxis: {

            type: "category",

            data:
                records.map(
                    x =>
                        analysisMonthText(
                            x.month
                        )
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
                    value =>
                        value + "%"

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
                    x =>
                        x.grossMargin
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
        getAnalysisRecords();


    const metrics =
        document.getElementById(
            "analysisMetrics"
        );


    if (
        !records.length
        || !metrics
    ) {

        return;

    }


    const latest =
        records[
            records.length - 1
        ];


    const previous =
        records.length > 1
            ? records[
                records.length - 2
            ]
            : null;


    let revenueChange = "—";

    let profitChange = "—";


    if (previous) {

        if (Number(previous.revenue) !== 0) {

            revenueChange =
                (
                    (
                        latest.revenue
                        -
                        previous.revenue
                    )
                    /
                    previous.revenue
                    *
                    100
                ).toFixed(1)
                + "%";

        }


        if (Number(previous.netProfit) !== 0) {

            profitChange =
                (
                    (
                        latest.netProfit
                        -
                        previous.netProfit
                    )
                    /
                    previous.netProfit
                    *
                    100
                ).toFixed(1)
                + "%";

        }

    }


    metrics.innerHTML = `

        <div class="analysis-box">

            <span>
                最新营业收入
            </span>

            <strong>
                ${analysisMoney(
                    latest.revenue
                )}
            </strong>

        </div>


        <div class="analysis-box">

            <span>
                最新净利润
            </span>

            <strong>
                ${analysisMoney(
                    latest.netProfit
                )}
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


    const subtitle =
        document.getElementById(
            "analysisSubtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            `${getAnalysisStore()} · ${analysisMonthText(
                latest.month
            )}`;

    }

}