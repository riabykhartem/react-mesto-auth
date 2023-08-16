class Auth{
    constructor(props){
        this._headers = props.headers;
        this._authorization = props.headers.authorization;
        this._baseUrl = props.baseUrl;
    }

    _getResponseData(res){
        return res.ok ? res.json() : Promise.reject();
    };

    register(data){
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                password: data.password,
                email: data.email
            })
        }).then(this._getResponseData)
    }

    login(data){
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                password: data.password,
                email: data.email
            })
        }).then(this._getResponseData)
    }

    getContent(token){
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(this._getResponseData)
    }
}
const auth = new Auth({
    headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
    },
    baseUrl: "https://auth.nomoreparties.co",
  });

export default auth