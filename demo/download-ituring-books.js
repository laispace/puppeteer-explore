/**
 * 下载图灵电子书
 */
const puppeteer = require('puppeteer');
const mkdirp = require('mkdirp');
const path = require('path');
const BASE_URL = 'http://www.ituring.com.cn';
const SHELF_URL = `${BASE_URL}/user/shelf`;
const LOGIN_URL = `http://account.ituring.com.cn/log-in?returnUrl=${encodeURIComponent(SHELF_URL)}`;

const printIturingBooks = async (userName, password, saveDir = './books/') => {
    if (!userName) {
        throw new Error('请输入用户名');
    }
    if (!password) {
        throw new Error('请输入密码');
    }
    try {
        // 设置统一的视窗大小
        const viewport = {
            width: 1376,
            height: 768,
        };

        console.log('启动浏览器');
        const browser = await puppeteer.launch({
            // 关闭无头模式，方便我们看到这个无头浏览器执行的过程
            // 注意若调用了 Page.pdf 即保存为 pdf，则需要保持为无头模式
            // headless: false,
        });

        console.log('打开新页面');
        const page = await browser.newPage();
        page.setViewport(viewport);

        console.log('输入登录地址');
        await page.goto(LOGIN_URL);

        await page.waitForSelector('#loginForm');

        console.log('输入用户名和密码');
        await page.focus('#Email');
        await page.type(userName);
        await page.focus('#Password');
        await page.type(password);
        await page.click('#loginForm  input[type="submit"]');

        await page.waitForSelector('.block-items');
        const books = await page.$eval('.block-items', element => {
            const booksHTMLCollection = element.querySelectorAll('.block-item');
            const booksElementArray = Array.prototype.slice.call(booksHTMLCollection);
            const books = booksElementArray.map(item => {
                const a = item.querySelector('.book-img a');
                return {
                    href: a.getAttribute('href'),
                    title: a.getAttribute('title'),
                };
            });
            return books;
        });
        console.log(`书架上共找到${books.length}本书`);

        for (let book of books) {
            const bookPage = await browser.newPage();
            bookPage.setViewport(viewport);
            await bookPage.goto(`${BASE_URL}/${book.href}`);
            await bookPage.waitForSelector('.bookmenu');
            const articles = await bookPage.$eval('.bookmenu table tbody', element => {
                const articlesHTMLCollection = element.querySelectorAll('tr');
                const articlesElementArray = Array.prototype.slice.call(articlesHTMLCollection);
                const articles = articlesElementArray.map(item => {
                    const a = item.querySelector('td a');
                    return {
                        href: a.getAttribute('href'),
                        title: a.innerText.trim(),
                    };
                });
                return articles;
            });
            bookPage.close();

            for (let article of articles) {
                const articlePage = await browser.newPage();
                articlePage.setViewport(viewport);
                await articlePage.goto(`${BASE_URL}/${article.href}`);
                await articlePage.waitForSelector('.article-detail');
                await articlePage.$eval('body', body => {
                    body.querySelector('.layout-head').style.display = 'none';
                    body.querySelector('.book-page .side').style.display = 'none';
                    body.querySelector('#footer').style.display = 'none';
                    body.querySelector('#toTop').style.display = 'none';
                    Promise.resolve();
                });
                const dirPath = `${saveDir}/${book.title}`;
                const fileName = `${article.title.replace(/\//g, '、')}.pdf`;
                const filePath = `${dirPath}/${fileName}`;
                mkdirp.sync(dirPath);
                await page.emulateMedia('screen');
                await articlePage.pdf({
                    path: filePath,
                    format: 'A4'
                });
                console.log(`保存成功: ${filePath}`);
                articlePage.close();
            }
        }

        browser.close();
    } catch (e) {
        console.error(e);
    }
};

const USER = process.argv[2];
const PASSWORD = process.argv[3];
const SAVE_DIR = process.argv[4];

if (!USER || !PASSWORD) {
    console.log('invalid user or password');
    process.exit();
}

printIturingBooks(USER, PASSWORD, SAVE_DIR);




