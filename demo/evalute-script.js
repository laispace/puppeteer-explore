/**
 * 在无头浏览器中执行脚本
 */

const puppeteer = require('puppeteer');

const evaluteDimension = async (url) => {

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
    await page.goto(url);
    // 在宿主环境执行脚本: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageevaluatepagefunction-args

    // 获取视窗信息
    const dimensions = await page.evaluate(() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio
        };
    });
    console.log('视窗信息:', dimensions);

    // 获取 html
    // 获取上下文句柄
    const htmlHandle = await page.$('html');
    // 执行计算
    const html = await page.evaluate(body => body.outerHTML, htmlHandle);
    // 销毁句柄
    await htmlHandle.dispose();
    console.log('html:', html);

    const bodyInnerHTML = await page.$eval('body', dom => dom.innerHTML);
    console.log('bodyInnerHTML: ', bodyInnerHTML);


    // 关闭浏览器
    await browser.close();
};

module.exports = evaluteDimension;


if (require.main === module) {
    // for test
    evaluteDimension('http://google.com');
}
