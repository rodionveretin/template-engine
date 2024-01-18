/**
 * Интерфейс заголовков подключения.
 * @param {boolean} headers - Заголовки.
 */
interface Headers {
  headers: {
    /** Заголовок с данными данными пользователя. */
    Authorization: string,
  },
}

export { Headers };