/**
 * Weak Network Simulator
 * 弱网环境模拟器
 * 
 * 功能：模拟不同网络条件，自动切换，持续运行指定时间
 */

class WeakNetworkSimulator {
  constructor() {
    this.originalFetch = window.fetch;
    this.originalImage = window.Image;
    this.originalXHROpen = XMLHttpRequest.prototype.open;
    this.originalXHRSend = XMLHttpRequest.prototype.send;
    
    this.simulating = false;
    this.startTime = null;
    this.endTime = null;
    this.currentPreset = null;
    this.switchTimer = null;
    this.durationTimer = null;
    
    this.performanceLog = [];
    this.currentConditions = null;
    
    // 网络预设配置
    this.presets = {
      '2g': {
        name: '2G网络',
        latency: 800,
        downloadSpeed: 10 * 1024 / 8 / 1000,  // 1.25KB/s
        uploadSpeed: 5 * 1024 / 8 / 1000,     // 0.625KB/s
        color: '#ff6b6b'
      },
      '3g-slow': {
        name: '慢速3G',
        latency: 300,
        downloadSpeed: 50 * 1024 / 8 / 1000,  // 6.25KB/s
        uploadSpeed: 20 * 1024 / 8 / 1000,    // 2.5KB/s
        color: '#ffa726'
      },
      '3g-fast': {
        name: '快速3G',
        latency: 150,
        downloadSpeed: 150 * 1024 / 8 / 1000, // 18.75KB/s
        uploadSpeed: 50 * 1024 / 8 / 1000,    // 6.25KB/s
        color: '#ffd54f'
      },
      '4g': {
        name: '4G网络',
        latency: 50,
        downloadSpeed: 4 * 1024 * 1024 / 8 / 1000,  // 512KB/s
        uploadSpeed: 1.5 * 1024 * 1024 / 8 / 1000, // 192KB/s
        color: '#66bb6a'
      },
      'extreme-slow': {
        name: '极慢网络',
        latency: 2000,
        downloadSpeed: 1 * 1024 / 1000,       // 1KB/s
        uploadSpeed: 0.5 * 1024 / 1000,       // 0.5KB/s
        color: '#d32f2f'
      },
      'dial-up': {
        name: '拨号上网',
        latency: 200,
        downloadSpeed: 7 * 1024 / 1000,       // 7KB/s
        uploadSpeed: 1 * 1024 / 1000,         // 1KB/s
        color: '#7b1fa2'
      },
      'satellite': {
        name: '卫星网络',
        latency: 600,
        downloadSpeed: 1 * 1024 / 1000,       // 1KB/s
        uploadSpeed: 0.5 * 1024 / 1000,       // 0.5KB/s
        color: '#0288d1'
      }
    };
    
    // 默认配置
    this.defaultConfig = {
      duration: 10 * 60 * 1000,      // 10分钟
      presets: ['2g', '3g-slow', '3g-fast', '4g', 'extreme-slow'],
      switchInterval: 60 * 1000,     // 每60秒切换
      enableVisualBanner: true,
      enableConsoleLog: true,
      errorRate: 0.1,                // 10%的错误率
      monitorPerformance: true
    };
    
    this.config = { ...this.defaultConfig };
  }
  
  /**
   * 启动弱网模拟
   * @param {Object} options - 配置选项
   */
  async start(options = {}) {
    if (this.simulating) {
      console.warn('弱网模拟已经在运行中');
      return false;
    }
    
    // 合并配置
    this.config = { ...this.defaultConfig, ...options };
    
    // 验证配置
    if (!Array.isArray(this.config.presets) || this.config.presets.length === 0) {
      console.error('必须提供至少一个网络预设');
      return false;
    }
    
    if (this.config.duration <= 0) {
      console.error('持续时间必须大于0');
      return false;
    }
    
    if (this.config.switchInterval <= 0) {
      console.error('切换间隔必须大于0');
      return false;
    }
    
    console.log('🚀 启动弱网环境模拟器');
    console.log(`⏱️  总时长: ${this.config.duration / 1000}秒`);
    console.log(`🔄 切换间隔: ${this.config.switchInterval / 1000}秒`);
    console.log(`📶 网络预设: ${this.config.presets.join(', ')}`);
    
    this.startTime = Date.now();
    this.endTime = this.startTime + this.config.duration;
    this.simulating = true;
    
    // 初始化性能监控
    this.initPerformanceMonitoring();
    
    // 应用第一个网络预设
    await this.applyNextPreset();
    
    // 设置定时切换
    this.switchTimer = setInterval(() => {
      this.applyNextPreset();
    }, this.config.switchInterval);
    
    // 设置结束定时器
    this.durationTimer = setTimeout(() => {
      this.stop();
    }, this.config.duration);
    
    // 添加可视化横幅
    if (this.config.enableVisualBanner) {
      this.addVisualBanner();
    }
    
    // 记录启动事件
    this.logPerformanceEvent('simulator_started', {
      config: this.config,
      startTime: new Date(this.startTime).toISOString()
    });
    
    return true;
  }
  
