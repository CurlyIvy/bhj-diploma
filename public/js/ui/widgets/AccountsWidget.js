/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(element === null) {
      throw new Error('Передан пустой элемент в конструкторе класса AccountsWidget');
    }
    this.element = element;
    this.selectedItem = null;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    let createControl = this.element.querySelector('.create-account');
    createControl.addEventListener('click', function() {
      let modal = App.getModal('createAccount');
      modal.open();
    });

    let accounts = this.element.querySelectorAll('.account');
    accounts?.forEach(item => item.addEventListener('click', this.onSelectedChanged.bind(this, item)));
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const user = User.current();
    if(user === undefined) {
      return;
    }

    Entity.URL = Account.URL;
    Account.list(null, this.onAccauntListChanged.bind(this));
  }

  onAccauntListChanged(error, response) {
    if(response && response.success === true) {
      this.clear();
      response.data.forEach(item => {
        this.renderItem(item);
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    let accounts = this.element.querySelectorAll('.account');
    accounts?.forEach(item => item.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    if(this.selectedItem !== null) {
      this.selectedItem.classList.remove('active');
    }
    element.classList.add('active');
    this.selectedItem = element;
    App.showPage('transactions', { account_id: element.dataset.id });
  }

  onSelectedChanged(item) {
    this.onSelectAccount(item);
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    let li = document.createElement('li');
    li.classList.add('account');
    li.dataset.id = item.id;

    let link = document.createElement('a');
    link.setAttribute('href', '#');

    let firstSpan = document.createElement('span');
    firstSpan.innerText = item.name;
    let text = document.createTextNode('/');
    let secondSpan = document.createElement('span');
    secondSpan.innerText = item.sum;

    link.appendChild(firstSpan);
    link.appendChild(secondSpan);
    link.insertBefore(text, secondSpan)

    li.appendChild(link);
    li.addEventListener('click', this.onSelectedChanged.bind(this, li));

    return li;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    //let strHtml = this.getAccountHTML(data);
    //this.element.insertAdjacentHTML('beforeend', strHtml);
    let html = this.getAccountHTML(data);
    this.element.appendChild(html);
  }
}
