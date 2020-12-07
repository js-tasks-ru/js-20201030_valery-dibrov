export default class SortableTable {
  element = null;
  subElements = null;
  headerElements = null;
  sortingArrow = null;

  constructor(
    headerConfig = [],
    { data = [] } = {},
    sorted = {
      id: headerConfig.find((item) => item.sortable).id,
      order: "asc",
    }
  ) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    let { id, order } = this.sorted;

    this.render();

    this.createAndCacheSortingArrow();
    this.cacheInnerContainers();
    this.cacheHeaders();
    this.initEventListeners();

    this.sort(id, order);
  }

  initEventListeners() {
    Object.values(this.headerElements)[0].parentNode.addEventListener(
      "pointerdown",
      this.onColumnHeaderClick
    );
  }

  onColumnHeaderClick = (event) => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = (order) => {
      const toggleObject = {
        asc: "desc",
        desc: "asc",
      };
      return toggleObject[order];
    };

    if (column) {
      const { id, order } = column.dataset;

      this.sort(id, toggleOrder(order));
    }
  };

  getTable() {
    return `
        <div class="sortable-table">
          ${this.getHeader(this.headerConfig)}
          ${this.getBody(this.data)}
        </div>`;
  }

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
    id = "",
    sortable = false,
    dataOrder = "asc",
    title = "",
  } = {}) {
    return `<div class="sortable-table__cell" data-id=${id} data-sortable=${sortable} data-order=${dataOrder}>
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
    this.headerElements[field].dataset.order = order;
    this.moveSortingArrowTo(field);
    const sortedData = this.sortData(this.data, field, order);
    this.subElements.body.innerHTML = this.getRows(sortedData);
    this.sorted = { id: field, order: order };
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
