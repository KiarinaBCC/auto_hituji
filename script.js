let countingInterval = null;

function numberToKanji(num) {
  const kanjiNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const kanjiTens = ['', '十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
  if (num < 10) {
    return kanjiNumbers[num];
  } else if (num === 10) {
    return '十';
  } else if (num < 20) {
    return '十' + (num % 10 === 0 ? '' : kanjiNumbers[num % 10]);
  } else if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return kanjiTens[tens] + (ones === 0 ? '' : kanjiNumbers[ones]);
  } else {
    return num.toString();
  }
}

const synth = window.speechSynthesis;
if (!synth) {
  document.getElementById('output').textContent = 'このブラウザは音声合成をサポートしていません。';
}

function startCounting() {
  stopCounting();
  const startCount = parseInt(document.getElementById('startCount').value);
  const maxCount = parseInt(document.getElementById('maxCount').value);
  const interval = parseFloat(document.getElementById('interval').value) * 1000;
  if (isNaN(startCount) || isNaN(maxCount) || isNaN(interval)) {
    document.getElementById('output').textContent = '有効な数値を入力してください。';
    if (synth) {
      const utterance = new SpeechSynthesisUtterance('有効な数値を入力してください');
      utterance.lang = 'ja-JP';
      synth.speak(utterance);
    }
    return;
  }
  if (startCount > maxCount) {
    document.getElementById('output').textContent = '初期羊数は上限以下にしてください。';
    if (synth) {
      const utterance = new SpeechSynthesisUtterance('初期羊数は上限以下にしてください');
      utterance.lang = 'ja-JP';
      synth.speak(utterance);
    }
    return;
  }
  if (interval < 100) {
    document.getElementById('output').textContent = '間隔は0.1秒以上にしてください。';
    if (synth) {
      const utterance = new SpeechSynthesisUtterance('間隔は0.1秒以上にしてください');
      utterance.lang = 'ja-JP';
      synth.speak(utterance);
    }
    return;
  }
  if (synth) {
    const startUtterance = new SpeechSynthesisUtterance('自動羊睡眠プログラムを開始します');
    startUtterance.lang = 'ja-JP';
    startUtterance.onend = () => {
      let currentCount = startCount;
      document.getElementById('output').textContent = `羊が${numberToKanji(currentCount)}匹`;
      if (synth) {
        const utterance = new SpeechSynthesisUtterance(`羊が${numberToKanji(currentCount)}匹`);
        utterance.lang = 'ja-JP';
        synth.speak(utterance);
      }
      countingInterval = setInterval(() => {
        currentCount++;
        if (currentCount > maxCount) {
          document.getElementById('output').textContent = `羊が${numberToKanji(maxCount)}匹に到達しました！`;
          if (synth) {
            const utterance = new SpeechSynthesisUtterance(`羊が${numberToKanji(maxCount)}匹に到達しました`);
            utterance.lang = 'ja-JP';
            synth.speak(utterance);
          }
          clearInterval(countingInterval);
          countingInterval = null;
          return;
        }
        document.getElementById('output').textContent = `羊が${numberToKanji(currentCount)}匹`;
        if (synth) {
          const utterance = new SpeechSynthesisUtterance(`羊が${numberToKanji(currentCount)}匹`);
          utterance.lang = 'ja-JP';
          synth.speak(utterance);
        }
      }, interval);
    };
    synth.speak(startUtterance);
  } else {
    let currentCount = startCount;
    document.getElementById('output').textContent = `羊が${numberToKanji(currentCount)}匹`;
    countingInterval = setInterval(() => {
      currentCount++;
      if (currentCount > maxCount) {
        document.getElementById('output').textContent = `羊が${numberToKanji(maxCount)}匹に到達しました！`;
        clearInterval(countingInterval);
        countingInterval = null;
        return;
      }
      document.getElementById('output').textContent = `羊が${numberToKanji(currentCount)}匹`;
    }, interval);
  }
}

function stopCounting() {
  if (countingInterval) {
    clearInterval(countingInterval);
    countingInterval = null;
    document.getElementById('output').textContent = 'カウントを停止しました。';
    if (synth) {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance('カウントを停止しました');
      utterance.lang = 'ja-JP';
      synth.speak(utterance);
    }
  }
}
