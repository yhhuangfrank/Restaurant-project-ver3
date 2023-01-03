# Restaurant-project-ver3

A web application for collecting your favorite restaurants

![Previrew](https://github.com/yhhuangfrank/Restaurant-project-ver3/blob/main/public/image/preview%20image1.png)
![Previrew](https://github.com/yhhuangfrank/Restaurant-project-ver3/blob/main/public/image/preview%20image2.png)

## Features

- 會員登入、註冊功能
- 查看使用者帳號所有餐廳
- 新增餐廳
- 點擊餐廳檢視詳細內容(包含電話、地址、google maps 位置等等)
- 編輯餐廳
- 刪除餐廳
- 搜尋餐廳名稱(英文名稱)、類別、以及評分(顯示高於輸入值餐廳)

### Installation

1. 開啟終端機，將專案 clone 至本機電腦

```
git clone https://github.com/yhhuangfrank/Restaurant-project-ver3.git
```

2. 初始化

```
cd Restaurant-project // 進入專案資料夾
npm install // 將所需的npm module安裝
```

3. 使用 `npm run seed` 新增種子資料

4. 使用 `npm run start` 執行若出現下方訊息代表順利執行

```
Server is listening to http://localhost:3000
```

4. 網址列輸入 http://localhost:3000/home 開始使用

### Built with

- [Node.js @18.12.1](https://nodejs.org/zh-tw/download/) -Environment
- [Express @4.16.4](https://www.npmjs.com/package/express) - Web framework
- [Express-handlebars @3.0.0](https://www.npmjs.com/package/express-handlebars) - Template engine
- [Bootstrap 5.2](https://getbootstrap.com/)
- [Font-awesome 5.8.1](https://getbootstrap.com/)
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose @5.9.7](https://www.npmjs.com/package/mongoose) - ODM
- And other dependencies
