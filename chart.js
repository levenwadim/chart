class Hint {
  static HINT_TRIANGLE_SIZE = 5;
  static DEFAULT_LEGEND_COLOR = '#222';
  static DEFAULT_LEGEND_BORDER_COLOR = '#fff';

  static ELEM_SELECTOR = '.chartHint';
  static TRIANGLE_SELECTOR = '.chartHint__triangle';
  static TITLE_SELECTOR = '.chartHint__title';
  static CONTENT_SELECTOR = '.chartHint__content';

  static ELEM_TOP_CLASS = 'chartHint-top';
  static ELEM_BOTTOM_CLASS = 'chartHint-bottom';

  static CONTENT_ROW_SELECTOR = '.chartHint__content-row';
  static CONTENT_ROW_LEGEND_SELECTOR = '.chartHint__content-row__legend';
  static CONTENT_ROW_VALUE_SELECTOR = '.chartHint__content-row__value';

  constructor(parentElem) {
    parentElem.insertAdjacentHTML('beforeend', Hint.getElementHtml());

    this.elem = parentElem.querySelector(Hint.ELEM_SELECTOR);
    this.triangle = this.elem.querySelector(Hint.TRIANGLE_SELECTOR);
    this.title = this.elem.querySelector(Hint.TITLE_SELECTOR);
    this.content = this.elem.querySelector(Hint.CONTENT_SELECTOR);
  }

  static getElementHtml() {
    return `
        <div class="${Hint.ELEM_SELECTOR.substring(1)}" style="display: none;">
            <div class="${Hint.TITLE_SELECTOR.substring(1)}"></div>
            <div class="${Hint.CONTENT_SELECTOR.substring(1)}"></div>
            <div class="${Hint.TRIANGLE_SELECTOR.substring(1)}"></div>
        </div>
      `;
  }
  static getContentRowHtml(value, index, color, borderColor) {
    color = color || Hint.DEFAULT_LEGEND_COLOR;
    borderColor = borderColor || Hint.DEFAULT_LEGEND_BORDER_COLOR;

    return `
        <div class="${Hint.CONTENT_ROW_SELECTOR.substring(1)}">
            <div class="${Hint.CONTENT_ROW_LEGEND_SELECTOR.substring(1)}" style="background: ${color}; border-color: ${borderColor};"></div>
            <span class="${Hint.CONTENT_ROW_VALUE_SELECTOR.substring(1)}" data-index="${index}">${value}</span>
        </div>
      `;
  }

  getContentHtml(hoveredDot, chart) {
    let contentHtml = '';
    chart.data.forEach((chartData, chartIndex) => {
      const linesStyle = chart.getStyle('lines', chartIndex);
      const pointsStyle = chart.getStyle('points', chartIndex);
      contentHtml += Hint.getContentRowHtml(chartData[hoveredDot], chartIndex, linesStyle.fill, pointsStyle.fill);
    })
    return contentHtml;
  }
  updContent(hoveredDot, chart) {
    chart.data.forEach((chartData, chartIndex) => {
      this.content.querySelector(Hint.CONTENT_ROW_VALUE_SELECTOR + '[data-index="' + chartIndex + '"]').textContent = chartData[hoveredDot];
    })
  }

  getHintClassName(point, chart) {
    const defaultHintClassName = Hint.ELEM_SELECTOR.substring(1);
    const centerX = (chart.width - chart.padding) / 2;
    const centerY = (chart.height - chart.padding) / 2;

    if (point.y > centerY) {
      return defaultHintClassName + ' ' + Hint.ELEM_TOP_CLASS;
    } else {
      return defaultHintClassName + ' ' + Hint.ELEM_BOTTOM_CLASS;
    }
  }

  show(hoveredDot, chart) {
    if (this.content.innerHTML === '') {
      this.content.innerHTML = this.getContentHtml(hoveredDot, chart);
    } else {
      this.updContent(hoveredDot, chart);
    }
    this.title.textContent = chart.labels[hoveredDot];

    const point = chart.points[hoveredDot];
    this.elem.className = this.getHintClassName(point, chart);

    if (this.elem.className.indexOf(Hint.ELEM_SELECTOR.substring(1) + '-top') !== -1) {
      this.elem.style.top = (Math.floor(point.y - this.elem.offsetHeight - Hint.HINT_TRIANGLE_SIZE - 5)) + 'px';
    } else {
      this.elem.style.top = (Math.floor(point.y + Hint.HINT_TRIANGLE_SIZE + 5)) + 'px';
    }
    this.elem.style.left = (point.x - this.elem.offsetWidth / 2) + 'px';
    this.triangle.style.left = ((this.elem.offsetWidth / 2) - Hint.HINT_TRIANGLE_SIZE) + 'px';

    this.elem.style.display = 'inline-block';
  }

  hide() {
    this.elem.style.display = 'none';
  }
}

