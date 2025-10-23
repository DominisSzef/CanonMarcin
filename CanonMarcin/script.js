
// mark active nav based on data-page attribute
(() => {
  const page = document.body.dataset.page;
  if(!page) return;
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    if (a.dataset.page === page) a.classList.add('active');
  });
})();

// simple filter on katalog page
function applyFilters(){
  const form = Object.fromEntries(new FormData(document.getElementById('filters')).entries());
  document.querySelectorAll('.product').forEach(el => {
    const ok = ['kategoria','predkosc','format','kolor'].every(k => !form[k] || (
      k==='predkosc' ? (form[k]==='41' ? Number(el.dataset[k])>40 : Number(el.dataset[k])<=Number(form[k])) : el.dataset[k]===form[k]
    ));
    el.classList.toggle('d-none', !ok);
  });
}
window.applyFilters = applyFilters;
