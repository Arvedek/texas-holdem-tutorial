export const quickReferenceCards = [
  {
    id: "hand-rankings",
    title: "牌型强弱",
    whenToUse: "摊牌、估算价值下注、判断自己是不是只拿着看起来好看的弱牌时使用。",
    items: [
      { label: "皇家同花顺", detail: "A-K-Q-J-T 同花，最强牌型。" },
      { label: "同花顺 / 四条 / 葫芦", detail: "极强牌。面对大底池通常重点想怎么拿价值。" },
      { label: "同花 / 顺子 / 三条", detail: "强牌但会受公共牌结构影响；成对牌面里的同花不是坚果。" },
      { label: "两对 / 一对 / 高牌", detail: "常见摊牌牌力。顶对在多人底池和湿润牌面要降级。" }
    ]
  },
  {
    id: "positions",
    title: "位置缩写",
    whenToUse: "看范围表、训练题和复盘时先定位自己与对手的位置。",
    items: [
      { label: "UTG / UTG+1", detail: "最早行动位置，范围最紧；9 人桌尤其要谨慎。" },
      { label: "LJ / HJ / CO", detail: "中后位，越靠近按钮越能扩大开池和偷盲范围。" },
      { label: "BTN", detail: "按钮位，翻后最后行动，是最赚钱的位置。" },
      { label: "SB / BB", detail: "盲位翻前已投入筹码，但翻后通常没位置，不能因为便宜就乱跟。" }
    ]
  },
  {
    id: "range-notation",
    title: "范围写法",
    whenToUse: "看 A7s+、98s-65s、22+、AQo+ 这种范围密码时使用。",
    items: [
      { label: "s / o", detail: "s 是 suited 同花，o 是 offsuit 非同花；AKs 和 AKo 是不同组合。" },
      { label: "+", detail: "A7s+ 表示 A7s、A8s、A9s 直到 AKs；22+ 表示所有口袋对子。" },
      { label: "-", detail: "98s-65s 表示连续同花连接牌：98s、87s、76s、65s。" },
      { label: "组合数", detail: "同花非对子 4 组，非同花 12 组，口袋对子 6 组。" }
    ]
  },
  {
    id: "pot-odds",
    title: "赔率速算",
    whenToUse: "面对下注想追听牌时，先算价格再决定跟不跟。",
    items: [
      { label: "底池赔率", detail: "跟注额 / 跟注后总底池。对手下注 50 到 100，跟 50 争 200，价格 25%。" },
      { label: "outs", detail: "能让你明显领先的牌。坚果同花听牌通常 9 outs，开放顺听 8 outs。" },
      { label: "2/4 法则", detail: "一张牌约 outs x 2%，两张牌约 outs x 4%，只是快速估算。" },
      { label: "隐含赔率", detail: "价格不够时，只有未来还能赢到更多且对手会付钱，跟注才可能成立。" }
    ]
  },
  {
    id: "postflop-decision",
    title: "翻后决策",
    whenToUse: "翻牌、转牌、河牌不知道下注还是过牌时使用。",
    items: [
      { label: "我下注为了什么", detail: "价值、诈唬、保护、实现权益。说不出目的就先放慢。" },
      { label: "牌面对谁更有利", detail: "高张干燥面常偏翻前进攻者，低张连张面常更照顾跟注者范围。" },
      { label: "多人底池降频", detail: "对手越多，诈唬成功率越低，价值下注门槛越高。" },
      { label: "河牌先问两句", detail: "更差牌会不会跟？更好牌会不会弃？两个都否定就别硬下注。" }
    ]
  },
  {
    id: "danger-lines",
    title: "危险信号",
    whenToUse: "感觉自己想用情绪、侥幸或面子做决定时使用。",
    items: [
      { label: "只因为已经投钱而跟注", detail: "这是沉没成本。已经投入的筹码不属于你，重新看价格和胜率。" },
      { label: "用顶对打所有大底池", detail: "顶对不是自动全下牌，尤其在多人底池、成顺成花牌面。" },
      { label: "盲位过度防守", detail: "大盲折扣不等于随便玩；没位置会降低权益实现。" },
      { label: "输一手后马上升级别", detail: "这是心态漏洞。先暂停、记录手牌、回到学习计划。" }
    ]
  }
];
