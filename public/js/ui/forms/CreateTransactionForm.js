/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Entity.URL = Account.URL;
    Account.list(null, this.onAccountListChanged.bind(this));
  }

  onAccountListChanged(error, response) {
    let account = this.element.querySelector('select[name=account_id]'); 
    account.innerHTML = '';
    response.data.forEach(item => {
      var opt = document.createElement('option');
      opt.value = item.id;
      opt.innerHTML = item.name;
      account.appendChild(opt);
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Entity.URL = Transaction.URL;
    Transaction.create(data, this.onTransactionCreated.bind(this));
  }

  onTransactionCreated(error, response) {
    if(response && response.success === true) {
      this.element.reset();
      let formId = this.element.getAttribute('id');
      let modalName = '';
      if(formId === 'new-income-form') {
        modalName = 'newIncome';
      }
      else if(formId === 'new-expense-form') {
        modalName = 'newExpense';
      }
      const modal = App.getModal(modalName);
      modal.close();
      App.update();
    }
  }
}