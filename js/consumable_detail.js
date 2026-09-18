/**
 * =========================================================
 * 非食材耗材详情页
 * =========================================================
 */


/**
 * =========================================================
 * 初始化
 * =========================================================
 */
function initConsumableDetailPage() {

    console.log(
        "========== 非食材耗材详情页初始化 =========="
    );


    /**
     * 当前门店
     */
    const store =
        window.currentStore ||
        new URLSearchParams(
            window.location.search
        ).get("store") ||
        "西乡店";


    /**
     * 当前月份
     */
    const month =
        window.currentMonth ||
        new URLSearchParams(
            window.location.search
        ).get("month") ||
        getMonths(store)[0];


    console.log(
        "当前门店：",
        store
    );


    console.log(
        "当前月份：",
        month
    );


    /**
     * 从 STORE_DATA 查找数据
     */
    let record = null;


    if (
        Array.isArray(STORE_DATA)
    ) {

        record =
            STORE_DATA.find(
                item =>
                    item.store === store &&
                    item.month === month
            );

    }


    if (!record) {

        console.error(
            "没有找到当前门店月份数据：",
            store,
            month
        );

        return;

    }


    const details =
        record.consumableDetails || [];


    /**
     * 页面标题
     */
    const subtitle =
        document.getElementById(
            "consumableDetailSubtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            `${store} · ${month.replace("-", "年")}月`;

    }


    /**
     * 总额
     */
    const total =
        details.reduce(
            (sum, item) =>
                sum + Number(item.amount || 0),
            0
        );


    const totalElement =
        document.getElementById(
            "consumableDetailTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            formatSupplierMoney(total);

    }


    /**
     * 明细列表
     */
    renderConsumableList(
        details
    );


    /**
     * 返回首页
     */
    const backButton =
        document.getElementById(
            "consumableBackBtn"
        );


    if (backButton) {

        backButton.onclick =
            function () {

                loadPage("home");

            };

    }

}


/**
 * =========================================================
 * 渲染耗材列表
 * =========================================================
 */
function renderConsumableList(
    list
) {

    const container =
        document.getElementById(
            "consumableDetailList"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        !list ||
        list.length === 0
    ) {

        container.innerHTML = `

            <div class="supplier-empty">
                暂无耗材数据
            </div>

        `;

        return;

    }


    list.forEach(
        (item, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "supplier-row";


            row.innerHTML = `

                <div class="supplier-index">
                    ${index + 1}
                </div>

                <div
                    class="supplier-name"
                    style="display:flex;flex-direction:column;"
                >

                    <span>
                        ${escapeHtml(item.name)}
                    </span>

                    <span
                        style="
                            margin-top:3px;
                            color:#999;
                            font-size:11px;
                        "
                    >
                        ${escapeHtml(item.date)}
                    </span>

                </div>

                <div class="supplier-amount">
                    ${formatSupplierMoney(item.amount)}
                </div>

            `;


            container.appendChild(
                row
            );

        }
    );

}