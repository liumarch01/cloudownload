export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    
    // 根路径：返回页面
    if (url.pathname === '/' && !target) {
      return new Response(getPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // 下载请求：极速精简模式
    if (target && target.startsWith('http')) {
      return await fastDownload(target);
    }
    
    return new Response('使用 ?url=链接', { status: 400 });
  }
};

// ===== 极速下载 =====
async function fastDownload(target) {
  try {
    const resp = await fetch(target, {
      headers: { 'user-agent': 'Mozilla/5.0' }
    });
    
    const fileName = target.split('/').pop().split('?')[0] || 'download';
    
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: {
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Type': resp.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (err) {
    return new Response(`下载失败: ${err.message}`, { status: 500 });
  }
}

// ===== HTML页面 =====
function getPage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudownload下载加速器</title>
  <link rel="icon" href="https://网站图标-需要自行修改/favicon.png" type="image/png">
  <link rel="shortcut icon" href="https://网站图标-需要自行修改/favicon.png" type="image/png">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
      background: #f0f2f5; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      min-height: 100vh; 
      padding: 20px; 
    }
    .card { 
      background: #fff; 
      padding: 35px; 
      border-radius: 16px; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
      width: 100%; 
      max-width: 520px; 
    }
    h1 { font-size: 24px; margin-bottom: 5px; }
    .sub { color: #666; font-size: 14px; margin-bottom: 20px; }
    .node-status { 
      padding: 12px 16px; 
      border-radius: 10px; 
      margin: 16px 0; 
      font-size: 14px; 
      display: flex; 
      align-items: center; 
      gap: 10px;
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
    }
    .node-status .dot { 
      width: 10px; 
      height: 10px; 
      border-radius: 50%; 
      display: inline-block; 
      flex-shrink: 0; 
    }
    .node-status .dot.green { background: #4caf50; }
    .node-status .dot.orange { background: #ff9800; }
    .node-status .dot.red { background: #f44336; }
    .input-group { margin: 20px 0; }
    label { display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px; }
    input[type="url"] { 
      width: 100%; 
      padding: 14px; 
      border: 2px solid #e0e0e0; 
      border-radius: 10px; 
      font-size: 14px; 
      outline: none; 
      transition: border-color 0.2s; 
    }
    input[type="url"]:focus { border-color: #0066ff; }
    .btn { 
      width: 100%; 
      padding: 14px; 
      border: none; 
      border-radius: 10px; 
      font-size: 15px; 
      font-weight: 600; 
      cursor: pointer; 
      transition: all 0.2s;
      background: #0066ff; 
      color: #fff; 
      margin-top: 10px; 
    }
    .btn:hover { background: #0052cc; transform: translateY(-1px); }
    .btn:disabled { background: #999; cursor: not-allowed; transform: none; }
    .tip { 
      margin-top: 20px; 
      padding: 16px; 
      background: #f8f9fa; 
      border-radius: 10px; 
      font-size: 13px; 
      line-height: 1.8; 
      border-left: 4px solid #0066ff; 
    }
    .loading { display: none; text-align: center; padding: 15px; }
    .result { margin-top: 10px; font-size: 14px; }
    .node-detail { font-size: 12px; color: #888; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Cloudownload下载加速器</h1>
    <div class="sub">粘贴链接急速下载🔥🔥🔥</div>
    
    <div class="node-status" id="nodeStatus">
      <span class="dot orange" id="nodeDot"></span>
      <div>
        <strong id="nodeText">正在检测节点...</strong>
        <div class="node-detail" id="nodeDetail"></div>
      </div>
    </div>
    
    <div class="input-group">
      <label for="urlInput">📎 文件下载链接</label>
      <input type="url" id="urlInput" placeholder="例如：https://example.com/file.zip" required>
    </div>
    
    <button class="btn" id="downloadBtn" onclick="startDownload()">开始下载</button>
    
    <div class="loading" id="loading">
      <p>⏳ 正在启动下载...</p>
    </div>
    
    <div class="result" id="result"></div>
    
    <div class="tip">
      <strong>📌 说明：</strong><br>
      • 节点信息为响应当前请求的节点【/cdn-cgi/trace】<br>
      • 速度基于优选IP，需联系管理员更改<br>
      • 建议使用多线程下载<br>
    </div>
  </div>
  
  <script>
    // ===== 翻译字典 =====
    let coloDict = {};
    let locDict = {};
    let dictLoaded = false;
    
    // 加载 colo 翻译（节点代码 → 中文名）
    async function loadColoDict() {
      try {
        const resp = await fetch('https://你自己的cf链接-需要自行修改/colo.txt');
        const text = await resp.text();
        coloDict = JSON.parse(text);
        console.log('✅ colo翻译加载成功');
      } catch (err) {
        console.warn('⚠️ colo翻译加载失败:', err);
      }
    }
    
    // 加载 loc 翻译（国家代码 → 中文名）
    async function loadLocDict() {
      try {
        const resp = await fetch('https://你自己的cf链接-需要自行修改/loc.txt');
        const text = await resp.text();
        locDict = JSON.parse(text);
        console.log('✅ loc翻译加载成功');
      } catch (err) {
        console.warn('⚠️ loc翻译加载失败:', err);
      }
    }
    
    async function loadDict() {
      await Promise.all([loadColoDict(), loadLocDict()]);
      dictLoaded = true;
    }
    
    function translateColo(colo) {
      if (coloDict[colo]) {
        return colo + '-' + coloDict[colo];
      }
      return colo;
    }
    
    function translateLoc(loc) {
      if (locDict[loc]) {
        return locDict[loc];
      }
      return loc;
    }
    
    // ===== 检测节点 =====
    async function detectNode() {
      const statusDiv = document.getElementById('nodeStatus');
      const dot = document.getElementById('nodeDot');
      const text = document.getElementById('nodeText');
      const detail = document.getElementById('nodeDetail');
      
      if (!dictLoaded) {
        await loadDict();
      }
      
      try {
        const resp = await fetch('/cdn-cgi/trace');
        const trace = await resp.text();
        
        const coloMatch = trace.match(/colo=(\\S+)/);
        const colo = coloMatch ? coloMatch[1] : 'Unknown';
        
        const ipMatch = trace.match(/ip=(\\S+)/);
        const ip = ipMatch ? ipMatch[1] : 'Unknown';
        
        const locMatch = trace.match(/loc=(\\S+)/);
        const loc = locMatch ? locMatch[1] : 'Unknown';
        
        const jpColos = ['NRT', 'HND', 'KIX', 'NGO'];
        const isJapan = jpColos.includes(colo);
        
        const coloTranslated = translateColo(colo);
        const locTranslated = translateLoc(loc);
        
        if (isJapan) {
          dot.className = 'dot green';
          text.textContent = '节点信息【' + coloTranslated + '】';
          detail.textContent = '用户信息：' + locTranslated + ' · ' + ip;
          statusDiv.style.borderColor = '#4caf50';
          statusDiv.style.background = '#e8f5e9';
        } else if (colo === 'Unknown') {
          dot.className = 'dot red';
          text.textContent = '❓ 无法检测节点';
          detail.textContent = '请检查网络连接';
          statusDiv.style.borderColor = '#f44336';
          statusDiv.style.background = '#ffebee';
        } else {
          dot.className = 'dot orange';
          text.textContent = '🌍 ' + coloTranslated + ' 节点（普通速度）';
          detail.textContent = locTranslated + ' · ' + ip;
          statusDiv.style.borderColor = '#ff9800';
          statusDiv.style.background = '#fff3e0';
        }
        
        return { colo, isJapan, ip, loc };
        
      } catch (err) {
        dot.className = 'dot red';
        text.textContent = '⚠️ 节点检测失败';
        detail.textContent = '下载功能不受影响，请继续使用';
        statusDiv.style.borderColor = '#f44336';
        statusDiv.style.background = '#ffebee';
        return null;
      }
    }
    
    // ===== 开始下载 =====
    let isDownloading = false;
    
    function startDownload() {
      if (isDownloading) return;
      
      const url = document.getElementById('urlInput').value.trim();
      if (!url) {
        alert('请输入下载链接');
        return;
      }
      
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('请输入有效的下载链接（以 http:// 或 https:// 开头）');
        return;
      }
      
      isDownloading = true;
      const btn = document.getElementById('downloadBtn');
      const loading = document.getElementById('loading');
      const result = document.getElementById('result');
      
      btn.disabled = true;
      btn.textContent = '⏳ 启动中...';
      loading.style.display = 'block';
      result.innerHTML = '';
      
      const downloadUrl = '/?url=' + encodeURIComponent(url);
      
      const win = window.open(downloadUrl, '_blank');
      if (!win) {
        window.location.href = downloadUrl;
      }
      
      setTimeout(() => {
        isDownloading = false;
        btn.disabled = false;
        btn.textContent = '⬇️ 开始下载';
        loading.style.display = 'none';
        result.innerHTML = '✅ 下载已启动，请查看下载管理器';
        setTimeout(() => { result.innerHTML = ''; }, 5000);
      }, 3000);
    }
    
    // ===== 回车触发下载 =====
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') startDownload();
    });
    
    // ===== 页面加载时：先加载字典，再检测节点 =====
    document.addEventListener('DOMContentLoaded', async function() {
      await loadDict();
      await detectNode();
    });
    
    // ===== 每5分钟重新检测 =====
    setInterval(async function() {
      await detectNode();
    }, 300000);
  </script>
</body>
</html>`;
}