/**
 * ==============================
 * 历史月结
 * ==============================
 */

function initHistoryPage() {

    renderHistory();

}


/**
 * ==============================
 * 金额格式化
 * ==============================
 */

function historyMoney(value) {

    return "¥" +
        Number(value || 0)
            .toLocaleString("zh-CN", {

                minimumFractionDigits: 0,

                maximumFractionDigits: 0

            });

}


/**
 * ==============================
 * 月份格式化
 * ==============================
 */

function historyMonthText(month) {

    const [y, m] =
        month.split("-");


    return `${y}年${Number(m)}月`;

}


/**
 * ==============================
 * 历史月结
 * ==============================
 */

function renderHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (!historyList) {

        return;

    }


    const records =
        [...STORE_DATA]
            .sort(
                (a, b) =>
                    b.month.localeCompare(
                        a.month
                    )
                    ||
                    a.store.localeCompare(
                        b.store
                    )
            );


    historyList.innerHTML =
        records
            .map(
                record => `

                    <div class="history-item">

                        <div class="history-head">

                            <div class="history-month">

                                ${historyMonthText(
                                    record.month
                                )}

                            </div>


                            <div class="history-store">

                                ${record.store}

                            </div>

                        </div>


                        <div class="history-values">

                            <div class="history-value">

                                <span>
                                    营业收入
                                </span>

                                <strong>
                                    ${historyMoney(
                                        record.revenue
                                    )}
                                </strong>

                            </div>


                            <div class="history-value">

                                <span>
                                    毛利率
                                </span>

                                <strong>
                                    ${Number(
                                        record.grossMargin || 0
                                    ).toFixed(2)}%
                                </strong>

                            </div>


                            <div class="history-value">

                                <span>
                                    净利润
                                </span>

                                <strong>
                                    ${historyMoney(
                                        record.netProfit
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>

                `
            )
            .join("");

}