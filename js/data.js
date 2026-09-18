/**
 * =========================================================
 * 数据管理
 * =========================================================
 *
 * TXT 文件目录：
 *
 * data/
 * ├── 西乡店/
 * │   ├── 2026-07.txt
 * │   └── 2026-08.txt
 * │
 * ├── 碧海湾店/
 * │   ├── 2026-07.txt
 * │   └── 2026-08.txt
 * │
 * └── ...
 *
 */


/**
 * 当前已经加载的数据
 */
let STORE_DATA = [];


/**
 * =========================================================
 * 获取 TXT 文件路径
 * =========================================================
 */
function getDataFilePath(store, month) {

    return `data/${store}/${month}.txt`;

}


/**
 * =========================================================
 * 读取 TXT 文件
 * =========================================================
 */
async function loadStoreData(store, month) {

    const path =
        getDataFilePath(
            store,
            month
        );


    console.log(
        "开始读取数据：",
        path
    );


    try {

        const response =
            await fetch(path);


        if (!response.ok) {

            throw new Error(
                `TXT 文件读取失败：${response.status}`
            );

        }


        const text =
            await response.text();


        console.log(
            "TXT 原始数据：",
            text
        );


        const record =
            parseStoreTxt(
                text,
                store,
                month
            );


        if (!record) {

            throw new Error(
                "TXT 数据解析失败"
            );

        }


        console.log(
            "解析后的数据：",
            record
        );


        return record;


    } catch (error) {

        console.error(
            "读取门店数据失败：",
            error
        );


        throw error;

    }

}


/**
 * =========================================================
 * 从 TXT 中读取某一项「本月」数据
 *
 * 例如：
 *
 * 总营业额(+)本月 1019173.38,上月...
 *
 * 获取：
 *
 * 1019173.38
 *
 * =========================================================
 */
function getCurrentValue(text, name) {

    const escapedName =
        name.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const regex =
        new RegExp(
            escapedName +
            "本月\\s*([-+]?\\d+(?:\\.\\d+)?)"
        );


    const match =
        text.match(regex);


    if (!match) {

        console.warn(
            "没有找到数据：",
            name
        );


        return 0;

    }


    return Number(
        match[1]
    );

}

/**
 * =========================================================
 * 解析供应商明细
 *
 * TXT 格式：
 *
 * 食材货佬款项
 * 豆腐供应商,5940.00
 * 广园丰食品,400.00
 * ...
 * 小计,272269.06
 *
 * 非食材货佬款项
 * 诚伟纸塑,3339.00
 * ...
 * 小计,24185.00
 * =========================================================
 */
function getSupplierDetails(text) {

    const result = {

        food: [],

        nonFood: []

    };


    /**
     * -----------------------------------------------------
     * 解析某一个供应商区域
     * -----------------------------------------------------
     */
    function parseSection(startTitle, endTitle) {

        const startIndex =
            text.indexOf(startTitle);


        if (startIndex === -1) {

            return [];

        }


        let endIndex =
            text.length;


        if (endTitle) {

            const tempIndex =
                text.indexOf(
                    endTitle,
                    startIndex + startTitle.length
                );


            if (tempIndex !== -1) {

                endIndex = tempIndex;

            }

        }


        const section =
            text.substring(
                startIndex + startTitle.length,
                endIndex
            );


        const lines =
            section.split(/\r?\n/);


        const list = [];


        lines.forEach(line => {

            line =
                line.trim();


            if (!line) {

                return;

            }


            const parts =
                line.split(",");


            if (parts.length < 2) {

                return;

            }


            const name =
                parts[0].trim();


            const amount =
                Number(
                    parts[1].trim()
                );


            if (!name) {

                return;

            }


            if (
                name === "小计" ||
                name === "总计"
            ) {

                return;

            }


            if (
                Number.isNaN(amount)
            ) {

                return;

            }


            list.push({

                name,

                amount

            });

        });


        return list;

    }


    /**
     * 食材供应商
     */
    result.food =
        parseSection(
            "食材货佬款项",
            "非食材货佬款项"
        );


    /**
     * 非食材供应商
     *
     * 注意：
     *
     * 这里不是「非食材耗材」，
     * 而是「非食材货佬款项」。
     */
    result.nonFood =
        parseSection(
            "非食材货佬款项",
            "下面是耗材的金额数据"
        );


    /**
     * -----------------------------------------------------
     * 计算合计
     * -----------------------------------------------------
     */

    result.foodTotal =
        result.food.reduce(
            (sum, item) =>
                sum + item.amount,
            0
        );


    result.nonFoodTotal =
        result.nonFood.reduce(
            (sum, item) =>
                sum + item.amount,
            0
        );


    result.total =
        result.foodTotal +
        result.nonFoodTotal;


    return result;

}


/**
 * =========================================================
 * 从 TXT 中读取货佬款项「小计」
 *
 * TXT 格式：
 *
 * 食材货佬款项
 * 豆腐供应商,5940.00
 * ...
 * 小计,272269.06
 *
 * 非食材货佬款项
 * 诚伟纸塑,3339.00
 * ...
 * 小计,24185.00
 *
 * =========================================================
 */
