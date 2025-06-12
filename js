// ====== Основные функции ======

// Инициализация данных пользователя Telegram
async function confirmPayment(userId, amount, currency) {
  try {
    const initData = window.Telegram.WebApp.initData;
    const response = await fetch('https://your-server.com/payment-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initData,
        amount,
        currency,
        userId
      })
    });

    const result = await response.json();
    if (result.success) {
      alert('Платеж успешно обработан!');
    } else {
      alert('Ошибка при обработке платежа');
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Ошибка соединения с сервером');
  }
}

function initTelegramUser() {
  if (window.Telegram && window.Telegram.WebApp) {
    const tgUser = window.Telegram.WebApp.initDataUnsafe.user;

    if (tgUser) {
      // Устанавливаем аватар (если есть photo_url или используем стандартный шаблон)
      const avatarUrl = tgUser.photo_url || `https://t.me/i/userpic/320/${tgUser.username}.jpg`;
      document.querySelector(".profile-pic").src = avatarUrl;

      // Устанавливаем имя пользователя
      const userName = tgUser.first_name || "Пользователь";
      document.querySelector(".profile-name").textContent = userName;

      // Устанавливаем ID (если есть)
      if (tgUser.id) {
        document.querySelector(".profile-id").textContent = `#${tgUser.id}`;
      }

      // Развернуть WebApp на весь экран (опционально)
      window.Telegram.WebApp.expand();
    }
  }
}

// Переключение вкладок
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = [
    document.getElementById('tab-wallet'),
    document.getElementById('tab-market'),
    document.getElementById('tab-partnership') // Убрали вкладку "Чеки"
  ];

  tabBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      tabPanels[i].classList.add('active');
    });
  });
}

// Копирование реферальной ссылки
function setupRefLink() {
  const copyBtn = document.querySelector('.partner-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const link = document.getElementById('ref-link').innerText;
      navigator.clipboard.writeText(link)
        .then(() => alert('Ссылка скопирована!'))
        .catch(() => alert('Ошибка копирования'));
    });
  }
}

// Управление модальными окнами
function setupModals() {
  // Открытие модалки пополнения TON
  const topupBtn = document.getElementById('topup-ton-btn');
  if (topupBtn) {
    topupBtn.addEventListener('click', () => {
      document.getElementById('ton-modal-bg').classList.add('active');
      document.getElementById('tonAmount').focus();
    });
  }

  // Закрытие модалки
  document.getElementById('ton-modal-bg').addEventListener('click', (e) => {
    if (e.target === document.getElementById('ton-modal-bg')) {
      closeModal();
    }
  });

  // Закрытие по кнопке
  const closeBtn = document.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
}

// Закрытие модалки
function closeModal() {
  document.getElementById('ton-modal-bg').classList.remove('active');
  document.getElementById('tonAmount').value = '';
}

// Пополнение баланса через TON
function setupTonPayment() {
  const payBtn = document.querySelector('.modal-pay-btn');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      const address = 'EQCbaFt3eQy4r7e3Qq1XOyW2N9l5nQvJ2Aiy8G4VZpQkL1bh'; // Замените на ваш TON-адрес
      const amount = parseFloat(document.getElementById('tonAmount').value);
      const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
      if (isNaN(amount) || amount < 0.01) {
        alert('Минимальная сумма — 0.01 TON');
        return;
      }

      // Эмуляция успешной оплаты (в реальном проекте здесь будет вызов TON API)
      setTimeout(() => {
        confirmPayment(userId, amount, 'TON');
      }, 1500);
      const nanoAmpunt = Math.round(amount * 1e9)
      window.open(`https://app.tonkeeper.com/transfer/${address}?amount=${amount * 1e9}`, '_blank');
      closeModal();
    });
  }
}
// ====== Запуск всех функций ======
document.addEventListener('DOMContentLoaded', () => {
  initTelegramUser(); // Загружаем данные пользователя
  setupTabs();        // Настраиваем вкладки
  setupRefLink();     // Копирование рефералки
  setupModals();      // Управление модалками
  setupTonPayment();  // Пополнение через TON
});
