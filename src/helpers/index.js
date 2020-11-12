import cookie from 'js-cookie'

const setCookie = (name, val) => {
  if (window) {
    cookie.set(name, val)
  }
}

const removeCookie = (name) => {
  if (window) {
    cookie.remove(name)
  }
}

const getCookie = (name) => {
  if (window) {
    return cookie.get(name)
  }
}

const setLocalStorage = (key, val) => {
  if (window) {
    localStorage.setItem(key, JSON.stringify(val))
  }
}

const removeLocalStorage = (key) => {
  if (window) {
    localStorage.removeItem(key)
  }
}
// middleware after login
const authenticate = (res, next) => {
  setCookie('token', res.data.token)
  setLocalStorage('user', res.data.user)
  next()
}

const isAuthenticated = () => {
  if (window) {
    const cookiePresent = getCookie('token')
    if (cookiePresent) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'))
      } else {
        return false
      }
    }
  }
}

const revokeAll = (next) => {
  removeCookie('token')
  removeLocalStorage('user')
  next()
}

export {
  setCookie,
  getCookie,
  revokeAll,
  authenticate,
  removeCookie,
  setLocalStorage,
  isAuthenticated,
  removeLocalStorage,
}
