(function () {
  function toast(t) {
    var el = document.getElementById('toast'); el.textContent = t; el.classList.add('on');
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 3500);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-burger]');
    if (b) { var n = document.getElementById('nav'); n.classList.toggle('open'); b.setAttribute('aria-expanded', n.classList.contains('open')); return; }
    var m = e.target.closest('[data-mod]');
    if (m) { var box = m.parentNode; box.classList.toggle('open'); m.setAttribute('aria-expanded', box.classList.contains('open')); return; }
    var tier = e.target.closest('[data-tier]');
    if (tier) { var msg = document.querySelector('#apply [name=msg]'); if (msg) msg.value = 'Интересует тариф: ' + tier.dataset.tier + '\n'; return; }
    var s = e.target.closest('[data-send]');
    if (s) { e.preventDefault(); send(s.closest('form'), s.dataset.send === 'wa'); }
  });
  function send(form, wa) {
    var d = new FormData(form);
    if (!String(d.get('name') || '').trim()) { form.querySelector('[name=name]').focus(); toast('Укажите имя'); return; }
    var text = 'Здравствуйте, Елена! Заявка с сайта: ' + form.dataset.ctx + '\nИмя: ' + d.get('name') + '\nГород: ' + (d.get('city') || '—') + '\nСитуация: ' + d.get('stage') + (d.get('msg') ? '\n' + d.get('msg') : '');
    var url;
    if (wa) url = 'https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(text);
    else {
      url = form.dataset.tg;
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast('Текст заявки скопирован — вставьте его в чат'); }, function () {});
    }
    window.open(url, '_blank', 'noopener');
  }
})();
