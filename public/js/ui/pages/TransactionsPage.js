/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(element === null) {
      throw new Error('Передан пустой элемент в конструкторе класса TransactionsPage');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    let removeAccount = document.querySelector('.remove-account');
    removeAccount.addEventListener('click', this.removeAccount.bind(this));

    let removeTransaction = document.querySelectorAll('.transaction__remove');
    if(removeTransaction !== null) {
      removeTransaction.forEach(item => this.removeTransaction.bind(this, item.dataset.id));
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions === undefined) {
      return;
    }

    let isApply = confirm("Вы действительно хотите удалить счёт?");
    if(isApply) {
      Entity.URL = Account.URL;
      Account.remove({ account_id: this.lastOptions.account_id }, this.onAccountRemoved.bind(this));
    }
  }

  onAccountRemoved(error, response) {
    if(response && response.success === true) {
      App.updateWidgets();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let isApply = confirm("Вы действительно хотите удалить эту транзакцию?");
    if(isApply) {
      Entity.URL = Transaction.URL;
      Transaction.remove({ 'id': id }, this.onTransactionRemoved.bind(this));
    }
  }

  onTransactionRemoved(error, response) {
    if(response && response.success === true) {    
      App.update();
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    this.clear();
    if(options === undefined) {
      return;
    }

    this.lastOptions = options;
    Entity.URL = Account.URL;
    Account.get(options.account_id, this.onRenderTitel.bind(this));

    Entity.URL = Transaction.URL;
    Transaction.list(options, this.onRenderTransactions.bind(this));
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = undefined;
  }

  onRenderTitel(error, response) {
    if(response && response.success === true) {
      this.renderTitle(response.data.name);
    }
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    let titel = this.element.querySelector('.content-title');
    titel.innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var argDate  = new Date(date);
    return argDate.toLocaleDateString("ru", options);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    let transaction = document.createElement('div');
    transaction.classList.add('transaction');
    if(item.type.toLowerCase() === 'income') {
      transaction.classList.add('transaction_income');
    }
    else if(item.type.toLowerCase() === 'expense') {
      transaction.classList.add('transaction_expense');
    }
    transaction.classList.add('row');

    let details = document.createElement('div');
    details.classList.add('col-md-7', 'transaction__details');
    let icon = document.createElement('i');
    icon.classList.add('transaction__icon');
    let money = document.createElement('span');
    money.classList.add('fa', 'fa-money', 'fa-2x');
    icon.appendChild(money);
    details.appendChild(icon);
    let info = document.createElement('div');
    info.classList.add('transaction__info');
    let infoTitel = document.createElement('h4');
    infoTitel.classList.add('transaction__title');
    infoTitel.innerText = item.name;
    let infoData = document.createElement('div');
    infoData.classList.add('transaction__date');
    infoData.innerText = this.formatDate(item.created_at);
    info.appendChild(infoTitel);
    info.appendChild(infoData);
    details.appendChild(info);
    transaction.appendChild(details);

    let sum = document.createElement('div');
    sum.classList.add('col-md-3');
    let summInner = document.createElement('div');
    summInner.classList.add('transaction__summ');
    let currency = document.createElement('span');
    currency.innerText = "₽";
    let sumValue = document.createTextNode(item.sum);
    summInner.appendChild(sumValue);
    summInner.appendChild(currency);
    sum.appendChild(summInner);

    let controls = document.createElement('div');
    controls.classList.add('col-md-2', 'transaction__controls');
    let buttonRemove = document.createElement('button');
    buttonRemove.classList.add('btn', 'btn-danger', 'transaction__remove');
    buttonRemove.dataset.id = item.id;
    buttonRemove.addEventListener('click', this.removeTransaction.bind(this, item.id));
    let buttonIcon = document.createElement('i');
    buttonIcon.classList.add('fa', 'fa-trash');
    buttonRemove.appendChild(buttonIcon);
    controls.appendChild(buttonRemove);

    transaction.appendChild(details);
    transaction.appendChild(sum);
    transaction.appendChild(controls);

    return transaction;
  }

  onRenderTransactions(error, response) {
    if(response && response.success === true) {
      this.renderTransactions(response.data);
    }
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    let content = this.element.querySelector('.content');
    if(data.length === 0) {
      content.innerHTML = '';
    }
    data.forEach(item => {
      content.appendChild(this.getTransactionHTML(item));
    });
  }
}