// draw.js

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function weightedRandom(prizes) {
  const totalWeight = prizes.reduce((sum, item) => sum + item.weight, 0);
  const rand = Math.random() * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < prizes.length; i++) {
    cumulative += prizes[i].weight;
    if (rand < cumulative) return prizes[i].name;
  }
  return prizes[0].name;
}

function getPrize(amount) {
  for (let i = 0; i < prizePools.length; i++) {
    const pool = prizePools[i];
    const min = pool.min;
    const max = pool.max ?? Infinity;
    if (amount >= min && amount < max) {
      return weightedRandom(pool.prizes);
    }
  }
  return "Thank You";
}

function startDraw() {
  const token = getQueryParam("token");
  const name = getQueryParam("name");
  const amount = parseFloat(getQueryParam("amount"));

  if (!token || !amount || isNaN(amount)) {
    alert("Missing or invalid draw link.");
    return;
  }

  // 自动初始化记录（新逻辑）
  const existing = localStorage.getItem(`draw_${token}`);
  if (!existing) {
    const initial = {
      customer: name || "Guest",
      amount: amount,
      drawn: false,
      prize: null
    };
    localStorage.setItem(`draw_${token}`, JSON.stringify(initial));
  }

  const record = JSON.parse(localStorage.getItem(`draw_${token}`));

  if (record.drawn) {
    document.getElementById("giftBox").innerHTML = "🎉";
    document.getElementById("clickTip").style.display = "none";
    document.getElementById("result").innerHTML =
      "🎁 Already opened!<br>You got: <strong>" + record.prize + "</strong>";
    return;
  }

  const prize = getPrize(amount);
  record.drawn = true;
  record.prize = prize;
  localStorage.setItem(`draw_${token}`, JSON.stringify(record));

  // 显示结果
  document.getElementById("giftBox").style.pointerEvents = "none";
  document.getElementById("giftBox").innerHTML = "🎉";
  document.getElementById("clickTip").style.display = "none";
  document.getElementById("result").innerHTML =
    `🎊 Congratulations!<br>You won: <strong>${prize}</strong><br><br>
    Thanks for celebrating with us – we’ll be in touch with your prize!`;
}
