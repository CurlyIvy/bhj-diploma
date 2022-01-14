/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let factory = new HttpRequestFactory();
    let httpRequest = factory.create(
        options.url, 
        options.method, 
        options.responseType,
        options.data, 
        options.callback
    );
    httpRequest.send();
};

class HttpRequestFactory {
    create(url, method, responseType, data, callback) {
        return (method === 'GET') ? 
            new GetHttpRequestWrapper(url, method, responseType, data, callback) :
            new PostHttpRequestWrapper(url, method, responseType, data, callback);
    }
}

class HttpRequestWrapper {
    constructor(url, method, responseType, data, callback) {
        this.xhr = new XMLHttpRequest();
        this.xhr.responseType = responseType; 
        this.url = url;
        this.method = method;
        this.data = data;
        this.callback = callback;
    }

    subscribe() {
        this.xhr.addEventListener('load', this.onLoadEventHendler.bind(this));
        this.xhr.addEventListener('error', this.onErrorEventHendler.bind(this));
    }

    onLoadEventHendler() {
        if (this.xhr.status !== 200) {
            this.callback(`ошибка, код ответа ${this.xhr.status}`);
            return;
        }

        let response = this.xhr?.response;
        this.callback(null, response);
    }

    onErrorEventHendler() {
        this.callback('запрос завершился неудачно');
    }

    send() {
        try {
            this.onSend();
        }
        catch(error) {
            this.callback(error);
        }
    }
}

class GetHttpRequestWrapper extends HttpRequestWrapper {
    constructor(url, method, responseType, data, callback) {
        super(url, method, responseType, data, callback);
        this.prepare();
    }

    prepare() {
        var keys = this.data !== null ? Object.keys(this.data) : '';
        this.url = (keys.length > 0) ? `${this.url}?` : this.url;
        for(let index = 0; index < keys.length; index += 1) {
            let name = keys[index];
            this.url += `${name}=${this.data[name]}`
            this.url = (index + 1 > keys.length) ? this.url += '&' : this.url;
        }
    }

    onSend() {
        this.xhr.open(this.method, this.url);
        this.subscribe();
        this.xhr.send();
    }
}

class PostHttpRequestWrapper extends HttpRequestWrapper {
    constructor(url, method, responseType, data, callback) {
        super(url, method, responseType, data, callback);
        this.prepare();
    }

    prepare() {
        let formData = new FormData();
        var keys = this.data !== null ? Object.keys(this.data) : '';
        for(let index = 0; index < keys.length; index += 1) {
            let name = keys[index];
            formData.append(name, this.data[name]);
        }
        this.data = formData;
    }

    onSend() {
        this.xhr.open(this.method, this.url);
        this.subscribe();
        this.xhr.send(this.data);
    }
}