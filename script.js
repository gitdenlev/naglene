// Це правильний код для script.js (для сторінки з товарами)

document.addEventListener("DOMContentLoaded", () => {
  // Знаходимо елементи: кнопки, лічильник, контейнер кошика
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartCountElement = document.getElementById("cart-count");
  const cartContainer = document.getElementById("cart-container"); // Опціонально, для стилізації

  // --- Функції для роботи з localStorage ---

  /**
   * Отримує масив товарів кошика з localStorage.
   * @returns {Array} Масив об'єктів товарів або порожній масив.
   */
  function getCart() {
    const cartData = localStorage.getItem("shoppingCart"); // Використовуємо ключ 'shoppingCart'
    try {
      // Перевіряємо, чи є дані і чи це не просто null або порожній рядок
      if (cartData && cartData.trim() !== "") {
        const parsedData = JSON.parse(cartData);
        // Переконуємося, що розпарсені дані є масивом
        return Array.isArray(parsedData) ? parsedData : [];
      }
    } catch (e) {
      console.error("Помилка розбору кошика з localStorage:", e);
      // Якщо сталася помилка при розборі JSON, повертаємо порожній кошик
    }
    // Якщо даних немає або сталася помилка, повертаємо порожній масив
    return [];
  }

  /**
   * Зберігає поточний стан кошика (масив товарів) у localStorage.
   * @param {Array} cart - Масив об'єктів товарів для збереження.
   */
  function saveCart(cart) {
    try {
      localStorage.setItem("shoppingCart", JSON.stringify(cart)); // Зберігаємо як JSON-рядок
      updateCartCounter(); // Оновлюємо лічильник після кожного збереження
    } catch (e) {
      console.error("Помилка збереження кошика у localStorage:", e);
      // Можна сповістити користувача, якщо localStorage переповнений або недоступний
      alert("Не вдалося зберегти кошик. Можливо, сховище переповнене.");
    }
  }

  /**
   * Додає товар до кошика або оновлює його кількість.
   * @param {Object} item - Об'єкт товару з {id, name, price, image}.
   */
  function addItemToCart(item) {
    let cart = getCart(); // Отримуємо поточний кошик
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      // Якщо товар вже є в кошику, збільшуємо його кількість
      cart[existingItemIndex].quantity += 1;
      console.log(
        `Кількість товару "${item.name}" збільшено до ${cart[existingItemIndex].quantity}.`
      );
    } else {
      // Якщо товару немає, додаємо його до кошика з кількістю 1
      item.quantity = 1;
      cart.push(item);
      console.log(`Товар "${item.name}" додано до кошика.`);
    }
    saveCart(cart); // Зберігаємо оновлений кошик у localStorage
  }

  // --- Функція оновлення лічильника в хедері ---

  /**
   * Оновлює відображення лічильника товарів у хедері.
   */
  function updateCartCounter() {
    const cart = getCart();
    // Рахуємо загальну кількість ОДИНИЦЬ товару (сума всіх quantity)
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCountElement) {
      cartCountElement.textContent = totalQuantity; // Показуємо загальну кількість
    }

    // Додаємо/видаляємо клас для можливості стилізації іконки, коли кошик не порожній
    if (cartContainer) {
      if (totalQuantity > 0) {
        cartContainer.classList.add("has-items");
      } else {
        cartContainer.classList.remove("has-items");
      }
    }
  }

  // --- Додавання обробників подій до кнопок "Add to cart" ---

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const buttonElement = event.target;
      // Знаходимо найближчий батьківський елемент з класом 'product-card'
      const productCard = buttonElement.closest(".product-card");

      if (!productCard) {
        console.error(
          "Не вдалося знайти картку товару (.product-card) для кнопки:",
          buttonElement
        );
        return; // Виходимо, якщо картку не знайдено
      }

      // Отримуємо дані товару з картки
      const productId = buttonElement.dataset.id;
      const productNameElement = productCard.querySelector("p:nth-of-type(1)"); // Перший <p> - назва
      const productPriceElement = productCard.querySelector("p:nth-of-type(2)"); // Другий <p> - ціна
      const productImageElement = productCard.querySelector("img"); // Зображення

      // Перевіряємо, чи всі необхідні дані знайдено
      if (
        !productId ||
        !productNameElement ||
        !productPriceElement ||
        !productImageElement
      ) {
        console.error(
          "Не вдалося знайти всі дані (ID, назву, ціну або зображення) для товару в картці:",
          productCard
        );
        return; // Виходимо, якщо даних не вистачає
      }

      const productName = productNameElement.textContent.trim();
      // Обробляємо ціну: видаляємо все, крім цифр, крапки/коми, замінюємо кому на крапку
      const priceString = productPriceElement.textContent
        .replace(/[^0-9.,]/g, "")
        .replace(",", ".");
      const productPrice = parseFloat(priceString);
      const productImageSrc = productImageElement.src;

      // Перевіряємо, чи вдалося отримати ціну
      if (isNaN(productPrice)) {
        console.error(
          "Не вдалося перетворити ціну на число:",
          productPriceElement.textContent
        );
        return; // Виходимо, якщо ціна некоректна
      }

      // Створюємо об'єкт товару для додавання в кошик
      const itemToAdd = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImageSrc,
        // quantity буде додано автоматично в функції addItemToCart
      };

      // Додаємо товар до кошика (з оновленням localStorage та лічильника)
      addItemToCart(itemToAdd);

      // Надаємо користувачеві візуальний відгук (опціонально)
      buttonElement.textContent = "Added";
      buttonElement.disabled = true; // Тимчасово блокуємо кнопку
      setTimeout(() => {
        buttonElement.textContent = "Add to cart";
        buttonElement.disabled = false;
      }, 1500); // Повертаємо текст кнопки через 1.5 секунди
    });
  });

  // --- Ініціалізація лічильника при першому завантаженні сторінки ---
  // Показує кількість товарів, якщо вони вже є в кошику з попереднього візиту
  updateCartCounter();
}); // Кінець обробника DOMContentLoaded
