export default class SortableTable {
  element = null;
  subElements = null;
  headerElements = null;
  sortingArrow = null;

  constructor(headerConfig = [], { data = [] } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();

    this.createAndCacheSortingArrow();
    this.cacheInnerContainers();
    this.cacheHeaders();
    this.resetSorting();
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getHeader(this.headerConfig)}
        ${this.getBody(this.data)}
      </div>`;
  }

  // можно сделать метод moveArrowTo для перемещения стрелочки при сортировке
  // при этом, думаю, будет удобно иметь внутреннюю коллекцию, какой-нибудь Map или объект,
  // ключами которого будут имена колонок

  getHeader(headerConfig) {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
              ${headerConfig
                .map((item) => {
                  return this.getHeaderCell(item);
                })
                .join("")}
            </div>`;
  }

  getHeaderCell({
    dataId = "",
    dataSortable = false,
    dataOrder = "asc",
    title = "",
  } = {}) {
    return `<div class="sortable-table__cell" data-id=${dataId} data-sortable=${dataSortable} data-order=${dataOrder}>
              <span>${title}</span>
            </div>`;
  }

  getBody(data) {
    return `<div data-element="body" class="sortable-table__body">
              ${this.getRows(data)}
            </div>`;
  }

  getRows(data) {
    return data
      .map((item) => {
        return this.getRow(item);
      })
      .join("");
  }

  getRow(item) {
    return `<a href="/products/${item.id}" class="sortable-table__row">
              ${this.getRowCells(item)}
            </a>`;
  }

  getRowCells(item) {
    return this.headerConfig
      .map(({ id, template }) => {
        return template
          ? template(item[id])
          : `<div class="sortable-table__cell">${item[id]}</div>`;
      })
      .join("");
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.getTable();

    this.element = element.firstElementChild;
  }

  cacheInnerContainers() {
    const innerContainers = this.element.querySelectorAll("[data-element]");

    this.subElements = [...innerContainers].reduce((accum, container) => {
      accum[container.dataset.element] = container;
      return accum;
    }, {});
  }

  cacheHeaders() {
    const headers = this.subElements.header.querySelectorAll(
      ".sortable-table__cell"
    );

    this.headerElements = this.headerConfig.reduce((accum, item, index) => {
      accum[item.id] = headers[index];
      return accum;
    }, {});
  }

  createAndCacheSortingArrow() {
    const arrowMarkup = `<span data-element="arrow" class="sortable-table__sort-arrow">
                          <span class="sort-arrow"></span>
                        </span>`;
    const element = document.createElement("div");

    element.innerHTML = arrowMarkup;
    this.sortingArrow = element.firstElementChild;
  }

  moveSortingArrowTo(headerId) {
    this.headerElements[headerId].append(this.sortingArrow);
  }

  sort(field, order) {
    // а для сортировки у нас элемент каждой строки должен лежать в собственном объекте
    // будет содержать в себе также и функцию для сортировки чисел

    this.headerElements[field].dataset.order = order;
    this.moveSortingArrowTo(field);
    const sortedData = this.sortData(this.data, field, order);
    this.subElements.body.innerHTML = this.getRows(sortedData);
  }

  sortData(data, field, order = "asc") {
    const arrToSort = [...data];
    const orderObj = {
      asc: 1,
      desc: -1,
    };
    const orderMultiplier = orderObj[order];
    const columnConfig = this.headerConfig.find((item) => item.id === field);
    const { sortType, customSorting } = columnConfig;

    return arrToSort.sort((a, b) => {
      switch (sortType) {
        case "string": {
          return (
            orderMultiplier *
            a[field].localeCompare(b[field], ["ru", "en"], {
              caseFirst: "upper",
            })
          );
        }
        case "custom": {
          return orderMultiplier * customSorting(a, b);
        }
        case "number":
        default: {
          return orderMultiplier * (a[field] - b[field]);
        }
      }
    });
  }

  resetSorting() {
    for (let item of Object.values(this.headerElements)) {
      item.dataset.order = "";
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = null;
    this.headerElements = null;
    this.sortingArrow = null;
  }
}
