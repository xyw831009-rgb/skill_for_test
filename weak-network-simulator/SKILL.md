# Weak Network Simulator Skill

一个可以模拟不同弱网环境的浏览器自动化技能，用于测试Web应用在各种网络条件下的表现。

## 功能特性

- 🕒 **持续模拟**：可设置持续时间（如10分钟）
- 🔄 **自动切换**：在不同网络条件间自动切换
- 📊 **多种预设**：2G、3G慢速、3G快速、4G、极慢网络等
- 📈 **性能监控**：记录页面加载时间和资源加载情况
- 🎯 **可视化提示**：页面顶部显示当前网络状态
- 📝 **日志记录**：详细记录模拟过程和性能数据

## 使用方法

### 基本使用
```javascript
// 启动10分钟的弱网模拟
window.weakNetworkSimulator.start({
  duration: 10 * 60 * 1000, // 10分钟（毫秒）
  presets: ['2g', '3g-slow', '3g-fast', '4g', 'extreme-slow'],
  switchInterval: 60 * 1000 // 每60秒切换一次
});
```

### 自定义网络条件
```javascript
window.weakNetworkSimulator.start({
  duration: 5 * 60 * 1000, // 5分钟
  customConditions: [
    { name: '拨号上网', latency: 200, download: 7, upload: 1 }, // KB/s
    { name: '卫星网络', latency: 600, download: 1, upload: 0.5 },
    { name: '拥挤WiFi', latency: 100, download: 50, upload: 10 }
  ],
  switchInterval: 90 * 1000 // 每90秒切换一次
});
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

## 网络预设

| 预设名称 | 延迟 | 下载速度 | 上传速度 | 描述 |
|---------|------|----------|----------|------|
| `2g` | 800ms | 1.25KB/s | 0.625KB/s | 2G移动网络 |
| `3g-slow` | 300ms | 6.25KB/s | 2.5KB/s | 慢速3G网络 |
| `3g-fast` | 150ms | 18.75KB/s | 6.25KB/s | 快速3G网络 |
| `4g` | 50ms | 512KB/s | 192KB/s | 4G网络 |
| `extreme-slow` | 2000ms | 1KB/s | 0.5KB/s | 极慢网络 |
| `dial-up` | 200ms | 7KB/s | 1KB/s | 拨号上网 |
| `satellite` | 600ms | 1KB/s | 0.5KB/s | 卫星网络 |

## 性能监控

模拟器会自动监控：
- 页面加载时间
- 资源请求数量
- 请求成功率/失败率
- 各网络条件下的平均响应时间

## 输出文件

模拟结束后会生成报告：
- `weak-network-report-{timestamp}.json` - 详细性能数据
- `weak-network-summary-{timestamp}.md` - 摘要报告

## 集成到测试流程

可与以下工具集成：
- Puppeteer/Playwright 测试套件
- Selenium 自动化测试
- 手动测试时的网络条件模拟
- 性能基准测试

## 注意事项

1. 模拟器通过拦截`fetch`和`XMLHttpRequest`实现，不会影响真正的网络连接
2. 图片加载延迟通过重写`Image`构造函数实现
3. 页面刷新会重置模拟器，需要重新启动
4. Service Worker可能会影响模拟效果

## 开发计划

- [ ] 添加更多网络预设
- [ ] 支持随机网络波动模拟
- [ ] 集成到CI/CD流水线
- [ ] 添加可视化图表
- [ ] 支持导出为HAR文件