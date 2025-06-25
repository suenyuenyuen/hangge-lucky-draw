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

  const saved = localStorage.getItem(`draw_${token}`);
  if (!saved) {
    alert("Invalid or expired draw link.");
    return;
  }

  const record = JSON.parse(saved);
  if (record.drawn) {
    document.getElementById("result").innerHTML = "You have already participated.";
    return;
  }

  const prize = getPrize(amount);
  record.drawn = true;
  record.prize = prize;
  localStorage.setItem(`draw_${token}`, JSON.stringify(record));

  document.getElementById("result").innerHTML =
    `🎊 Congratulations!<br>You won: <strong>${prize}</strong><br><br>
    Thanks for celebrating with us – we’ll be in touch with your prize!`;
}
