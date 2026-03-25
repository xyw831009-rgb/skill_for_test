# 如何将弱网模拟器Skill推送到GitHub

## 📦 已完成的准备工作

我已经在 `weak-network-simulator` 目录中初始化了Git仓库，并提交了所有文件。现在你需要手动推送到你的GitHub仓库。

## 🚀 推送步骤

### 步骤1：进入目录
```bash
cd weak-network-simulator
```

### 步骤2：添加远程仓库
```bash
git remote add origin https://github.com/xyw831009-rgb/skill_for_test.git
```

### 步骤3：推送到GitHub
```bash
git push -u origin main
```

**注意**：如果 `main` 分支不存在，可能需要先创建：
```bash
git branch -M main
git push -u origin main
```

## 🔑 认证方式

### 方式A：使用HTTPS（需要用户名和密码/令牌）
1. 执行 `git push` 命令
2. 系统会提示输入用户名和密码
3. **重要**：GitHub不再接受账户密码，需要使用Personal Access Token (PAT)
   - 前往 GitHub → Settings → Developer settings → Personal access tokens
   - 生成新的token（选择 repo 权限）
   - 使用token作为密码

### 方式B：使用SSH（推荐）
1. 首先配置SSH密钥：
   ```bash
   # 检查是否有SSH密钥
   ls -la ~/.ssh/
   
   # 如果没有，生成新的SSH密钥
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

2. 将公钥添加到GitHub：
   ```bash
   # 复制公钥
   cat ~/.ssh/id_ed25519.pub
   ```
   - 前往 GitHub → Settings → SSH and GPG keys
   - 点击 "New SSH key"
   - 粘贴公钥内容

3. 修改远程仓库URL为SSH：
   ```bash
   git remote set-url origin git@github.com:xyw831009-rgb/skill_for_test.git
   ```

4. 推送：
   ```bash
   git push -u origin main
   ```

## 📁 文件结构

推送后，你的GitHub仓库将包含以下文件：

```
skill_for_test/
├── weak-network-simulator/
│   ├── SKILL.md                    # Skill说明文档
│   ├── weak-network-simulator.js   # 核心模拟器脚本
│   ├── example.html                # 可视化测试页面
│   ├── README.md                   # 详细使用文档
│   ├── PUSH_TO_GITHUB.md           # 本指南
│   └── .git/                       # Git仓库数据
└── README.md                       # 仓库主README
```

## 🌐 访问你的Skill

推送成功后，可以通过以下URL访问：

- **GitHub仓库**: https://github.com/xyw831009-rgb/skill_for_test
- **Skill目录**: https://github.com/xyw831009-rgb/skill_for_test/tree/main/weak-network-simulator
- **原始JS文件**: https://raw.githubusercontent.com/xyw831009-rgb/skill_for_test/main/weak-network-simulator/weak-network-simulator.js

## 🧪 快速测试

你可以在任何网页中通过以下代码测试：

```javascript
// 直接从GitHub加载
const script = document.createElement('script');
script.src = 'https://raw.githubusercontent.com/xyw831009-rgb/skill_for_test/main/weak-network-simulator/weak-network-simulator.js';
document.head.appendChild(script);

script.onload = () => {
  // 启动2分钟测试
  window.weakNetworkSimulator.start({
    duration: 2 * 60 * 1000,
    presets: ['3g-slow', '4g', 'extreme-slow'],
    switchInterval: 30 * 1000
  });
};
```

## 🔧 后续维护

### 更新Skill
```bash
# 1. 修改文件
# 2. 提交更改
git add .
git commit -m "feat: update feature description"
# 3. 推送
git push
```

### 添加新功能
```bash
# 1. 创建新分支
git checkout -b new-feature
# 2. 开发并提交
git add .
git commit -m "feat: add new feature"
# 3. 推送到GitHub
git push -u origin new-feature
# 4. 在GitHub创建Pull Request
```

## ❓ 常见问题

### Q1: 推送时出现 "Permission denied" 错误
**解决方案**:
- 检查SSH密钥是否正确配置
- 或使用HTTPS + Personal Access Token

### Q2: 分支名称冲突
**解决方案**:
```bash
# 重命名本地分支
git branch -M main
# 强制推送（首次）
git push -u origin main --force
```

### Q3: 想推送到其他分支
```bash
# 推送到特定分支
git push -u origin main:weak-network-simulator
```

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看GitHub文档：https://docs.github.com
2. 检查Git配置：`git config --list`
3. 查看Git状态：`git status`
4. 查看远程仓库：`git remote -v`

---

**推送命令总结**:
```bash
cd weak-network-simulator
git remote add origin https://github.com/xyw831009-rgb/skill_for_test.git
git branch -M main
git push -u origin main
```

祝你推送顺利！ 🚀