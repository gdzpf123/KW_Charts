/*
 * 月结数据文件
 *
 * 字段说明：
 *
 * totalRevenue       总营业额
 * totalDiscount      总优惠减免
 * revenue            营业收入
 * totalFee           总手续费
 * operatingIncome   经营实收
 *
 * foodPayment       食材货款
 * nonFoodPayment    非食材货款
 * supplierPayment   货佬款项合计
 *
 * grossProfit       毛利
 * grossMargin       毛利率
 *
 * fixedExpense      固定支出
 * otherExpense      其他支出
 * hqExpense         总公司运营支出
 *
 * netProfit         净利润
 * netMargin         净利率
 */


const STORE_DATA = [

    // ==============================
    // 西乡店
    // ==============================

    {
        store: "西乡店",
        month: "2026-08",

        totalRevenue: 800000,
        totalDiscount: 38893.88,
        revenue: 761106.12,
        totalFee: 20000,
        operatingIncome: 741106.12,

        foodPayment: 280000,
        nonFoodPayment: 32500,
        supplierPayment: 312500,

        grossProfit: 428606.12,
        grossMargin: 57.90,

        fixedExpense: 62000,
        otherExpense: 28000,
        hqExpense: 30000,

        netProfit: 308606.12,
        netMargin: 41.64
    },


    {
        store: "西乡店",
        month: "2026-07",

        totalRevenue: 740000,
        totalDiscount: 34800,
        revenue: 705200,
        totalFee: 18000,
        operatingIncome: 687200,

        foodPayment: 265000,
        nonFoodPayment: 31000,
        supplierPayment: 296000,

        grossProfit: 391200,
        grossMargin: 56.92,

        fixedExpense: 62000,
        otherExpense: 27000,
        hqExpense: 30000,

        netProfit: 272200,
        netMargin: 39.61
    },


    {
        store: "西乡店",
        month: "2026-06",

        totalRevenue: 720000,
        totalDiscount: 31500,
        revenue: 688500,
        totalFee: 18000,
        operatingIncome: 670500,

        foodPayment: 257000,
        nonFoodPayment: 30000,
        supplierPayment: 287000,

        grossProfit: 383500,
        grossMargin: 57.20,

        fixedExpense: 62000,
        otherExpense: 26000,
        hqExpense: 30000,

        netProfit: 265500,
        netMargin: 39.60
    },


    {
        store: "西乡店",
        month: "2026-05",

        totalRevenue: 675000,
        totalDiscount: 32700,
        revenue: 642300,
        totalFee: 17000,
        operatingIncome: 625300,

        foodPayment: 245000,
        nonFoodPayment: 30000,
        supplierPayment: 275000,

        grossProfit: 350300,
        grossMargin: 56.02,

        fixedExpense: 62000,
        otherExpense: 25000,
        hqExpense: 30000,

        netProfit: 233300,
        netMargin: 37.31
    },


    {
        store: "西乡店",
        month: "2026-04",

        totalRevenue: 650000,
        totalDiscount: 34200,
        revenue: 615800,
        totalFee: 16000,
        operatingIncome: 599800,

        foodPayment: 239000,
        nonFoodPayment: 30000,
        supplierPayment: 269000,

        grossProfit: 330800,
        grossMargin: 55.15,

        fixedExpense: 62000,
        otherExpense: 24000,
        hqExpense: 30000,

        netProfit: 214800,
        netMargin: 35.81
    },


    {
        store: "西乡店",
        month: "2026-03",

        totalRevenue: 630000,
        totalDiscount: 31400,
        revenue: 598600,
        totalFee: 15000,
        operatingIncome: 583600,

        foodPayment: 231000,
        nonFoodPayment: 30000,
        supplierPayment: 261000,

        grossProfit: 322600,
        grossMargin: 55.28,

        fixedExpense: 62000,
        otherExpense: 23000,
        hqExpense: 30000,

        netProfit: 207600,
        netMargin: 35.57
    },


    // ==============================
    // 塘头店
    // ==============================

    {
        store: "塘头店",
        month: "2026-08",

        totalRevenue: 610000,
        totalDiscount: 29800,
        revenue: 580200,
        totalFee: 15000,
        operatingIncome: 565200,

        foodPayment: 220000,
        nonFoodPayment: 30000,
        supplierPayment: 250000,

        grossProfit: 315200,
        grossMargin: 55.77,

        fixedExpense: 50000,
        otherExpense: 22000,
        hqExpense: 28000,

        netProfit: 215200,
        netMargin: 38.07
    },


    {
        store: "塘头店",
        month: "2026-07",

        totalRevenue: 580000,
        totalDiscount: 27200,
        revenue: 552800,
        totalFee: 14000,
        operatingIncome: 538800,

        foodPayment: 212000,
        nonFoodPayment: 30000,
        supplierPayment: 242000,

        grossProfit: 296800,
        grossMargin: 55.09,

        fixedExpense: 50000,
        otherExpense: 21000,
        hqExpense: 28000,

        netProfit: 197800,
        netMargin: 36.71
    },


    // ==============================
    // 石龙仔店
    // ==============================

    {
        store: "石龙仔店",
        month: "2026-08",

        totalRevenue: 680000,
        totalDiscount: 29700,
        revenue: 650300,
        totalFee: 16000,
        operatingIncome: 634300,

        foodPayment: 249000,
        nonFoodPayment: 30000,
        supplierPayment: 279000,

        grossProfit: 355300,
        grossMargin: 56.02,

        fixedExpense: 56000,
        otherExpense: 24000,
        hqExpense: 28000,

        netProfit: 247300,
        netMargin: 38.97
    },


    {
        store: "石龙仔店",
        month: "2026-07",

        totalRevenue: 650000,
        totalDiscount: 29900,
        revenue: 620100,
        totalFee: 15000,
        operatingIncome: 605100,

        foodPayment: 238000,
        nonFoodPayment: 30000,
        supplierPayment: 268000,

        grossProfit: 337100,
        grossMargin: 55.71,

        fixedExpense: 56000,
        otherExpense: 23000,
        hqExpense: 28000,

        netProfit: 230100,
        netMargin: 38.02
    },


    // ==============================
    // 沙井店
    // ==============================

    {
        store: "沙井店",
        month: "2026-08",

        totalRevenue: 545000,
        totalDiscount: 24400,
        revenue: 520600,
        totalFee: 14000,
        operatingIncome: 506600,

        foodPayment: 196000,
        nonFoodPayment: 30000,
        supplierPayment: 226000,

        grossProfit: 280600,
        grossMargin: 55.39,

        fixedExpense: 48000,
        otherExpense: 21000,
        hqExpense: 26000,

        netProfit: 185600,
        netMargin: 36.64
    },


    // ==============================
    // 碧海湾店
    // ==============================

    {
        store: "碧海湾店",
        month: "2026-08",

        totalRevenue: 730000,
        totalDiscount: 29500,
        revenue: 700500,
        totalFee: 17000,
        operatingIncome: 683500,

        foodPayment: 254000,
        nonFoodPayment: 30000,
        supplierPayment: 284000,

        grossProfit: 399500,
        grossMargin: 58.45,

        fixedExpense: 58000,
        otherExpense: 24000,
        hqExpense: 30000,

        netProfit: 287500,
        netMargin: 42.06
    },


    {
        store: "碧海湾店",
        month: "2026-07",

        totalRevenue: 700000,
        totalDiscount: 26800,
        revenue: 673200,
        totalFee: 16000,
        operatingIncome: 657200,

        foodPayment: 247000,
        nonFoodPayment: 30000,
        supplierPayment: 277000,

        grossProfit: 380200,
        grossMargin: 57.86,

        fixedExpense: 58000,
        otherExpense: 23000,
        hqExpense: 30000,

        netProfit: 269200,
        netMargin: 40.96
    },


    // ==============================
    // 桃源居店
    // ==============================

    {
        store: "桃源居店",
        month: "2026-08",

        totalRevenue: 505000,
        totalDiscount: 24200,
        revenue: 480800,
        totalFee: 13000,
        operatingIncome: 467800,

        foodPayment: 185000,
        nonFoodPayment: 30000,
        supplierPayment: 215000,

        grossProfit: 252800,
        grossMargin: 54.04,

        fixedExpense: 47000,
        otherExpense: 20000,
        hqExpense: 25000,

        netProfit: 160800,
        netMargin: 34.38
    }

];