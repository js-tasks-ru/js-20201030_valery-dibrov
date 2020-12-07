import RangePicker from "./components/range-picker/src/index.js";
import SortableTable from "./components/sortable-table/src/index.js";
import ColumnChart from "./components/column-chart/src/index.js";
import header from "./bestsellers-header.js";

import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru/";

export default class Page {
  element = null;
  subElements = null;
  components = null;

  consrtuctor() {}

  render() {}

  get markupTemplate() {
    return `<div class="dashboard">
                <div class="content__top-panel">
                    <h2 class="page-title">Dashboard</h2>
                    <div data-element="rangePicker" class="rangepicker"></div>
                </div>
                <div class="dashboard__charts">
                    <div data-element="ordersChart" class="column-chart dashboard__chart_orders"></div>
                    <div data-element="salesChart" class="column-chart dashboard__chart_sales"></div>
                    <div data-element="customersChart" class="column-chart dashboard__chart_customers"></div>
                </div>
                <h3 class="block-title">Bestsellers</h3>
                <div data-element="sortableTable" class="sortable-table"></div>
            </div>`;
  }

  initComponents() {
    const from = new Date();
    const to = new Date(from.getTime() + 30 * 24 * 60 * 60 * 1000);

    const rangePicker = new RangePicker({ from, to });

    const ordersChart = new ColumnChart({
      url: "api/dashboard/orders",
      label: "Orders",
      link: "#",
      range: { from, to },
    });

    const salesChart = new ColumnChart({
      url: "api/dashboard/sales",
      label: "Sales",
      link: "#",
      range: { from, to },
    });

    const customersChart = new ColumnChart({
      url: "api/dashboard/customers",
      label: "Customers",
      link: "#",
      range: { from, to },
    });

    const sortableTable = new SortableTable(header, {
      url: `api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`,
      isSortLocally: true,
    });

    this.components = {
      rangePicker,
      ordersChart,
      salesChart,
      customersChart,
      sortableTable,
    };
  }

  async render() {
    const element = document.createElement("div");

    element.innerHTML = this.markupTemplate;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initComponents();

    this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  renderComponents() {
    Object.keys(this.components).forEach((componentName) => {
      const nodeToAppend = this.subElements[componentName];
      const { element } = this.components[componentName];

      nodeToAppend.append(element);
    });
  }

  async updateComponents(from, to) {
    const data = await fetchJson(
      `${BACKEND_URL}api/dashboard/bestsellers?_start=1&_end=21&from=${from.toISOString()}&to=${to.toISOString()}&_sort=title&_order=asc`
    );

    this.components.ordersChart.update(from, to);
    this.components.salesChart.update(from, to);
    this.components.customersChart.update(from, to);

    this.components.sortableTable.renderRows(data);
  }

  initEventListeners() {
    this.components.rangePicker.element.addEventListener(
      "date-select",
      (event) => {
        const { from, to } = event.detail;
        this.updateComponents(from, to);
      }
    );
  }

  getSubElements(element) {
    const elements = element.querySelectorAll("[data-element]");

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element = null;
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