  /**
   * 应用下一个网络预设
   */
  async applyNextPreset() {
    if (!this.simulating) return;
    
    // 获取下一个预设（循环）
    const presetIndex = this.currentPreset 
      ? (this.config.presets.indexOf(this.currentPreset) + 1) % this.config.presets.length
      : 0;
    
    const presetName = this.config.presets[presetIndex];
    const preset = this.presets[presetName];
    
    if (!preset) {
      console.error(`未知的网络预设: ${presetName}`);
      return;
    }
    
    // 停止当前模拟
    this.stopSimulation();
    
    // 应用新预设
    this.currentPreset = presetName;
    this.currentConditions = preset;
    
    // 开始模拟
    this.startSimulation(preset);
    
    // 更新横幅
    if (this.config.enableVisualBanner) {
      this.updateVisualBanner();
    }
    
    // 记录切换事件
    this.logPerformanceEvent('network_switched', {
      preset: presetName,
      conditions: preset,
      switchTime: Date.now() - this.startTime
    });
    
    if (this.config.enableConsoleLog) {
      console.log(`🔄 切换到: ${preset.name}`);
      console.log(`  延迟: ${preset.latency}ms`);
      console.log(`  下载: ${(preset.downloadSpeed * 1000 / 1024).toFixed(2)}KB/s`);
      console.log(`  上传: ${(preset.uploadSpeed * 1000 / 1024).toFixed(2)}KB/s`);
    }
    
    return preset;
  }
  
  /**
   * 开始网络模拟
   */
  startSimulation(conditions) {
    const self = this;
    
    // 拦截fetch请求
    window.fetch = async function(input, init = {}) {
      const url = typeof input === 'string' ? input : input.url;
      const method = (init.method || 'GET').toUpperCase();
      
      // 判断是上传还是下载
      const isUpload = method === 'POST' || method === 'PUT' || method === 'PATCH';
      const speed = isUpload ? conditions.uploadSpeed : conditions.downloadSpeed;
      
      // 估计请求大小
      const estimatedSize = init.body ? 
        (typeof init.body === 'string' ? init.body.length : 1024) : 1024;
      
      // 计算延迟
      const transferTime = speed === Infinity ? 0 : estimatedSize / speed;
      const totalDelay = conditions.latency + transferTime;
      
      // 记录请求开始
      const requestId = Math.random().toString(36).substr(2, 9);
      const startTime = Date.now();
      
      self.logPerformanceEvent('request_started', {
        requestId,
        url: url.substring(0, 100),
        method,
        estimatedSize,
        expectedDelay: totalDelay
      });
      
      // 添加延迟
      if (totalDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, totalDelay));
      }
      
      // 模拟网络错误
      if (Math.random() < self.config.errorRate) {
        const errorTime = Date.now() - startTime;
        self.logPerformanceEvent('request_failed', {
          requestId,
          url: url.substring(0, 100),
          error: '模拟网络错误',
          actualTime: errorTime
        });
        
        throw new Error(`NetworkError: 模拟网络失败 (${url})`);
      }
      
