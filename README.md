# Cloudownload
基于cloudflare的边缘节点对外网的低速资源进行加速
## 项目说明
1. **如果您觉得项目对您有帮助，请给一个Star，这是对我最大的鼓励！**
2. 自用Cloudflare Worker JS脚本，希望可以帮助到大家。

## 部署提示
项目直接复制代码无法正确响应但不影响下载功能，建议分别修改js的55、56、183、195行
## 使用教程
1. 准备一个域名并托管到cloudflare，没有域名可前往[DNSHE](https://www.dnshe.com/)免费注册
2. 在cloudflare中创建一个pages，把项目中的[colo.txt](https://github.com/liumarch01/cloudownload/blob/main/colo.txt)和[loc.txt](https://github.com/liumarch01/cloudownload/blob/main/loc.txt)部署到pages中
3. 在cloudflare中新建一个Worker，选择【从hello world开始！】，然后把项目的[_worker.js](https://github.com/liumarch01/cloudownload/blob/main/_worker.js)中的内容复制进入worker
4. 修改worker的183行和195行的的链接为pages中对应文件的链接；修改55和56行的网页图标为自己喜欢的图像链接，可部署图像到pages中进行自定义
5. 在Worker页面的【域】中点击【添加路由】添加一个自己域名的子域，例如【cloudownload.example.com/*】
6. 回到cloudflare的首页，点击你添加进去的主域名如【example.com】,点击【DNS记录】，选择【+添加记录】
7. 添加记录类型为【A】，名称填写worker路由中的子域即举例的【cloudownload.example.com】，IPv4地址填写目标cloudflare服务器IP，这个关系到下载速度，默认路由经常广播到AMS节点导致加速不理想，可选择日本或是新加坡的节点IP进行导入，优选IP可前往[CloudflareSpeedTest](https://github.com/XIU2/CloudflareSpeedTest)项目测试并获取
8. 部署完成后在自己的域名后面添加上【cdn-cgi/trace】，观察colo的值是否是自己指定的节点，如果不是需要重新检查部署
9. 进入你部署的项目，把想要下载的文件粘贴进入并点击下载，享受快速的下载体验吧
10. 对你有帮助的话别忘了给我一个 Star 哦Ciallo～(∠・ω< )⌒★
## 开源协议
采用 **MIT License**

## ⚠️ 免责声明
1. 本项目仅用于网络技术学习、开源公开资源下载加速研究，仅限个人自用，禁止大规模公开部署、商业运营、对外提供付费服务；
2. 部署与使用本项目的用户，需严格遵守 Cloudflare 服务条款、GitHub 平台规则以及自身所在地法律法规，不得利用本工具实施任何违规操作；
3. 严禁使用本工具下载、存储、传播盗版、侵权、色情、暴力及各类违法违规内容；
4. 禁止借助本工具规避网络监管、突破地区访问限制、下载受限资源；
5. 因违规部署、违规使用本项目导致 Cloudflare 账号封禁、域名限制、法律追责、财产损失等全部后果，均由使用者自行承担，项目作者不承担任何连带责任；
6. 本代码按现状开源，不提供稳定性、可用性担保；项目仅做流量中转，不会缓存、留存用户下载文件，第三方链接资源的版权与合法性由访问者自行负责。
