
(function(){
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if(stored === 'light'){ root.classList.add('light'); }
  const btns = document.querySelectorAll('#themeToggle, #themeToggleProduct');
  btns.forEach(btn => {
    if(btn){
      btn.querySelector('.label').textContent = root.classList.contains('light') ? 'Tryb ciemny' : 'Tryb jasny';
      btn.addEventListener('click', ()=>{
        root.classList.toggle('light');
        localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
        btns.forEach(b => b.querySelector('.label').textContent = root.classList.contains('light') ? 'Tryb ciemny' : 'Tryb jasny');
      });
    }
  });
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach(a => { if(a.dataset.page === page){ a.classList.add('active'); } });
})();

async function fetchProducts(){
  const res = await fetch('products.json', {cache:'no-store'});
  if(!res.ok) throw new Error('fetch error');
  return res.json();
}
function matchesFilters(p, f){
  if(f.typ && p.typ !== f.typ) return false;
  if(f.format && p.format !== f.format) return false;
  if(f.kolor && p.kolor !== f.kolor) return false;
  if(f.predkosc){
    const spd = Number(p.predkosc||0);
    if(f.predkosc==='<=25' && !(spd<=25)) return false;
    if(f.predkosc==='26-40' && !(spd>=26 && spd<=40)) return false;
    if(f.predkosc==='>40' && !(spd>40)) return false;
  }
  if(f.q){
    const q = f.q.toLowerCase();
    if(!(p.nazwa||'').toLowerCase().includes(q)) return false;
  }
  return true;
}
function productCard(p){
  return `
    <article class="card product" data-typ="${p.typ}" data-format="${p.format}" data-kolor="${p.kolor}" data-predkosc="${p.predkosc}">
      <h3 class="h6">${p.nazwa}</h3>
      <div class="meta">${p.typ} · ${p.format} · ${p.kolor} · ${p.predkosc} str/min</div>
      <div class="meta">Źródło: <a class="link-underline" href="${p.link}" target="_blank" rel="noopener">BestCan</a></div>
      <div class="mt-2"><a class="btn btn-brand btn-sm" href="produkty/${p.slug}.html">Szczegóły</a></div>
    </article>
  `;
}
async function initKatalog(){
  const mount = document.getElementById('katalogGrid');
  if(!mount) return;
  let items = [];
  try{ items = await fetchProducts(); }catch(e){ mount.innerHTML = '<p class="meta">Nie udało się wczytać katalogu. Sprawdź plik <code>products.json</code>.</p>'; return; }

  const render = () => {
    const f = {
      typ: document.getElementById('f-typ').value,
      format: document.getElementById('f-format').value,
      kolor: document.getElementById('f-kolor').value,
      predkosc: document.getElementById('f-predkosc').value,
      q: document.getElementById('f-q').value.trim()
    };
    const filtered = items.filter(p => matchesFilters(p, f));
    mount.innerHTML = filtered.map(productCard).join('') || '<p class="meta">Brak wyników dla wybranych filtrów.</p>';
  };

  ['f-typ','f-format','f-kolor','f-predkosc'].forEach(id => document.getElementById(id).addEventListener('change', render));
  document.getElementById('f-q').addEventListener('input', render);
  document.getElementById('f-reset').addEventListener('click', () => {
    ['f-typ','f-format','f-kolor','f-predkosc','f-q'].forEach(id => document.getElementById(id).value = '');
    render();
  });

  render();
}
initKatalog();
