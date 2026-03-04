const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-lp-tsa.onrender.com';

export async function notifyTelegram(message: string): Promise<void> {
  try {
    await fetch(`${API_URL}/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
  } catch (err) {
    console.error('Erro ao enviar notificação Telegram:', err);
  }
}

export async function notifyTelegramAndRedirect(message: string, url: string): Promise<void> {
  try {
    await fetch(`${API_URL}/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
  } catch (err) {
    console.error('Erro ao enviar notificação Telegram:', err);
  }
  window.location.href = url;
}

export async function trackAccess(page: string): Promise<void> {
  try {
    await fetch(`${API_URL}/track-access-${page}`);
  } catch (err) {
    console.error('Erro ao rastrear acesso:', err);
  }
}

export async function wakeUpServer(): Promise<void> {
  try {
    await fetch(API_URL);
  } catch (err) {
    console.warn('Erro ao ativar Render:', err);
  }
}

export { API_URL };
