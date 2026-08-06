# Cloudownload
基于cloudflare的边缘节点对外网的低速资源进行加速
## 项目说明
1. **如果您觉得项目对您有帮助，请给一个Star，这是对我最大的鼓励！**
2. 自用Cloudflare Worker JS脚本，希望可以帮助到大家。

## 使用教程
1. 申请一个自己的域名并托管到cloudflare，可前往[DNSHE](https://www.dnshe.com/)免费注册
2. 在cloudflare中创建一个pages，把项目中的[colo.txt](https://github.com/liumarch01/cloudownload/blob/main/colo.txt)和[loc.txt](https://github.com/liumarch01/cloudownload/blob/main/loc.txt)部署到pages中
3. 在cloudflare中新建一个Worker，选择【从hello world开始！】，然后把项目的[_worker.js](https://github.com/liumarch01/cloudownload/blob/main/_worker.js)中的内容复制进入worker
4. 修改worker的183行和195行的的链接为pages中对应文件的链接；修改55和56行的网页图标为自己喜欢的图像链接，可部署图像到pages中进行自定义；此步骤非强制要求不会影响正常下载但会造成一定程度的影响
5. 在Worker页面的【域】中点击【添加路由】添加一个自己域名的子域，例如【cloudownload.example.com/*】
6. 回到cloudflare的首页，点击你添加进去的主域名如【example.com】,点击【DNS记录】，选择【+添加记录】
7. 添加记录类型为【A】，名称填写worker路由中的子域即举例的【cloudownload.example.com】，IPv4地址填写想要的服务器IP，这个关系到下载速度，默认路由经常广播到AMS节点导致加速不理想，可选择日本或是新加坡的节点IP进行导入，优选IP可前往[CloudflareSpeedTest](https://github.com/XIU2/CloudflareSpeedTest)项目测试并获取
8. 部署完成后在自己的域名后面添加上【cdn-cgi/trace】，观察colo的值是否是自己指定的节点，如果不是需要重新检查部署
9. 进入你部署的项目，把想要下载的文件粘贴进入并点击下载，享受快速的下载体验吧
10. 对你有帮助的话别忘了给我一个 Star 哦Ciallo～(∠・ω< )⌒★
## 开源协议
采用 **MIT License**

## 免责声明
1. 本项目仅用于网络技术学习、开源资源下载加速研究，仅限个人自用，禁止大规模公开部署、商业运营；
2. 使用者部署本项目时，必须严格遵守Cloudflare服务条款、及所在地区法律法规；
3. 禁止使用本工具下载、传播侵权、色情、暴力、违法违规内容；
4. 因违规使用本项目造成账号封禁、法律追责等一切后果，均由使用者自行承担，作者不承担任何连带责任；
5. 请勿利用本工具绕过网络监管、规避区域访问限制。