function getSupplierSubtotal(
    text,
    sectionName
) {

    /**
     * 找到对应的区块
     *
     * 例如：
     *
     * 食材货佬款项
     * ...
     * 小计,272269.06
     *
     * 截止到下一个：
     *
     * 非食材货佬款项
     *
     * 或：
     *
     * 耗材
     *
     * 或文本结束
     */

    const escapedSectionName =
        sectionName.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const regex =
        new RegExp(
            escapedSectionName +
            "[\\s\\S]*?小计\\s*,\\s*([-+]?\\d+(?:\\.\\d+)?)",
            "i"
        );


    const match =
        text.match(regex);


    if (!match) {

        console.warn(
            "没有找到货佬款项小计：",
            sectionName
        );


        return 0;

    }


    return Number(
        match[1]
    );

}

/**
 * =========================================================
 * 解析非食材耗材明细
 * =========================================================
 */
function getConsumableDetails(text) {

    const result = [];


    const startTitle =
        "下面是耗材的金额数据";


    const startIndex =
        text.indexOf(startTitle);


    if (startIndex === -1) {

        console.warn(
            "没有找到耗材数据"
        );

        return result;

    }


    const section =
        text.substring(
            startIndex + startTitle.length
        );


    const lines =
        section.split(/\r?\n/);


    lines.forEach(line => {

        line =
            line.trim();


        if (!line) {

            return;

        }


        const parts =
            line.split(",");


        /**
         * 格式：
         *
         * 名称,
         * 类型,
         * 日期,
         * 单号,
         * 金额
         */
        if (parts.length < 5) {

            return;

        }


        const name =
            parts[0].trim();


        const category =
            parts[1].trim();


        const date =
            parts[2].trim();


        const orderNo =
            parts[3].trim();


        const amount =
            Number(
                parts[4].trim()
            );


        if (!name) {

            return;

        }


        if (
            name === "总计"
        ) {

            return;

        }


        if (
            Number.isNaN(amount)
        ) {

            return;

        }


        result.push({

            name,

            category,

            date,

            orderNo,

            amount

        });

    });


    return result;

}

/**
 * =========================================================
 * 解析 TXT
 * =========================================================
 */
