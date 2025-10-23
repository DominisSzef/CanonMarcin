
(function(){
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if(stored === 'light'){ root.classList.add('light'); }
  const btn = document.getElementById('themeToggle');
  if(btn){
    btn.querySelector('.label').textContent = root.classList.contains('light') ? 'Tryb ciemny' : 'Tryb jasny';
    btn.addEventListener('click', ()=>{
      root.classList.toggle('light');
      localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
      btn.querySelector('.label').textContent = root.classList.contains('light') ? 'Tryb ciemny' : 'Tryb jasny';
    });
  }
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach(a => { if(a.dataset.page === page){ a.classList.add('active'); } });
})();

async function renderKatalog(){
  const mount = document.getElementById('katalogGrid');
  if(!mount) return;
  try{
    const res = await fetch('products.json', {cache:'no-store'});
    const items = await res.json();
    mount.innerHTML = items.map(p => `
      <article class="card product" data-kategoria="${p.kategoria||''}" data-format="${p.format||''}" data-kolor="${p.kolor||''}" data-predkosc="${p.predkosc||''}">
        <h3 class="h6">${p.nazwa}</h3>
        <div class="meta">${p.kategoria||''} · ${p.format||''} · ${p.kolor||''}${p.predkosc? ' · '+p.predkosc+' str/min':''}</div>
        <div class="meta">Źródło: <a class="link-underline" href="${p.link}" target="_blank" rel="noopener">BestCan</a></div>
        <div class="mt-2"><a class="btn btn-brand btn-sm" href="produkty/${p.slug}.html">Szczegóły</a></div>
      </article>
    `).join('');
  }catch(e){
    mount.innerHTML = '<p class="meta">Nie udało się wczytać katalogu. Sprawdź plik <code>products.json</code>.</p>';
  }
}
renderKatalog();
