export default class ColumnChart {
  chartHeight = 50;
  innerContainers = null;
  element = null;

  constructor({ data = [], label = "", value = "", link = "" } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  get markupTemplate() {
    return `<div class="column-chart" style="--chart-height: &{this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          <a href="${this.link}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${
            this.value
          }</div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumns(this.data)}
          </div>
        </div>
      </div>`;
  }

  getColumns(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map((value) => {
        return this.createColumn(value * scale);
      })
      .join("");
  }

  createColumn(value) {
    const percentage = ((value / this.chartHeight) * 100).toFixed(0);
    return `<div style="--value: ${Math.floor(
      value
    )}" data-tooltip="${percentage}%"></div>\n`;
  }

  cacheInnerContainers(element) {
    const innerContainers = element.querySelectorAll("[data-element]");

    this.innerContainers = [...innerContainers].reduce((accum, container) => {
      accum[container.dataset.element] = container;
      return accum;
    }, {});
  }

  update(data) {
    this.innerContainers.body.innerHTML = this.getColumns(data);
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.markupTemplate;

    this.element = element.firstElementChild;
    this.cacheInnerContainers(this.element);

    if (!this.data.length) {
      this.element.classList.add("column-chart_loading");
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
