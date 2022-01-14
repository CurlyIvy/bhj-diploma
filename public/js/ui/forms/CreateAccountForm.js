/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Entity.URL = Account.URL;
    Account.create(data, this.onAccountCreated.bind(this));
  }

  onAccountCreated(error, response) {
    if(response && response.success === true) {
      this.element.reset();
      const modal = App.getModal('createAccount');
      modal.close();
      App.update();
    }
  }
}