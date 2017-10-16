/**
 * 监听浏览器请求
 */
const puppeteer = require('puppeteer');

const onRequest = async (url) => {

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    // 监听请求
    page.on('request', (request) => {
        console.log('request', `${request.method}, ${request.url}`);
    });

    // 监听响应
    page.on('response', (response) => {
        console.log('response', `${response.status}, ${response.url}`);
    });

    await page.goto(url);

    await browser.close();
};

module.exports = onRequest;


if (require.main === module) {
    // for test
    onRequest('http://google.com');
}