class Chart {
  static LINE_TYPE = 'line';

  DEFAULT_BG_COLOR = '#222';
  DEFAULT_FG_COLOR = '#fff';

  DEFAULT_PADDING = 50;
  DEFAULT_STROKE_WIDTH = 1;
  DEFAULT_LINE_STROKE_WIDTH = 3;
  DEFAULT_LINE_BEZIER = true;
  DEFAULT_POINT_SIZE = 3;

  constructor(elem, data) {
    this.params = {
      // default params
      padding: this.DEFAULT_PADDING,
      type: Chart.LINE_TYPE,

      ...data,
    };

    elem.innerHTML = '';

    this.initStyle();
    this.init(elem);
  }

  initStyle() {
    if (this.params.style === undefined) {
      this.params.style = {};
    }

    // Default points style
    if (this.params.style.points === undefined) {
      this.params.style.points = {
        size: this.DEFAULT_POINT_SIZE,
      };
    }
    if (this.params.style.points.size === undefined) {
      this.params.style.points.size = this.DEFAULT_POINT_SIZE;
    }

    // Default line style
    if (this.params.style.lines === undefined) {
      this.params.style.lines = {
        size: this.DEFAULT_POINT_SIZE,
      };
    }
    if (this.params.style.lines.size === undefined) {
      this.params.style.lines.size = this.DEFAULT_POINT_SIZE;
    }
    if (this.params.style.lines.bezier === undefined) {
      this.params.style.lines.bezier = this.DEFAULT_LINE_BEZIER;
    }
  }
  getStyle(shapeName, chartIndex) {
    let style = {};
    let styleChart = {};

    if (this.params.style[shapeName] && this.params.style[shapeName]) {
      style = this.params.style[shapeName];
    }
    if (this.styles[chartIndex] && this.styles[chartIndex][shapeName]) {
      styleChart = this.styles[chartIndex][shapeName];
    }

    return {
      ...style,
      ...styleChart
    };
  }

  init(elem) {
    this.hasData = false;
    this.data = this.params.data || [];
    this.labels = this.params.labels || [];
    this.styles = this.params.styles || [];

    this.padding = this.params.padding;
    this.paddingSide = this.padding / 2;

    this.width = elem.offsetWidth;
    this.height = elem.offsetHeight;

    this.max = -Infinity;
    this.min = Infinity;
    this.countDots = 0;

    this.data.forEach((chart) => {
      if (!chart) {
        return;
      }

      this.hasData = true;

      if (chart.length > this.countDots) {
        this.countDots = chart.length;
      }

      chart.forEach((value) => {
        if (value > this.max) {
          this.max = value;
        }
        if (value < this.min) {
          this.min = value;
        }
      })
    });

    const svg = this.createSvgElement('svg', {
      width: this.width,
      height: this.height,
    });
    elem.appendChild(svg);
    this.svg = svg;

    this.hint = new Hint(elem);

    if (this.hasData) {
      this.draw();
      this.svg.addEventListener('mousemove', (target) => {
        if (target.offsetX < this.paddingSide || target.offsetX > this.width - this.paddingSide) {
          return;
        }

        const hoveredDot = this.getHoveredDot(target.offsetX);
        this.hint.show(hoveredDot, this);
      });
    }
  }

