/**
 * ==============================
 * 页面路径
 * ==============================
 */

const PAGE_PATH = {

    home: "pages/home.html",

    history: "pages/history.html",

    analysis: "pages/analysis.html",

    supplier_detail: "pages/supplier_detail.html",

    consumable_detail: "pages/consumable_detail.html",

    storeRent: "pages/store_rent.html",

    trendDetail: "pages/trend_detail.html"
};


/**
 * ==============================
 * 当前页面
 * ==============================
 */

let currentPage = "home";
let currentStore = getStoreFromURL();

function getStoreFromURL() {

    const params =

        new URLSearchParams(

            window.location.search

        );

    const store =

        params.get("store");

    if (store) {

        return store;

    }

    return "西乡店";

}

/**
 * ==============================
 * 全局图表
 *
 * 各页面自己的图表由：
 *
 * homeCharts
 * historyCharts
 * analysisCharts
 *
 * 分别管理
 *
 * app.js 这里只负责通知页面调整尺寸
 * ==============================
 */


/**
 * ==============================
 * DOM 快捷方法
 * ==============================
 */

const $app = (id) => {

    return document.getElementById(id);

};


/**
 * ==============================
 * 加载页面 HTML
 * ==============================
 */

async function loadPage(page) {

    const path =
        PAGE_PATH[page];


    if (!path) {

        return;

    }


    try {

        const response =
            await fetch(path);


        if (!response.ok) {

            throw new Error(
                "页面加载失败：" +
                response.status
            );

        }


        const html =
            await response.text();


        $app("pageContainer").innerHTML =
            html;


        currentPage =
            page;


        /**
         * ==============================
         * 更新底部导航
         * ==============================
         */

        document
            .querySelectorAll(".nav-item")
            .forEach(item => {

                item.classList.toggle(

                    "active",

                    item.dataset.page === page

                );

            });


        /**
         * ==============================
         * 初始化当前页面
         * ==============================
         */

        if (page === "home") {

            if (
                typeof initHomePage ===
                "function"
            ) {

                initHomePage();

            }

        }


        else if (page === "history") {

            if (
                typeof initHistoryPage ===
                "function"
            ) {

                initHistoryPage();

            }

        }


        else if (page === "analysis") {

            if (
                typeof initAnalysisPage ===
                "function"
            ) {

                initAnalysisPage();

            }

        }

        else if (page === "supplier_detail") {

            if (
                typeof initSupplierDetailPage ===
                "function"
            ) {

                initSupplierDetailPage();

            }

        }

        else if (page === "consumable_detail") {

            if (
                typeof initConsumableDetailPage ===
                "function"
            ) {

                initConsumableDetailPage();

            }

        }

        else if (page === "storeRent") {

            if (
                typeof initStoreRentPage ===
                "function"
            ) {

                initStoreRentPage();

            }

        }

         else if (page === "trendDetail") {

            if (
                typeof initTrendDetailPage ===
                "function"
            ) {

                initTrendDetailPage();

            }

        }


        /**
         * ==============================
         * 等页面进入 DOM 后
         * 再调整图表尺寸
         * ==============================
         */

        setTimeout(() => {

            resizeCharts();

        }, 50);


    } catch (error) {

        console.error(
            "页面加载失败：",
            error
        );


        $app("pageContainer").innerHTML = `

            <div class="page-error">

                <div class="page-error-icon">
                    ⚠️
                </div>

                <div class="page-error-title">
                    页面加载失败
                </div>

                <div class="page-error-message">
                    请检查页面文件是否存在
                </div>

            </div>

        `;

    }

}


/**
 * ==============================
 * 调整图表尺寸
 * ==============================
 */

function resizeCharts() {

    /**
     * 首页
     */

    if (
        typeof resizeHomeCharts ===
        "function"
    ) {

        resizeHomeCharts();

    }


    /**
     * 历史页面
     */

    if (
        typeof resizeHistoryCharts ===
        "function"
    ) {

        resizeHistoryCharts();

    }


    /**
     * 分析页面
     */

    if (
        typeof resizeAnalysisCharts ===
        "function"
    ) {

        resizeAnalysisCharts();

    }

    //店租详情页
    if (
        typeof resizeRentCharts ===
        "function"
    ) {

        resizeRentCharts();

    }

}


/**
 * ==============================
 * 初始化底部导航
 * ==============================
 */

function initNavigation() {

    document
        .querySelectorAll(".nav-item")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    const page =
                        btn.dataset.page;


                    /**
                     * 当前页面不重复加载
                     */

                    if (
                        page === currentPage
                    ) {

                        return;

                    }


                    loadPage(page);

                }
            );

        });

}


/**
 * ==============================
 * Toast
 * ==============================
 */

function showToast(message) {

    const toast =
        $app("toast");


    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.__toastTimer
    );


    window.__toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 1600);

}


/**
 * ==============================
 * 初始化
 * ==============================
 */

function init() {

    /**
     * 初始化底部导航
     */

    initNavigation();


    /**
     * 默认加载首页
     */

    loadPage("home");


    /**
     * ==============================
     * 刷新按钮
     * ==============================
     */

    const refreshBtn =
        $app("refreshBtn");


    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            () => {

                loadPage(
                    currentPage
                );


                showToast(
                    "数据已刷新"
                );

            }
        );

    }


    /**
     * ==============================
     * 浏览器窗口尺寸变化
     * ==============================
     */

    window.addEventListener(
        "resize",
        () => {

            resizeCharts();

        }
    );

}


/**
 * ==============================
 * DOM 加载完成
 * ==============================
 */

document.addEventListener(
    "DOMContentLoaded",
    init
);