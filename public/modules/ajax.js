export const URLS = {
  login: "/auth/login",
  logout: "/auth/logout",
  singup: "/auth/signup",
  feed: "/feed",
};

export const BACKEND_URL = "http://localhost:8000";

export class Ajax {
  static get(params = {}) {
    let status;

    return fetch(params.url, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then(
        (response) => {
          status = response.status;
          return response.json();
        },
        (error) => {
          console.error(error); // ошибка отправки
        }
      )
      .then((parsedJson) => {
        return {
          status,
          parsedJson,
        };
      });
  }

  static getNoBody(params = {}) {
    let status;

    return fetch(params.url, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then(
        (response) => {
          status = response.status
          return {
            status
          }
        },
        (error) => {
          console.error(error); // ошибка отправки
        }
      )
      .then((parsedJson) => {
        return {
          status,
          parsedJson,
        };
      });
  }

  static post(url = "", data = {}) {
    let status;

    return fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(
        (response) => {
          status = response.status;
          return response.json();
        },
        (error) => {
          console.error(error); // ошибка отправки
        }
      )
      .then((body) => {
        return {
          status,
          body,
        };
      });
  }

  static postNoBody(url = "", data = {}) {
    let status;

    return fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(
        (response) => {
          status = response.status;
          return {
            status
          };
        },
        (error) => {
          console.error(error); // ошибка отправки
        }
      );
  }

  static async postAsync(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const parsedJson = await response.json();
    return {
      status: response.status,
      parsedJson,
    };
  }

  static async getAsync(params = {}) {
    const response = await fetch(params.url, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    });
    const parsedJson = await response.json();

    return {
      status: response.status,
      parsedJson,
    };
  }
}