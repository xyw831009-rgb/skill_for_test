# Weak Network Simulator Skill

一个功能强大的弱网环境模拟器，用于测试Web应用在各种网络条件下的表现。支持持续模拟、自动切换网络条件、性能监控和报告生成。

## 🚀 快速开始

### 方法一：直接注入（推荐）
在任何网页的控制台中执行以下代码：

```javascript
// 注入弱网模拟器
const script = document.createElement('script');
script.src = 'https://raw.githubusercontent.com/your-repo/weak-network-simulator/main/weak-network-simulator.js';
document.head.appendChild(script);

// 等待加载完成后启动
script.onload = () => {
  window.weakNetworkSimulator.start({
    duration: 10 * 60 * 1000,  // 10分钟
    presets: ['2g', '3g-slow', '3g-fast', '4g'],
    switchInterval: 60 * 1000  // 每60秒切换
  });
};
```

### 方法二：使用测试页面
打开 `example.html` 文件，通过可视化界面配置和启动模拟。

### 方法三：作为OpenClaw Skill使用
在OpenClaw中，可以通过浏览器控制功能注入并运行模拟器。

## 📋 功能特性

### 核心功能
- ✅ **持续模拟**：可设置任意时长（分钟/小时）
- ✅ **自动切换**：在不同网络条件间自动轮换
- ✅ **多种预设**：7种预定义网络条件
- ✅ **自定义配置**：支持自定义网络参数
- ✅ **性能监控**：实时监控请求性能
- ✅ **可视化提示**：页面顶部状态横幅
- ✅ **详细日志**：控制台实时日志输出
- ✅ **报告生成**：测试结束后生成详细报告

### 网络预设
| 预设名称 | 延迟 | 下载速度 | 上传速度 | 描述 |
|---------|------|----------|----------|------|
| 2G网络 | 800ms | 1.25KB/s | 0.625KB/s | 2G移动网络 |
| 慢速3G | 300ms | 6.25KB/s | 2.5KB/s | 慢速3G网络 |
| 快速3G | 150ms | 18.75KB/s | 6.25KB/s | 快速3G网络 |
| 4G网络 | 50ms | 512KB/s | 192KB/s | 4G网络 |
| 极慢网络 | 2000ms | 1KB/s | 0.5KB/s | 极慢网络 |
| 拨号上网 | 200ms | 7KB/s | 1KB/s | 拨号调制解调器 |
| 卫星网络 | 600ms | 1KB/s | 0.5KB/s | 卫星互联网 |

## 🛠️ API 参考

### 初始化
```javascript
// 模拟器会自动创建全局实例
console.log(window.weakNetworkSimulator);
```

### 启动模拟
```javascript
const config = {
  duration: 10 * 60 * 1000,      // 总时长（毫秒）
  presets: ['2g', '3g-slow', '4g'], // 网络预设数组
  switchInterval: 60 * 1000,     // 切换间隔（毫秒）
  enableVisualBanner: true,      // 显示状态横幅
  enableConsoleLog: true,        // 启用控制台日志
  monitorPerformance: true,      // 监控性能数据
  errorRate: 0.1                 // 网络错误率（0-1）
};

window.weakNetworkSimulator.start(config);
```

### 停止模拟
```javascript
window.weakNetworkSimulator.stop();
```

### 获取状态
```javascript
const status = window.weakNetworkSimulator.getStatus();
console.log(status);
```

### 获取报告
```javascript
const report = window.weakNetworkSimulator.getReport();
console.log(report);
```

## 🧪 测试用例

### 基本测试
```javascript
// 测试10分钟，包含所有网络条件
window.weakNetworkSimulator.start({
  duration: 10 * 60 * 1000,
  presets: ['2g', '3g-slow', '3g-fast', '4g', 'extreme-slow'],
  switchInterval: 30 * 1000
});
```

### 自定义网络条件
```javascript
// 添加自定义网络条件
window.weakNetworkSimulator.presets['custom-slow'] = {
  name: '自定义慢网',
  latency: 1000,
  downloadSpeed: 2 * 1024 / 1000,  // 2KB/s
  uploadSpeed: 1 * 1024 / 1000,    // 1KB/s
  color: '#9c27b0'
};

window.weakNetworkSimulator.start({
  duration: 5 * 60 * 1000,
  presets: ['custom-slow', '3g-slow', '4g'],
  switchInterval: 45 * 1000
});
```

### 集成测试
```javascript
// 在自动化测试中使用
describe('弱网环境测试', () => {
  beforeAll(async () => {
    // 启动弱网模拟
    await page.evaluate(() => {
      return window.weakNetworkSimulator.start({
        duration: 5 * 60 * 1000,
        presets: ['3g-slow'],
        switchInterval: 60 * 1000
      });
    });
  });
  
  afterAll(async () => {
    // 停止模拟并获取报告
    const report = await page.evaluate(() => {
      window.weakNetworkSimulator.stop();
      return window.weakNetworkSimulator.getReport();
    });
    
    console.log('测试报告:', report);
  });
  
  it('应在慢速3G下正常加载', async () => {
    // 测试代码...
  });
});
```

## 📊 报告格式

模拟结束后生成的报告包含以下信息：

