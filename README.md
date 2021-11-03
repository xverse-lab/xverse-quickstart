- demo

1. 安装

```
npm install
```

2. 增加环境变量
在根目录创建 .env 文件，内容如下

VITE_APPID=xxx
VITE_SKINID=xxx

3. 运行

```
npm run dev
```

打开两个 Tab，分别输入 http://localhost:5000/ （不需要额外参数，参数都写在 main.ts 里了）以模拟多人同时进入一个房间。
房间ID固定为 main.ts 里提供的 f8f54e5d-fd40-40a4-8e8f-e17ba41f4f5e，不要更改。


- 页面说明

select.html # 选择 Avatar
index.html  # 房间页
