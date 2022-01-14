/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(element === null) {
      throw new Error('Передан пустой элемент в конструкторе класса TransactionsWidget');
    }
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    let createIncome = this.element.querySelector('.create-income-button');
    createIncome.addEventListener('click', function() {
      let modal = App.getModal('newIncome');
      modal.open();
    });

    let createExpense = this.element.querySelector('.create-expense-button');
    createExpense.addEventListener('click', function() {
      let modal = App.getModal('newExpense');
      modal.open();
    });
  }
}
