/**
 * 在无头浏览器中将一个网页保存为 pdf
 */
const puppeteer = require('puppeteer');

const savePdf = async (url, path) => {

    // 启动浏览器
    const browser = await puppeteer.launch();
    // 打开页面
    const page = await browser.newPage();
    // 设置浏览器视窗
    page.setViewport({
        width: 1376,
        height: 768,
    });
    // 地址栏输入网页地址
    await page.goto(url, {
        waitUntil: 'networkidle', // 等待网络状态为空闲的时候才执行保存
    });
    // 保存为 pdf: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
    await page.pdf({
        path,
        format: 'A4'
    });
    // 关闭浏览器
    await browser.close();
};

module.exports = savePdf;


if (require.main === module) {
    // for test
    savePdf('http://google.com', './google.pdf');
}