  draw() {
    this.data.forEach((chart, chartIndex) => {
      this.points = [];
      for (let i = 0; i < chart.length; i++) {
        let value = chart[i];

        const x = this.getPointX(i);
        const y = this.inverseY(this.getPointY(value));

        this.points.push({
          x,
          y,
        });
      }

      const pointsStyle = {
        ...this.params.style.points,
        ...this.getStyle('points', chartIndex),
      };
      if (pointsStyle.size > 0) {
        this.points.forEach((point) => {
          this.addCircle(point.x, point.y, pointsStyle.size, pointsStyle);
        });
      }

      const linesStyle = {
        ...this.params.style.lines,
        ...this.getStyle('lines', chartIndex),
      };

      let path = '';
      this.points.forEach((point, i) => {
        if (i === 0) {
          path += this.getPathMove(point);
        } else {
          if (linesStyle.bezier) {
            path += this.getPathCubicBezierLine(point, i, this.points);
          } else {
            path += this.getPathLine(point);
          }
        }
      });

      this.addPath(path, linesStyle);
    });
  }

  opposedLine(prev, next) {
    const lengthX = next.x - prev.x;
    const lengthY = next.y - prev.y;

    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    }
  }
  controlCubicBezierPoint(current, previous, next, reverse) {
    const p = previous || current;
    const n = next || current;

    const smoothing = 0.15;

    const o = this.opposedLine(p, n);

    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;

    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return {x, y};
  }

  getPathMove(point) {
    return `M ${point.x} ${point.y} `;
  }
  getPathCubicBezierLine(point, i, a) {
    // start control point
    const cps = this.controlCubicBezierPoint(a[i - 1], a[i - 2], point);
    // end control point
    const cpe = this.controlCubicBezierPoint(point, a[i - 1], a[i + 1], true);

    return `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y} `;
  }
  getPathLine(point) {
    return `L ${point.x},${point.y} `;
  }

  addPath(d, style = {}) {
    const attrs = {
      d,
      fill: 'none',
      stroke: style.fill || this.DEFAULT_FG_COLOR,
      'stroke-width': style.size || this.DEFAULT_LINE_STROKE_WIDTH,
    }
    this.svg.prepend(this.createSvgElement('path', attrs));
  }
  addCircle(cx, cy, r, style = {}) {
    const attrs = {
      cx,
      cy,
      r,
      fill: style.fill || this.DEFAULT_BG_COLOR,
      stroke: style.stroke || this.DEFAULT_FG_COLOR,
      'stroke-width': style.strokeWidth || this.DEFAULT_STROKE_WIDTH,
    };

    this.svg.appendChild(this.createSvgElement('circle', attrs));
  }

  createSvgElement(name, attributes) {
    let elem = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (let name in attributes) {
      let value = attributes[name];
      elem.setAttributeNS(null, name, value);
    }
    return elem;
  }

  getPointX(value) {
    return this.calcAxios(this.width, value, this.countDots - 1);
  }
  getPointY(value) {
    if (this.min === this.max) {
      return this.height / 2;
    }
    return this.calcAxios(this.height, value, this.max);
  }

  calcAxios(pixels, value, maxValue) {
    return (this.paddingSide) + ((pixels - this.padding) * (value / maxValue));
  }

  inverseY(value) {
    return this.height - value;
  }

  getHoveredDot(x) {
    let hoveredDot = Math.floor((x - this.paddingSide) / ((this.width - this.padding) / this.countDots));

    if (hoveredDot < 0) {
      hoveredDot = 0;
    } else if (hoveredDot >= this.countDots) {
      hoveredDot = this.countDots - 1;
    }

    return hoveredDot;
  }

}

export default Chart;