      // 调用原始fetch
      try {
        const response = await self.originalFetch.call(this, input, init);
        const endTime = Date.now();
        const actualTime = endTime - startTime;
        
        self.logPerformanceEvent('request_completed', {
          requestId,
          url: url.substring(0, 100),
          status: response.status,
          actualTime,
          expectedTime: totalDelay
        });
        
        return response;
      } catch (error) {
        const errorTime = Date.now() - startTime;
        self.logPerformanceEvent('request_error', {
          requestId,
          url: url.substring(0, 100),
          error: error.message,
          actualTime: errorTime
        });
        
        throw error;
      }
    };
    
    // 拦截图片加载
    window.Image = function() {
      const img = new self.originalImage();
      const originalSrc = Object.getOwnPropertyDescriptor(img, 'src');
      
      Object.defineProperty(img, 'src', {
        set: function(value) {
          const imgUrl = value.substring(0, 50) + (value.length > 50 ? '...' : '');
          const imageId = Math.random().toString(36).substr(2, 9);
          
          self.logPerformanceEvent('image_load_started', {
            imageId,
            url: imgUrl,
            expectedDelay: conditions.latency + 500
          });
          
          // 模拟图片加载延迟
          setTimeout(() => {
            if (originalSrc && originalSrc.set) {
              originalSrc.set.call(img, value);
            }
            
            self.logPerformanceEvent('image_load_completed', {
              imageId,
              url: imgUrl
            });
          }, conditions.latency + 500);
        },
        get: function() {
          return originalSrc && originalSrc.get ? originalSrc.get.call(img) : '';
        }
      });
      
      return img;
    };
    
    // 修改navigator.connection（如果可用）
    if (navigator.connection) {
      this.simulateConnectionAPI(conditions);
    }
  }
  
  /**
   * 停止网络模拟
   */
  stopSimulation() {
    window.fetch = this.originalFetch;
    window.Image = this.originalImage;
    
    // 恢复navigator.connection
    if (navigator.connection && this.originalConnectionProps) {
      Object.keys(this.originalConnectionProps).forEach(key => {
        Object.defineProperty(navigator.connection, key, this.originalConnectionProps[key]);
      });
    }
  }
  
  /**
   * 模拟Connection API
   */
  simulateConnectionAPI(conditions) {
    if (!navigator.connection) return;
    
    // 保存原始属性
    if (!this.originalConnectionProps) {
      this.originalConnectionProps = {};
      ['effectiveType', 'downlink', 'rtt'].forEach(prop => {
        if (prop in navigator.connection) {
          this.originalConnectionProps[prop] = Object.getOwnPropertyDescriptor(navigator.connection, prop);
        }
      });
    }
    
    // 计算effectiveType
    let effectiveType = '4g';
    const speedKbps = conditions.downloadSpeed * 1000 * 8 / 1024;
    
    if (speedKbps < 50) effectiveType = '2g';
    else if (speedKbps < 700) effectiveType = '3g';
    
    // 设置新属性
    Object.defineProperty(navigator.connection, 'effectiveType', {
      value: effectiveType,
      writable: false,
      configurable: true
    });
    
    const downlinkMbps = conditions.downloadSpeed * 1000 * 8 / (1024 * 1024);
    Object.defineProperty(navigator.connection, 'downlink', {
      value: downlinkMbps,
      writable: false,
      configurable: true
    });
    
    Object.defineProperty(navigator.connection, 'rtt', {
      value: conditions.latency,
      writable: false,
      configurable: true
    });
  }
  
  /**
   * 添加可视化横幅
   */
  addVisualBanner() {
    // 移除现有的横幅
    const existingBanner = document.getElementById('weak-network-banner');
    if (existingBanner) {
      existingBanner.remove();
    }
    
    // 创建新横幅
    this.banner = document.createElement('div');
    this.banner.id = 'weak-network-banner';
    this.banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #333;
      color: white;
      padding: 12px 20px;
      text-align: center;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 14px;
      z-index: 999999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    document.body.appendChild(this.banner);
    this.updateVisualBanner();
  }
  
  /**
   * 更新可视化横幅
   */
  updateVisualBanner() {
    if (!this.banner || !this.currentConditions) return;
    
    const conditions = this.currentConditions;
    const elapsed = Date.now() - this.startTime;
    const remaining = this.endTime - Date.now();
    
    const elapsedStr = this.formatTime(elapsed);
    const remainingStr = this.formatTime(remaining);
    
    this.banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${conditions.color};"></div>
        <strong>弱网模拟中: ${conditions.name}</strong>
      </div>
      <div style="font-size: 13px;">
        延迟: ${conditions.latency}ms | 
        下载: ${(conditions.downloadSpeed * 1000 / 1024).toFixed(1)}KB/s | 
        上传: ${(conditions.uploadSpeed * 1000 / 1024).toFixed(1)}KB/s
      </div>
      <div style="font-size: 12px; opacity: 0.8;">
        已运行: ${elapsedStr} | 剩余: ${remainingStr}
      </div>
    `;
    
    this.banner.style.background = conditions.color;
  }
  
  /**
   * 格式化时间
   */
  formatTime(ms) {
    if (ms < 0) return '0:00';
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  /**
   * 初始化性能监控
   */
  initPerformanceMonitoring() {
    // 保存原始性能数据
    this.originalPerformance = {
      timing: performance.timing ? { ...performance.timing } : null,
      navigation: performance.getEntriesByType('navigation')[0] || null
    };
    
    // 清空现有资源记录
    performance.clearResourceTimings();
  }
  
  /**
   * 记录性能事件
   */
  logPerformanceEvent(eventType, data) {
    const event = {
      timestamp: Date.now(),
      eventType,
      data,
      elapsed: Date.now() - this.startTime,
      currentPreset: this.currentPreset
    };
    
    this.performanceLog.push(event);
    
    if (this.config.enableConsoleLog && eventType.includes('request')) {
      console.log(`📡 ${eventType}: ${data.url || ''}`);
    }
  }
  
  /**
   * 停止弱网模拟
   */
  stop() {
    if (!this.simulating) return;
    
    console.log('🛑 停止弱网环境模拟器');
    
    // 清除定时器
    if (this.switchTimer) {
      clearInterval(this.switchTimer);
      this.switchTimer = null;
    }
    
    if (this.durationTimer) {
      clearTimeout(this.durationTimer);
      this.durationTimer = null;
    }
    
    // 停止网络模拟
    this.stopSimulation();
    
    // 移除横幅
    if (this.banner) {
      this.banner.remove();
      this.banner = null;
    }
    
    // 收集最终性能数据
    this.collectFinalPerformance();
    
    // 生成报告
    this.generateReport();
    
    this.simulating = false;
    this.currentPreset = null;
    this.currentConditions = null;
    
    // 记录停止事件
    this.logPerformanceEvent('simulator_stopped', {
      totalDuration: Date.now() - this.startTime,
      totalEvents: this.performanceLog.length
    });
    
    console.log('✅ 弱网模拟已完成');
    console.log(`📊 总事件数: ${this.performanceLog.length}`);
    console.log(`⏱️  总时长: ${((Date.now() - this.startTime) / 1000).toFixed(1)}秒`);
    
    return true;
  }
  
  /**
   * 收集最终性能数据
   */
  collectFinalPerformance() {
    // 收集资源加载数据
    const resources = performance.getEntriesByType('resource');
    this.resourceStats = {
      total: resources.length,
      byType: {},
      totalSize: 0,
      totalTime: 0
    };
    
    resources.forEach(resource => {
      const type = resource.initiatorType || 'other';
      this.resourceStats.byType[type] = (this.resourceStats.byType[type] || 0) + 1;
      this.resourceStats.totalSize += resource.transferSize || 0;
      this.resourceStats.totalTime += resource.duration || 0;
    });
    
    // 收集导航数据
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.navigationStats = {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        requestResponse: navigation.responseEnd - navigation.requestStart,
        domProcessing: navigation.domComplete - navigation.domInteractive,
        pageLoad: navigation.loadEventEnd - navigation.startTime
      };
    }
  }
  
  /**
   * 生成报告
   */
  generateReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // 生成JSON报告
    const report = {
      metadata: {
        simulator: 'Weak Network Simulator',
        version: '1.0.0',
        startTime: new Date(this.startTime).toISOString(),
        endTime: new Date().toISOString(),
        totalDuration: Date.now() - this.startTime,
        config: this.config
      },
      performance: {
        resourceStats: this.resourceStats,
        navigationStats: this.navigationStats,
        eventLog: this.performanceLog
      },
      summary: this.generateSummary()
    };
    
    // 保存到全局变量以便访问
    window.weakNetworkReport = report;
    
    // 控制台输出摘要
    console.log('📋 弱网模拟报告摘要:');
    console.log('='.repeat(50));
    console.log(`总运行时间: ${report.metadata.totalDuration / 1000}秒`);
    console.log(`网络预设切换: ${this.config.presets.length}种`);
    console.log(`总请求数: ${report.performance.resourceStats?.total || 0}`);
    console.log(`总数据量: ${(report.performance.resourceStats?.totalSize / 1024).toFixed(2)}KB`);
    
    // 生成Markdown报告
    const markdownReport = this.generateMarkdownReport(report);
    
    // 提供下载链接
    console.log('\n💾 报告已生成，可通过以下方式访问:');
    console.log('1. JSON报告: window.weakNetworkReport');
    console.log('2. 摘要报告: 查看下面的Markdown格式');
    
    console.log('\n' + markdownReport);
  }
  
  /**
   * 生成摘要
   */
  generateSummary() {
    const summary = {
      totalEvents: this.performanceLog.length,
      requestEvents: this.performanceLog.filter(e => e.eventType.includes('request')).length,
      failedRequests: this.performanceLog.filter(e => 
        e.eventType.includes('request_failed') || e.eventType.includes('request_error')
      ).length,
      networkPresetsUsed: [...new Set(this.performanceLog.map(e => e.currentPreset).filter(Boolean))],
      averageRequestTime: 0
    };
    
    // 计算平均请求时间
    const requestEvents = this.performanceLog.filter(e => 
      e.eventType === 'request_completed' && e.data.actualTime
    );
    
    if (requestEvents.length > 0) {
      const totalTime = requestEvents.reduce((sum, e) => sum + e.data.actualTime, 0);
      summary.averageRequestTime = totalTime / requestEvents.length;
    }
    
    return summary;
  }
  
  /**
   * 生成Markdown报告
   */
  generateMarkdownReport(report) {
    const { metadata, performance, summary } = report;
    
    let markdown = `# 弱网模拟测试报告\n\n`;
    
    markdown += `## 测试概览\n`;
    markdown += `- **测试工具**: ${metadata.simulator} v${metadata.version}\n`;
    markdown += `- **开始时间**: ${new Date(metadata.startTime).toLocaleString()}\n`;
    markdown += `- **结束时间**: ${new Date(metadata.endTime).toLocaleString()}\n`;
    markdown += `- **总时长**: ${(metadata.totalDuration / 1000).toFixed(1)}秒\n`;
    markdown += `- **网络预设**: ${metadata.config.presets.join(', ')}\n`;
    markdown += `- **切换间隔**: ${metadata.config.switchInterval / 1000}秒\n\n`;
    
    markdown += `## 性能摘要\n`;
    markdown += `- **总事件数**: ${summary.totalEvents}\n`;
    markdown += `- **网络请求数**: ${summary.requestEvents}\n`;
    markdown += `- **失败请求数**: ${summary.failedRequests}\n`;
    markdown += `- **失败率**: ${((summary.failedRequests / summary.requestEvents) * 100 || 0).toFixed(1)}%\n`;
    markdown += `- **平均请求时间**: ${summary.averageRequestTime.toFixed(0)}ms\n\n`;
    
    markdown += `## 资源加载统计\n`;
    if (performance.resourceStats) {
      markdown += `- **总资源数**: ${performance.resourceStats.total}\n`;
      markdown += `- **总数据量**: ${(performance.resourceStats.totalSize / 1024).toFixed(2)}KB\n`;
      markdown += `- **总加载时间**: ${performance.resourceStats.totalTime.toFixed(0)}ms\n\n`;
      
      markdown += `### 按类型分布\n`;
      Object.entries(performance.resourceStats.byType).forEach(([type, count]) => {
        markdown += `- ${type}: ${count}个\n`;
      });
      markdown += '\n';
    }
    
    markdown += `## 网络条件使用情况\n`;
    summary.networkPresetsUsed.forEach(preset => {
      const presetConfig = this.presets[preset];
      if (presetConfig) {
        markdown += `### ${presetConfig.name}\n`;
        markdown += `- **延迟**: ${presetConfig.latency}ms\n`;
        markdown += `- **下载速度**: ${(presetConfig.downloadSpeed * 1000 / 1024).toFixed(2)}KB/s\n`;
        markdown += `- **上传速度**: ${(presetConfig.uploadSpeed * 1000 / 1024).toFixed(2)}KB/s\n\n`;
      }
    });
    
    markdown += `## 建议\n`;
    markdown += `1. 在慢速网络下优化图片大小和格式\n`;
    markdown += `2. 实现懒加载以减少初始加载时间\n`;
    markdown += `3. 使用Service Worker缓存关键资源\n`;
    markdown += `4. 考虑实现离线功能\n`;
    markdown += `5. 添加网络状态提示和加载指示器\n`;
    
    return markdown;
  }
  
  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      simulating: this.simulating,
      currentPreset: this.currentPreset,
      currentConditions: this.currentConditions,
      elapsedTime: this.simulating ? Date.now() - this.startTime : 0,
      remainingTime: this.simulating ? this.endTime - Date.now() : 0,
      performanceLogSize: this.performanceLog.length,
      config: this.config
    };
  }
  
  /**
   * 获取性能报告
   */
  getReport() {
    return window.weakNetworkReport || null;
  }
}

// 创建全局实例
window.weakNetworkSimulator = new WeakNetworkSimulator();

// 自动启动（如果URL参数包含）
if (window.location.search.includes('weak-network-test')) {
  setTimeout(() => {
    console.log('🔧 检测到weak-network-test参数，自动启动弱网模拟');
    window.weakNetworkSimulator.start();
  }, 1000);
}

console.log('✅ Weak Network Simulator 已加载');
console.log('📖 使用方法: window.weakNetworkSimulator.start({ duration: 600000 })');