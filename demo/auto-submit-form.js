/**
 * 在无头浏览器自动填写表单并提交
 */
const puppeteer = require('puppeteer');

const autoSubmitForm = async (url, path) => {

    // 启动浏览器
    const browser = await puppeteer.launch({
        // 关闭无头模式，方便我们看到这个无头浏览器执行的过程
        headless: false,
    });
    // 打开页面
    const page = await browser.newPage();
    // 设置浏览器视窗
    page.setViewport({
        width: 1376,
        height: 768,
    });
    // 地址栏输入网页地址
    await page.goto(url, {
        waitUntil: 'networkidle', // 等待网络状态为空闲的时候才继续执行
    });
    // await page.click('#lst-ib');
    await page.focus('#lst-ib');
    await page.type('辣子鸡', {
       delay: 1000, // 控制 keypress 也就是每个字母输入的间隔
    });
    await page.press('Enter');
    // 不关闭浏览器，看看效果
    // await browser.close();
};

module.exports = autoSubmitForm;


if (require.main === module) {
    // for test
    autoSubmitForm('http://google.com');
}
