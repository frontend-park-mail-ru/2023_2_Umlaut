/**
 * Класс функций валидации
 */
export class Validate {
    /**
    * Проверка правильности введенного адреса электронной почты
    * @param {string} str - адрес электронной почты
    * @return {boolean} - валидный ли адрес
    */
    static email(str) {
        // eslint-disable-next-line
        return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(str) && !/\p{Extended_Pictographic}/u.test(str);
    }

    /**
    * Проверка правильности введенной строки, в которой должны быть только буквы
    * @param {string} str - строка
    * @return {boolean} - валидная ли строка
    */
    static onlyLetters(str) {
        // eslint-disable-next-line
        return /[A-Za-zА-Яа-яЁё]/.test(str) && !/\p{Extended_Pictographic}/u.test(str) && !/[0-9]/.test(str);
    }

    /**
    * Проверка есть ли смайлики в введенной строке
    * @param {string} str - строка
    * @return {boolean} - есть ли смайлики
    */
    static areSmails(str) {
        // eslint-disable-next-line
        return /\p{Extended_Pictographic}/u.test(str);
    }
}
