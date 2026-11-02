const formatBRL = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const toggle = document.querySelector('.menu-toggle'), nav = document.querySelector('.nav'), bag = document.querySelector('.bag'), badge = document.querySelector('.bag b');
const cart = document.querySelector('.cart'), cartItems = document.querySelector('.cart-items'), cartTotal = document.querySelector('.cart-total'), checkout = document.querySelector('.checkout'), panel = document.querySelector('.checkout-panel'), form = document.querySelector('.checkout-form');
let items = JSON.parse(localStorage.getItem('cells-cart') || '[]');
const saveCart = () => localStorage.setItem('cells-cart', JSON.stringify(items));
const total = () => items.reduce((sum, item) => sum + item.price * item.quantity, 0);
function renderCart() {
  badge.textContent = items.reduce((sum, item) => sum + item.quantity, 0);
  cart.classList.toggle('empty', !items.length);
  cartItems.innerHTML = items.map((item, index) => `<div class="cart-item"><div><h3>${item.product}</h3><p>${formatBRL(item.price)} por unidade</p><div class="qty"><button data-change="-1" data-index="${index}" aria-label="Diminuir">−</button><span>${item.quantity}</span><button data-change="1" data-index="${index}" aria-label="Aumentar">+</button></div></div><div><strong>${formatBRL(item.price * item.quantity)}</strong><br><button class="remove" data-remove="${index}">Remover</button></div></div>`).join('');
  cartTotal.textContent = formatBRL(total()); document.querySelector('.checkout-total strong').textContent = formatBRL(total()); checkout.disabled = !items.length;
}
function openCart() { document.body.classList.add('cart-open'); cart.setAttribute('aria-hidden', 'false'); }
function closeCart() { document.body.classList.remove('cart-open'); cart.setAttribute('aria-hidden', 'true'); }
function closeCheckout() { document.body.classList.remove('checkout-open'); panel.setAttribute('aria-hidden', 'true'); }
toggle?.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
bag.addEventListener('click', openCart); document.querySelector('.cart-close').addEventListener('click', closeCart);
document.querySelector('.shop-overlay').addEventListener('click', () => { closeCart(); closeCheckout(); }); document.querySelector('.continue-shopping').addEventListener('click', closeCart);
document.querySelectorAll('.add').forEach(button => button.addEventListener('click', () => { const product = button.dataset.product, price = Number(button.dataset.price), existing = items.find(item => item.product === product); existing ? existing.quantity += 1 : items.push({ product, price, quantity: 1 }); saveCart(); renderCart(); openCart(); }));
cartItems.addEventListener('click', event => { const index = Number(event.target.dataset.index ?? event.target.dataset.remove); if (Number.isNaN(index)) return; if (event.target.dataset.remove !== undefined) items.splice(index, 1); else { items[index].quantity += Number(event.target.dataset.change); if (items[index].quantity < 1) items.splice(index, 1); } saveCart(); renderCart(); });
checkout.addEventListener('click', () => { if (items.length) { closeCart(); document.body.classList.add('checkout-open'); panel.setAttribute('aria-hidden', 'false'); } });
document.querySelector('.checkout-back').addEventListener('click', () => { closeCheckout(); openCart(); }); document.querySelector('.checkout-close').addEventListener('click', closeCheckout);
form.addEventListener('submit', event => { event.preventDefault(); document.querySelector('.order-code').textContent = `#CELLS${Math.floor(Math.random() * 90000 + 10000)}`; items = []; saveCart(); renderCart(); closeCheckout(); document.body.classList.add('success-open'); });
document.querySelector('.done-shopping').addEventListener('click', () => document.body.classList.remove('success-open'));
renderCart();
