/**
 * 在无头浏览器自动使用单页应用
 */
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone6 = devices['iPhone 6'];

const crawSpa = async url => {

    console.log('启动浏览器');
    const browser = await puppeteer.launch({
        // 关闭无头模式，方便我们看到这个无头浏览器执行的过程
        headless: false,
    });

    console.log('打开页面');
    const page = await browser.newPage();

    // 模拟 iPhone6
    await page.emulate(iPhone6);

    console.log('地址栏输入网页地址');
    await page.goto(url);

    console.log('等待页面准备好');
    // 这里判断地比较粗暴
    await page.waitForSelector('.foodentry');
    await page.waitForSelector('.shoplist');
    await page.waitForSelector('.search-wrapper .search');

    console.log('点击搜索框');
    await page.tap('.search-wrapper .search');

    await page.waitForSelector('input[type="search"]');

    // console.log('===为了看清楚，傲娇地等两秒===');
    await page.waitFor(2000);

    console.log('输入世界上最好吃的食物吧！');
    await page.type('麦当劳', {
        delay: 200, // 每个字母之间输入的间隔
    });

    console.log('回车开始搜索');
    // await page.press('Enter');
    await page.tap('button');
    
    console.log('等待搜素结果渲染出来');
    await page.waitForSelector('[class^="index-container"]');

    // console.log('===为了看清楚，傲娇地等两秒===');
    await page.waitFor(2000);

    console.log('找到搜索到的第一家外卖店！');
    await page.tap('[class^="index-container"]');

    // console.log('===为了看清楚，傲娇地等两秒===');
    await page.waitFor(2000);

    console.log('等待菜单渲染出来');
    await page.waitForSelector('[class^="fooddetails-food-panel"]');

    // console.log('===为了看清楚，傲娇地等两秒===');
    await page.waitFor(2000);

    console.log('直接选一个菜品吧');
    await page.tap('[class^="fooddetails-cart-button"]');

    // console.log('===为了看清楚，傲娇地等两秒===');
    await page.waitFor(2000);

    console.log('等待加入购物车成功');
    await page.waitForSelector('[class^="bottomNav-cartfooter"]');

    // console.log('===为了看清楚，傲娇地等两秒===');
    await page.waitFor(2000);

    console.log('点到了，把按钮变红以表高兴！');
    await page.evaluate(() => {
        document.querySelector('[class^="submit-btn-submitbutton"]').style.backgroundColor = 'red';
        return true;
    });

    // console.log('===为了看清楚，傲娇地等两秒===');
    await page.waitFor(2000);

    console.log('检查购物车！');
    await page.tap('[class^="bottomNav-carticon"]');

    // console.log('===为了看清楚，傲娇地等两秒===');
    await page.waitFor(2000);
    await page.tap('[class^="submit-btn-submitbutton"]');

    console.log('好了，到这里需要登录才能继续下单，演示到此结束啦！');
    console.log('5秒后关闭浏览器');
    await page.waitFor(5000);
    await browser.close();
};

module.exports = crawSpa;


if (require.main === module) {
    // for test
    crawSpa('https://h5.ele.me/msite/');
}
