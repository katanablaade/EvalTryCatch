// Функция фильтрации по типу данных, принимает 2 параметра: Тип и значения. Берет значения, фильтрует по критерию: значение = тип
const filterByType = (type, ...values) =>
    values.filter((value) => typeof value === type),
  // Функция, которая находит все div с классом dialog__response-block, объединяет их в массив и скрывает их display: none
  hideAllResponseBlocks = () => {
    const responseBlocksArray = Array.from(
      document.querySelectorAll('div.dialog__response-block')
    );
    responseBlocksArray.forEach((block) => (block.style.display = 'none'));
  },
  // Функция, которая скрывает все div (как-бы обнуляет), после чего ищет div с нужным классом, и отображает его, а также присваивает textContent спану в зависимости от того, какой текст нужно отобразить (Функция tryFilterByType ---> alertMsg), если это необходимо, так как в случае, если пользователь не введет данных, которые не подходят под выбранный тип, то отработает showNoResults, а там не требуется менять textContent
  showResponseBlock = (blockSelector, msgText, spanSelector) => {
    hideAllResponseBlocks();
    document.querySelector(blockSelector).style.display = 'block';
    if (spanSelector) {
      document.querySelector(spanSelector).textContent = msgText;
    }
  },
  // Функции, которые вызывают функцию showResponseBlock с определенными параметрами(класс Divа, сам текст и span, в котором он отобразится), которые отобразят Ошибку, Результат или не отобразят результат вовсе(соответственно)
  showError = (msgText) =>
    showResponseBlock('.dialog__response-block_error', msgText, '#error'),
  showResults = (msgText) =>
    showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),
  showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),
  //
  tryFilterByType = (type, values) => {
    // В случае, если все условия соблюдены и инпут заполнен верно, то отрабатывает try, который вызывает соответствующую функцию с сообщением, если же нет, то отрабатывает catch, который выводит ошибку и ее сообщение(статус) через вызов соответствующей функции(showError)
    try {
      const valuesArray = eval(`filterByType('${type}', ${values})`).join(', '); // Выполняется строка кода, в которой вызывается функция filterByType, в которую передаются параметры Тип и Значение
      const alertMsg = valuesArray.length // Проверяется длинна массива, если в нем есть значения, то выводит сообщение 'Данные с типом...', если их нет, то 'Отсутствуют данные типа...'
        ? `Данные с типом ${type}: ${valuesArray}`
        : `Отсутствуют данные типа ${type}`;
      showResults(alertMsg); // запускается функция showResults коллбек, которой является alertMsg
    } catch (e) {
      //
      showError(`Ошибка: ${e}`);
    }
  };

const filterButton = document.querySelector('#filter-btn'); // Получаем кнопку, сохраняем ее в переменную

filterButton.addEventListener('click', (e) => {
  // Вешаем на нее обработчик событий
  const typeInput = document.querySelector('#type'); // Находим инпут с Типами данных, сохраняем
  const dataInput = document.querySelector('#data'); // Находим инпут с Данными, сохраняем

  // Если инпут не заполнен, то выводим кастомную ошибку и перезапускаем функцию ShowResults, которая отобразит div стартовый
  if (dataInput.value === '') {
    dataInput.setCustomValidity('Поле не должно быть пустым!');
    showNoResults();
  } else {
    dataInput.setCustomValidity(''); // Иначе убираем кастомную ошибку
    e.preventDefault(); // Отменяем станадртное поведение слушателя
    tryFilterByType(typeInput.value.trim(), dataInput.value.trim()); // Запускаем функцию tryFilterByType, и убираем лишние пробелы trim
  }
});
