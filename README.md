# 德州扑克学习驾驶舱

一个本地运行的德州扑克学习 MVP，包含学习路径、训练中心、手牌复盘和资源库。

## 使用方法

在 PowerShell 中运行：

```powershell
.\scripts\serve.ps1
```

然后打开 `http://localhost:5173/`。

如果 PowerShell 阻止脚本执行，可以改用：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve.ps1
```

## 测试

启动本地服务器后打开 `http://localhost:5173/tests.html`，确认所有测试显示 PASS。

## 数据备份

页面右上角可以导出当前学习数据为 JSON。导入 JSON 时会先显示课程、训练、错题和复盘数量，确认后才会替换当前本地数据。

## 范围说明

本工具用于学习和复盘，不接入真钱平台，不提供实时对局建议，不复制付费课程内容。
