function notifyTelegram(message) {
    fetch("https://backend-lp-tsa.onrender.com/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Disparo realizado", data);
        })
        .catch(err => console.error("Erro ao disparar:", err));
}


function notifyTelegramAndRedirect(event, message, url) {
    event.preventDefault(); // Impede o redirecionamento imediato

    fetch("https://backend-lp-tsa.onrender.com/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message })
    })
        .then(() => {
            window.location.href = url; // Redireciona após envio
        })
        .catch((error) => {
            console.error("Erro ao enviar mensagem:", error);
            window.location.href = url; // Ainda redireciona em caso de erro
        });
}