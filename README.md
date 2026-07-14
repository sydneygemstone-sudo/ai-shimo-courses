# 毛球与小驯养师｜静态互动幻灯

这是一个可以在 Mac、PC、iPad 或手机随时打开的 GitHub Pages 课程仓库。AI使魔训练营只跳转到公开 URL；课程本体不依赖老师的 Mac、MSI、AI使魔平台、账号或 API。

## 两个入口

- 三年级 60 分钟高阶版：`https://sydneygemstone-sudo.github.io/ai-shimo-courses/`
- 一二年级十课版：`https://sydneygemstone-sudo.github.io/ai-shimo-courses/full-course/`
- 一二年级教师排练版：`https://sydneygemstone-sudo.github.io/ai-shimo-courses/full-course/?teacher=1`
- 源码与版本历史：`https://github.com/sydneygemstone-sudo/ai-shimo-courses`

根入口先让老师选择年龄路线。三年级路线直接进入 16 张全屏互动幻灯；一二年级路线进入十课地图，每课固定 9 张幻灯。

## 课堂语法

每一屏只做一件事：

1. 毛球问一个问题；
2. 孩子先回答；
3. 下一屏再揭晓；
4. 毛球发一个任务；
5. 工具独占一整屏；
6. 用刚才的结果解释原因；
7. 换一个新情境再判断；
8. 毛球复述，孩子补正；
9. 一个出口题结束。

十课地图可打开“教师排练”，也可直接使用教师排练链接。十课共 90 页，每页都有三块独立提词：老师照着说、孩子现在做什么、怎样自然接到下一页。上课投影前可关闭；临时查看时点右上角“本页怎么讲”或按 `S`。左右方向键、底部按钮和左右滑动都可翻页。

## 外部活动映射

- AutoDraw：`https://www.autodraw.com/`
- Quick, Draw!：`https://quickdraw.withgoogle.com/`

两个入口必须保持分离。外部站点打不开时，点击同页“本地猜图”即可完成相同的猜一猜—看结果—想一想环节。

## 开课前检查

1. iPad 横屏打开两个在线入口。
2. 任意进入一课，试一次上一页、下一页、左右滑动和教师提词。
3. 分别打开 AutoDraw 与 Quick, Draw!，确认进入不同网站并能返回课程标签页。
4. 临时断网，确认本地猜图、输入实验、猫狗相册小游戏等核心工具仍可运行。
5. 全屏投影时确认毛球、问题和按钮均在一屏内，不出现纵向讲义。

## 维护与发布

修改后运行：

```bash
node scripts/validate.mjs
```

推送到 `main` 后由 GitHub Actions 验证并由 GitHub Pages 发布。公开仓库只包含净化后的静态课程；不要复制原 AI-Shimo 工作树中的服务配置、日志、profile、memory 或缓存。

## 教学边界

- 毛球是故事角色，不是生命，也不是永远正确的权威。
- 不要求孩子上传脸、声音、真实姓名、地址或其他私人资料。
- 真实发送、付款、发布、账号与个人数据不进入儿童工具流。
- Agent 页面明确是静态模拟；AI使魔平台的可用性不阻塞课程。