function parseStoreTxt(
    text,
    store,
    month
) {

    /**
     * -----------------------------------------------------
     * 基础经营数据
     * -----------------------------------------------------
     */

    const totalRevenue =
        getCurrentValue(
            text,
            "总营业额(+)"
        );


    const totalDiscount =
        getCurrentValue(
            text,
            "总优惠减免(-)"
        );


    const operatingIncome =
        getCurrentValue(
            text,
            "经营实收"
        );


    const totalFee =
        getCurrentValue(
            text,
            "总手续费/服务费(-)"
        );


    const hqExpense =
        getCurrentValue(
            text,
            "总公司运营支出(-)"
        );


    /**
     * -----------------------------------------------------
     * 固定支出
     * -----------------------------------------------------
     */

    const rent =
        getCurrentValue(
            text,
            "店铺租金"
        );


    const propertyFee =
        getCurrentValue(
            text,
            "物业服务费"
        );


    const waterElectricity =
        getCurrentValue(
            text,
            "店铺水电费"
        );


    const dormitoryRent =
        getCurrentValue(
            text,
            "宿舍房租"
        );


    const salary =
        getCurrentValue(
            text,
            "员工工资"
        );


    const socialSecurity =
        getCurrentValue(
            text,
            "员工社保"
        );


    /**
     * -----------------------------------------------------
     * 耗材
     * -----------------------------------------------------
     */

    const consumableExpense =
        getCurrentValue(
            text,
            "非食材 耗材 支出"
        );


    /**
     * -----------------------------------------------------
     * 货佬款项总额
     *
     * 例如：
     *
     * 货佬款项(-)本月 296454.09
     * -----------------------------------------------------
     */

    const supplierPayment =
        getCurrentValue(
            text,
            "货佬款项(-)"
        );

    const supplierDetails =
        getSupplierDetails(text);

    const consumableDetails =
    getConsumableDetails(text);


    /**
     * -----------------------------------------------------
     * 食材货佬款项
     *
     * 例如：
     *
     * 食材货佬款项
     * ...
     * 小计,272269.06
     * -----------------------------------------------------
     */

    const foodPayment =
        getSupplierSubtotal(
            text,
            "食材货佬款项"
        );


    /**
     * -----------------------------------------------------
     * 非食材货佬款项
     *
     * 例如：
     *
     * 非食材货佬款项
     * ...
     * 小计,24185.00
     * -----------------------------------------------------
     */

    const nonFoodPayment =
        getSupplierSubtotal(
            text,
            "非食材货佬款项"
        );


    /**
     * -----------------------------------------------------
     * 校验货佬款项
     *
     * 食材 + 非食材
     *
     * 应该等于：
     *
     * 货佬款项总额
     *
     * -----------------------------------------------------
     */

    const supplierPaymentDetail =
        foodPayment +
        nonFoodPayment;


    console.log(
        "========== 货佬款项解析 =========="
    );


    console.log(
        "食材货佬款项：",
        foodPayment
    );


    console.log(
        "非食材货佬款项：",
        nonFoodPayment
    );


    console.log(
        "货佬款项明细合计：",
        supplierPaymentDetail
    );


    console.log(
        "货佬款项总额：",
        supplierPayment
    );


    if (
        Math.abs(
            supplierPaymentDetail -
            supplierPayment
        ) > 0.01
    ) {

        console.warn(
            "⚠️ 货佬款项明细合计与总额不一致：",
            supplierPaymentDetail,
            supplierPayment
        );

    }


    /**
     * -----------------------------------------------------
     * 净利润
     * -----------------------------------------------------
     */

    const netProfit =
        getCurrentValue(
            text,
            "净利润"
        );


    /**
     * -----------------------------------------------------
     * 毛利率
     * -----------------------------------------------------
     */

    const grossMargin =
        getCurrentValue(
            text,
            "毛利率(仅食材)"
        );


    /**
     * -----------------------------------------------------
     * 净利率
     * -----------------------------------------------------
     */

    const netMargin =
        getCurrentValue(
            text,
            "净利率"
        );


    /**
     * -----------------------------------------------------
     * 营业收入
     *
     * 经营实收 - 总手续费
     *
     * -----------------------------------------------------
     */

    const revenue =
        operatingIncome -
        totalFee;


    /**
     * -----------------------------------------------------
     * 固定支出
     * -----------------------------------------------------
     */

    const fixedExpense =
        rent +
        propertyFee +
        waterElectricity +
        dormitoryRent +
        salary +
        socialSecurity;


    /**
     * -----------------------------------------------------
     * 返回统一数据结构
     * -----------------------------------------------------
     */

    return {

        store,

        month,


        /**
         * =================================================
         * 收入
         * =================================================
         */

        totalRevenue,

        totalDiscount,

        revenue,

        totalFee,

        operatingIncome,


        /**
         * =================================================
         * 会员
         * =================================================
         */

        memberRecharge:
            getCurrentValue(
                text,
                "会员充值(+)"
            ),


        memberConsumption:
            getCurrentValue(
                text,
                "会员消费(-)"
            ),


        /**
         * =================================================
         * 货佬款项
         * =================================================
         *
         * foodPayment
         *     食材货佬款项
         *
         * nonFoodPayment
         *     非食材货佬款项
         *
         * supplierPayment
         *     货佬款项总额
         *
         */

        foodPayment,

        nonFoodPayment,

        supplierPayment,
        
        //耗材明细
        consumableDetails,

    /**
     * 供应商明细
     */
        supplierDetails,

        /**
         * =================================================
         * 毛利
         * =================================================
         */

        grossProfit:
            operatingIncome -
            supplierPayment,

        grossMargin,


        /**
         * =================================================
         * 固定支出
         * =================================================
         */

        fixedExpense,

        rent,

        propertyFee,

        waterElectricity,

        dormitoryRent,

        salary,

        socialSecurity,


        /**
         * =================================================
         * 其他支出
         * =================================================
         *
         * 注意：
         *
         * 这里的耗材支出和非食材货佬款项
         * 是两个不同的数据。
         *
         */

        otherExpense:
            consumableExpense,


        consumableExpense,


        /**
         * =================================================
         * 总公司运营支出
         * =================================================
         */

        hqExpense,


        /**
         * =================================================
         * 净利润
         * =================================================
         */

        netProfit,

        netMargin

    };

}


/**
 * =========================================================
 * 获取门店历史月份
 *
 * 浏览器无法直接读取服务器目录，
 * 所以暂时手工维护可用月份。
 *
 * 后面可以改成 manifest.json。
 * =========================================================
 */

const STORE_MONTHS = {

    "西乡店": [
        "2026-08",
        "2026-07",
        "2026-06",
        "2026-06",
        "2026-04",
        "2026-03",
    ],
    "碧海湾店": [
        "2026-08",
        "2026-07",
        "2026-06",
        "2026-06",
        "2026-04",
        "2026-03",
    ],
    "沙井店": [
        "2026-08",
        "2026-07",
        "2026-06",
        "2026-06",
        "2026-04",
        "2026-03",
    ],
    "塘头店": [
        "2026-08",
        "2026-07",
        "2026-06",
        "2026-06",
        "2026-04",
        "2026-03",
    ],
    "石龙仔店": [
        "2026-08",
        "2026-07",
        "2026-06",
        "2026-06",
        "2026-04",
        "2026-03",
    ]
};


/**
 * =========================================================
 * 获取门店
 * =========================================================
 */

function getStores() {

    return Object.keys(
        STORE_MONTHS
    );

}


/**
 * =========================================================
 * 获取月份
 * =========================================================
 */

function getMonths(store) {

    return (
        STORE_MONTHS[store] || []
    )
    .slice()
    .sort()
    .reverse();

}


