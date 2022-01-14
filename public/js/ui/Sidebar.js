/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    let sidebarToggle = document.querySelector('.sidebar-toggle');
    sidebarToggle.addEventListener('click', function(evt) {
      evt.preventDefault();

      let sidebar = document.querySelector('.sidebar-mini');
      let isOpen = sidebar.classList.contains('sidebar-open');
      let isCollapse = sidebar.classList.contains('sidebar-collapse');
      let isFirst = sidebar.dataset.isFirst;

      if(Number(isFirst) === 1) {
        sidebar.classList.add('sidebar-open');
        sidebar.dataset.isInit = 0;
      }
      else if (isOpen) {
        sidebar.classList.remove('sidebar-open');
        sidebar.classList.add('sidebar-collapse');
      }
      else if(isCollapse) {
        sidebar.classList.remove('sidebar-collapse');
        sidebar.classList.add('sidebar-open');
      }
    });

    let sidebar = document.querySelector('.sidebar-mini');
    if(sidebar.dataset.isFirst === undefined) {
      sidebar.dataset.isFirst = 1;
    }
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    let register = document.querySelector('.menu-item_register');
    register.addEventListener('click', function(evt) {
      evt.preventDefault();
      const modal = App.getModal('register');
      modal.open();
    });

    let login = document.querySelector('.menu-item_login');
    login.addEventListener('click', function(evt) {
      evt.preventDefault();
      const modal = App.getModal('login');
      modal.open();
    });

    let logout = document.querySelector('.menu-item_logout');
    logout.addEventListener('click', function() {
      User.logout(function(err, response) {
        if(response.success === true) {
          App.setState('init');
        }
      });
    });
  }
}