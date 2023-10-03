
export class Ajax {
  static get(url = "") {
    let status;

    return fetch(url, {
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
      .then((body) => {
        return {
          status,
          body,
        };
      },
      (err) => {
        body = null;
        return {
          status,
          body
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
      },
      (err) => {
        body = null;
        return {
          status,
          body
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

}