### JSON报告结构
```json
{
  "metadata": {
    "simulator": "Weak Network Simulator",
    "version": "1.0.0",
    "startTime": "2025-01-01T10:00:00.000Z",
    "endTime": "2025-01-01T10:10:00.000Z",
    "totalDuration": 600000,
    "config": { /* 模拟配置 */ }
  },
  "performance": {
    "resourceStats": {
      "total": 150,
      "byType": { "img": 50, "script": 20, "css": 15 },
      "totalSize": 2048000,
      "totalTime": 45000
    },
    "navigationStats": {
      "dnsLookup": 120,
      "tcpConnect": 200,
      "requestResponse": 800,
      "domProcessing": 1500,
      "pageLoad": 3000
    },
    "eventLog": [ /* 详细事件日志 */ ]
  },
  "summary": {
    "totalEvents": 500,
    "requestEvents": 200,
    "failedRequests": 20,
    "networkPresetsUsed": ["2g", "3g-slow", "4g"],
    "averageRequestTime": 1200
  }
}
```

### Markdown报告示例
```markdown
# 弱网模拟测试报告

## 测试概览
- **测试工具**: Weak Network Simulator v1.0.0
- **开始时间**: 2025-01-01 18:00:00
- **结束时间**: 2025-01-01 18:10:00
- **总时长**: 600.0秒
- **网络预设**: 2g, 3g-slow, 4g
- **切换间隔**: 60秒

## 性能摘要
- **总事件数**: 500
- **网络请求数**: 200
- **失败请求数**: 20
- **失败率**: 10.0%
- **平均请求时间**: 1200ms

## 建议
1. 在慢速网络下优化图片大小和格式
2. 实现懒加载以减少初始加载时间
3. 使用Service Worker缓存关键资源
4. 考虑实现离线功能
5. 添加网络状态提示和加载指示器
```

## 🔧 集成指南

### 与OpenClaw集成
```javascript
// 在OpenClaw中注入并运行
await browser.act({
  kind: 'evaluate',
  fn: `
    // 注入弱网模拟器
    const script = document.createElement('script');
    script.src = 'weak-network-simulator.js';
    document.head.appendChild(script);
    
    script.onload = () => {
      window.weakNetworkSimulator.start({
        duration: 10 * 60 * 1000,
        presets: ['3g-slow', '4g'],
        switchInterval: 120 * 1000
      });
    };
  `
});
```

### 与Puppeteer集成
```javascript
const puppeteer = require('puppeteer');

async function runWeakNetworkTest() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // 注入弱网模拟器
  await page.addScriptTag({
    path: './weak-network-simulator.js'
  });
  
  // 启动模拟
  await page.evaluate(() => {
    return window.weakNetworkSimulator.start({
      duration: 5 * 60 * 1000,
      presets: ['2g', '3g-slow'],
      switchInterval: 60 * 1000
    });
  });
  
  // 进行测试...
  
  // 获取报告
  const report = await page.evaluate(() => {
    window.weakNetworkSimulator.stop();
    return window.weakNetworkSimulator.getReport();
  });
  
  console.log('测试报告:', report);
  await browser.close();
}
```

### 与Cypress集成
```javascript
// cypress/support/commands.js
Cypress.Commands.add('startWeakNetworkSimulation', (config = {}) => {
  cy.window().then((win) => {
    const defaultConfig = {
      duration: 5 * 60 * 1000,
      presets: ['3g-slow'],
      switchInterval: 60 * 1000
    };
    
    return win.weakNetworkSimulator.start({ ...defaultConfig, ...config });
  });
});

Cypress.Commands.add('stopWeakNetworkSimulation', () => {
  cy.window().then((win) => {
    win.weakNetworkSimulator.stop();
    return win.weakNetworkSimulator.getReport();
  });
});

// 在测试中使用
describe('弱网测试', () => {
  before(() => {
    cy.startWeakNetworkSimulation();
  });
  
  after(() => {
    cy.stopWeakNetworkSimulation().then((report) => {
      cy.writeFile('weak-network-report.json', report);
    });
  });
  
  it('在慢速3G下测试登录', () => {
    // 测试代码...
  });
});
```

## 🎯 使用场景

### 1. 开发阶段测试
- 测试页面在弱网下的加载性能
- 验证离线功能是否正常工作
- 测试网络错误处理机制

### 2. 质量保证
- 自动化测试套件集成
- 性能基准测试
- 兼容性测试

### 3. 用户体验优化
- 识别慢速网络下的性能瓶颈
- 优化资源加载策略
- 改进加载状态提示

### 4. 演示和教育
- 展示不同网络条件下的用户体验
- 培训团队成员了解网络性能重要性
- 客户演示产品在恶劣网络下的表现

## ⚠️ 注意事项

1. **模拟精度**：模拟器通过拦截网络请求实现，与实际网络条件存在差异
2. **浏览器兼容性**：需要现代浏览器支持（ES6+）
3. **Service Worker**：Service Worker可能会影响模拟效果
4. **页面刷新**：刷新页面会重置模拟器
5. **性能影响**：长时间模拟可能会占用较多内存

## 🔄 更新日志

### v1.0.0 (2025-01-01)
- 初始版本发布
- 支持7种网络预设
- 自动切换功能
- 性能监控和报告生成
- 可视化状态横幅

## 📞 支持与贡献

### 问题反馈
如遇到问题，请提交Issue到GitHub仓库。

### 功能建议
欢迎提出新功能建议和改进意见。

### 贡献代码
1. Fork仓库
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 📄 许可证

MIT License - 详见LICENSE文件。

---

**快乐测试！** 🚀

如果这个Skill对你有帮助，请给个Star ⭐