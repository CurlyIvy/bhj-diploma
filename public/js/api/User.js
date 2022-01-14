/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    let strJson = JSON.stringify(user);
    localStorage.setItem('user', strJson);
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    let strJson = localStorage.getItem('user');
    try {
      let user = JSON.parse(strJson);
      return user !== null ? user : undefined;
    } 
    catch (error) {
      return undefined;
    } 
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    createRequest({ 
      url: `${User.URL}/current`,
      method: 'GET',
      responseType: 'json',
      data: null,
      callback: (err, response) => {
        if(response && response.success) {
          User.setCurrent(response.user);
        }
        else if(response && !response.success) {
          User.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: `${User.URL}/login`,
      method: 'POST',
      responseType: 'json',
      data: data,
      callback: (err, response) => {
        if (response && response.user) {
          User.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: `${User.URL}/register`,
      method: 'POST',
      responseType: 'json',
      data: data,
      callback: (err, response) => {
        if (response && response.user) {
          User.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: `${User.URL}/logout`,
      method: 'POST',
      responseType: 'json',
      data: null,
      callback: (err, response) => {
        if (response && response.success) {
          User.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }
}
