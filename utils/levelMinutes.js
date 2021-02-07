/*const config = require('config');
const step = config.get('minutesStep');*/

const step = 30;

module.exports = minutes => {
  if (minutes % step === 0) {
      // ровное число, попадает в шаг
      return minutes;
  }
  let i = 0;
  while (i <= 60) {
    if (i > minutes) {
      if (Math.abs((i-step) - minutes) <= Math.abs(minutes-i)) {
          // Приводим к ближайшеым меньшим минутам
          return step;
      }
      // Приводим к ближайшеым большим минутам
      return i === 60 ? 0 : i;
    }
    i += step;
  }
};
