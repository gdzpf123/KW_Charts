/**
 * =========================================================
 * 货佬款项详情页
 * =========================================================
 */


/**
 * =========================================================
 * 金额格式化
 * =========================================================
 */
function formatSupplierMoney(value) {

    const number =
        Number(value) || 0;


    return "¥" +
        number.toLocaleString(
            "zh-CN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/**
 * =========================================================
 * 创建供应商列表
 * =========================================================
 */
function renderSupplierList(
    containerId,
    list
) {

    const container =
        document.getElementById(
            containerId
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
                暂无供应商数据
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

                <div class="supplier-name">
                    ${escapeHtml(item.name)}
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


/**
 * =========================================================
 * 防止供应商名称包含 HTML
 * =========================================================
 */
function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/**
 * =========================================================
 * 初始化页面
 * =========================================================
 */
function initSupplierDetailPage() {

    console.log(
        "========== 货佬详情页初始化 =========="
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
     * 从已经加载的数据中查找
     */
    let record =
        null;


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


    const supplierDetails =
        record.supplierDetails;


    if (!supplierDetails) {

        console.error(
            "当前数据没有供应商详情"
        );

        return;

    }


    /**
     * 页面标题
     */
    const subtitle =
        document.getElementById(
            "supplierDetailSubtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            `${store} · ${month.replace("-", "年")}月`;

    }


    /**
     * 食材供应商
     */
    renderSupplierList(
        "foodSupplierList",
        supplierDetails.food
    );


    /**
     * 非食材供应商
     */
    renderSupplierList(
        "nonFoodSupplierList",
        supplierDetails.nonFood
    );


    /**
     * 食材合计
     */
    const foodTotal =
        document.getElementById(
            "foodSupplierTotal"
        );


    if (foodTotal) {

        foodTotal.textContent =
            formatSupplierMoney(
                supplierDetails.foodTotal
            );

    }


    /**
     * 非食材合计
     */
    const nonFoodTotal =
        document.getElementById(
            "nonFoodSupplierTotal"
        );


    if (nonFoodTotal) {

        nonFoodTotal.textContent =
            formatSupplierMoney(
                supplierDetails.nonFoodTotal
            );

    }


    /**
     * 明细合计
     */
    const detailTotal =
        supplierDetails.total;


    const totalElement =
        document.getElementById(
            "supplierDetailTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            formatSupplierMoney(
                detailTotal
            );

    }


    /**
     * 与经营数据中的货佬款项比较
     */
    const difference =
        Number(record.supplierPayment || 0) -
        Number(detailTotal || 0);


    const differenceElement =
        document.getElementById(
            "supplierDetailDifference"
        );


    if (differenceElement) {

        // if (
        //     Math.abs(difference) < 0.01
        // ) {

        //     differenceElement.textContent =
        //         "与经营数据中的货佬款项一致";

        // } else {

        //     differenceElement.textContent =
        //         `经营数据货佬款项 ${formatSupplierMoney(record.supplierPayment)}，明细合计 ${formatSupplierMoney(detailTotal)}，差额 ${formatSupplierMoney(Math.abs(difference))}`;

        // }

    }


    /**
     * 返回首页
     */
    const backButton =
        document.getElementById(
            "supplierBackBtn"
        );


    if (backButton) {

        backButton.onclick =
            function () {

                loadPage("home");

            };

    }

}