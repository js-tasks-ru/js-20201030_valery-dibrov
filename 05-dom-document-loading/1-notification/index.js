export default class NotificationMessage {
  element = null;
  static activeNotification = null;

  constructor(
    message = "oops, the message was empty!",
    { duration = 2000, type = "success" } = {}
  ) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get markupTemplate() {
    return `<div class="notification ${this.type}" style="--value:${
      this.duration / 1000
    }s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                </div>
            </div>`;
  }

  show(whereToDisplayElement = document.body) {
    whereToDisplayElement.append(this.element);

    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.markupTemplate;

    this.element = element.firstElementChild;
    NotificationMessage.activeNotification = this.element;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // this.element = null; // пытался обнулить ссылку на this.element, но тогда отваливается последний тест (should have ability to be destroyed)
    // говорит "TypeError: Cannot read property 'remove' of null" в методе remove() компонента
    // то есть, получается, что ссылка обнуляется до того, как элемент удалён,  хотя я обнуляю уже после удаления
    // не совсем понятно, почему так получается
    NotificationMessage.activeNotification = null;
  }
}
