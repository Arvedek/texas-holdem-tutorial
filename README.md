# 德州扑克学习驾驶舱

一个本地运行的德州扑克学习 MVP，面向新手到进阶入门阶段。它把学习路径、短题训练、错题本、手牌复盘、术语表、翻前范围参考和资源库放在同一个驾驶舱里。

当前版本加入了 Education & Retention Pack：

- 教材式学习路径：每节课包含目标、正文讲解、牌桌例子、判断流程、误区详解、小测验和下一步动作。
- 新手模式：课程内显示白话解释、牌桌例子、为什么重要、微清单和鼓励语。
- 正反馈系统：XP、等级、连续学习、徽章、今日任务和技能掌握度。
- 翻前范围：6-max UTG/HJ/CO/BTN/SB/BB 新人默认参考。
- 术语表：范围、位置、3-bet、SPR、底池赔率、阻断牌等常见概念的简单解释。
- 训练小结：连续答题后显示本轮准确率、强项、弱项和下一步建议。
- 复盘闭环：错题掌握、手牌复盘和每日任务都会记录进度。

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

也可以运行静态服务器 smoke test：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

## 数据备份

页面右上角可以导出当前学习数据为 JSON。导入 JSON 时会先显示课程、训练、错题和复盘数量，确认后才会替换当前本地数据。

## 范围说明

本工具用于学习和复盘，不接入真钱平台，不提供实时对局建议，不复制付费课程内容。翻前范围和训练反馈是教学参考，应该根据桌况、对手和筹码深度继续调整。
