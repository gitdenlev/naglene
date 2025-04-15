document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartSummary = document.getElementById("cart-summary");
  const totalQuantityElement = document.getElementById("total-quantity");
  const totalPriceElement = document.getElementById("total-price");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const clearCartButton = document.getElementById("clear-cart-btn");
  const checkoutButton = document.getElementById("checkout-btn");
  // Лічильник в хедері на сторінці кошика
  const cartCountHeaderElement = document.getElementById("cart-count-header");

  // --- Функції для роботи з localStorage (дублюємо або виносимо в окремий модуль) ---
  function getCart() {
    const cartData = localStorage.getItem("shoppingCart");
    try {
      if (cartData && cartData.trim() !== "") {
        const parsedData = JSON.parse(cartData);
        return Array.isArray(parsedData) ? parsedData : [];
      }
    } catch (e) {
      console.error("Помилка розбору кошика з localStorage:", e);
    }
    return [];
  }

  function saveCart(cart) {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    renderCart(); // Перемальовуємо кошик після збереження
    updateCartCounterHeader(); // Оновлюємо лічильник в хедері
  }

  // --- Оновлення лічильника в хедері сторінки кошика ---
  function updateCartCounterHeader() {
    const cart = getCart();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountHeaderElement) {
      cartCountHeaderElement.textContent = totalQuantity;
    }
  }

  // --- Функція рендерингу (відображення) кошика ---
  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = ""; // Очищаємо контейнер перед рендерингом

    if (cart.length === 0) {
      cartSummary.style.display = "none"; // Ховаємо підсумок
      emptyCartMessage.style.display = "block"; // Показуємо повідомлення про порожній кошик
      checkoutButton.disabled = true; // Деактивуємо кнопку оформлення
    } else {
      cartSummary.style.display = "block"; // Показуємо підсумок
      emptyCartMessage.style.display = "none"; // Ховаємо повідомлення про порожній кошик
      checkoutButton.disabled = false; // Активуємо кнопку оформлення

      let totalQuantity = 0;
      let totalPrice = 0;

      cart.forEach((item) => {
        // Створюємо HTML для кожного товару
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>Ціна: $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-change-btn" data-id="${
                          item.id
                        }" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-change-btn" data-id="${
                          item.id
                        }" data-change="1">+</button>
                    </div>
                    <div class="cart-item-price">$${(
                      item.price * item.quantity
                    ).toFixed(2)}</div>
                    <button class="remove-item-btn" data-id="${
                      item.id
                    }" title="Видалити товар">×</button>
                `;
        cartItemsContainer.appendChild(itemElement);

        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
      });

      // Оновлюємо підсумок
      totalQuantityElement.textContent = totalQuantity;
      totalPriceElement.textContent = totalPrice.toFixed(2);

      // Додаємо обробники для кнопок "Видалити" та зміни кількості
      addEventListenersToButtons();
    }
    updateCartCounterHeader(); // Оновлюємо лічильник в хедері після рендеру
  }

  // --- Функція для додавання обробників подій до кнопок ---
  function addEventListenersToButtons() {
    // Кнопки видалення товару
    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      // Спочатку видаляємо старий обробник, щоб уникнути дублювання
      button.replaceWith(button.cloneNode(true));
    });
    // Потім додаємо новий
    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.target.dataset.id;
        removeItem(itemId);
      });
    });

    // Кнопки зміни кількості
    document.querySelectorAll(".quantity-change-btn").forEach((button) => {
      button.replaceWith(button.cloneNode(true));
    });
    document.querySelectorAll(".quantity-change-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.target.dataset.id;
        const change = parseInt(event.target.dataset.change, 10);
        changeQuantity(itemId, change);
      });
    });
  }

  // --- Функції для зміни кошика ---
  function removeItem(itemId) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== itemId); // Залишаємо всі товари, крім видаленого
    saveCart(cart);
  }

  function changeQuantity(itemId, change) {
    let cart = getCart();
    const itemIndex = cart.findIndex((item) => item.id === itemId);

    if (itemIndex > -1) {
      cart[itemIndex].quantity += change;
      // Якщо кількість стала 0 або менше, видаляємо товар
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1); // Видаляємо елемент з масиву
      }
    }
    saveCart(cart);
  }

  function clearCart() {
    // Запитуємо підтвердження
    if (confirm("Ви впевнені, що хочете очистити кошик?")) {
      saveCart([]); // Зберігаємо порожній масив
    }
  }

  // --- Додавання обробників до основних кнопок ---
  if (clearCartButton) {
    clearCartButton.addEventListener("click", clearCart);
  }

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      // Тут буде логіка переходу до оформлення замовлення
      // Вона може включати відправку даних кошика на сервер
      alert("Перехід до сторінки оформлення (не реалізовано)");
      // Наприклад, можна зібрати дані і відправити POST-запит
      // const cartData = getCart();
      // fetch('/api/checkout', { method: 'POST', body: JSON.stringify(cartData), headers: {'Content-Type': 'application/json'} }) ...
    });
  }

  // --- Перший рендеринг кошика при завантаженні сторінки ---
  renderCart();
});
