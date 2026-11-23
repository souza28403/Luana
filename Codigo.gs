// Cole este código em script.google.com (Novo projeto) — ele roda na SUA conta
// e cria o encontro direto no seu Google Agenda quando ela confirma no site.

const TITULO = 'Nosso encontro 💘';
const DURACAO_HORAS = 3;

function doGet(e) {
  const p = e.parameter || {};
  let texto = '';

  if (p.inicio) {
    const inicio = new Date(p.inicio);               // ex: 2026-11-26T18:00:00-03:00
    if (!isNaN(inicio)) {
      const props = PropertiesService.getScriptProperties();
      const lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        // Se ela já tinha escolhido outra data, apaga a anterior (assim "Trocar a data" funciona)
        if (props.getProperty('ultimoInicio') !== p.inicio) {
          const antigo = props.getProperty('ultimoEventoId');
          if (antigo) {
            const ev = CalendarApp.getDefaultCalendar().getEventById(antigo);
            if (ev) ev.deleteEvent();
          }
          const fim = new Date(inicio.getTime() + DURACAO_HORAS * 3600 * 1000);
          const novo = CalendarApp.getDefaultCalendar().createEvent(TITULO, inicio, fim, {
            description: 'Ela disse sim! Data escolhida por ela no site. 🐱💐'
          });
          novo.addPopupReminder(24 * 60);  // lembrete 1 dia antes
          novo.addPopupReminder(120);      // lembrete 2 horas antes
          props.setProperties({ ultimoInicio: p.inicio, ultimoEventoId: novo.getId() });
        }
      } finally {
        lock.releaseLock();
      }
      texto = p.txt || '';
    }
  }

  const t = HtmlService.createTemplate(PAGINA);
  t.texto = texto;
  return t.evaluate()
    .setTitle('Combinado! 💘')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

const PAGINA = `
<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap" rel="stylesheet">
<style>
body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:#ffe1e8;color:#4a1030;font-family:Fredoka,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
.h{font-size:96px;line-height:1;animation:b 1.4s ease-in-out infinite}
@keyframes b{50%{transform:scale(1.12)}}
h1{font-size:40px;margin:16px 0 8px}
p{font-size:24px;color:#d6245f;margin:0 0 10px}
small{font-size:17px;color:#8a4a66}
</style></head><body>
<div class="h">💖</div>
<h1>Combinado!</h1>
<p><?= texto ?></p>
<small>Mal posso esperar 😽</small>
</body></html>`;
