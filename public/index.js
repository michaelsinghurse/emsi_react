"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var formatNumber = function formatNumber(number) {
  return number.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

var toPercent = function toPercent(number, digits) {
  return (number * 100).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
};

var toCurrency = function toCurrency(number) {
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

function Header(props) {
  var data = props.data;

  return React.createElement(
    "header",
    null,
    React.createElement(
      "h1",
      null,
      "Occupation Overview"
    ),
    React.createElement(
      "h2",
      null,
      data.occupation.title,
      " in ",
      data.region.title
    )
  );
}

function Summary(props) {
  var data = props.data;
  var summary = data.summary;

  summary.jobs.perc_diff = 1 + (summary.jobs.regional - summary.jobs.national_avg) / summary.jobs.national_avg;

  return React.createElement(
    "section",
    { className: "summary" },
    React.createElement(
      "h3",
      null,
      "Occupation Summary for ",
      data.occupation.title
    ),
    React.createElement(
      "ul",
      null,
      React.createElement(
        "li",
        null,
        React.createElement(
          "p",
          null,
          formatNumber(summary.jobs.regional)
        ),
        React.createElement(
          "p",
          null,
          "Jobs (",
          summary.jobs.year,
          ")"
        ),
        React.createElement(
          "p",
          null,
          toPercent(summary.jobs.perc_diff, 0),
          "%",
          summary.jobs.perc_diff >= 0 && React.createElement(
            "span",
            { className: "green" },
            " above "
          ),
          summary.jobs.perc_diff < 0 && React.createElement(
            "span",
            { className: "red" },
            " below "
          ),
          "National average"
        )
      ),
      React.createElement(
        "li",
        null,
        React.createElement(
          "p",
          null,
          summary.jobs_growth.regional >= 0 && React.createElement(
            "span",
            { className: "green" },
            "+",
            summary.jobs_growth.regional,
            "%"
          ),
          summary.jobs_growth.regional < 0 && React.createElement(
            "span",
            { className: "red" },
            summary.jobs_growth.regional,
            "%"
          )
        ),
        React.createElement(
          "p",
          null,
          "% Change (",
          summary.jobs_growth.start_year,
          "-",
          summary.jobs_growth.end_year,
          ")"
        ),
        React.createElement(
          "p",
          null,
          "Nation:",
          summary.jobs_growth.national_avg >= 0 && React.createElement(
            "span",
            { className: "green" },
            " +",
            summary.jobs_growth.national_avg,
            "%"
          ),
          summary.jobs_growth.national_avg < 0 && React.createElement(
            "span",
            { className: "red" },
            " ",
            summary.jobs_growth.national_avg,
            "%"
          )
        )
      ),
      React.createElement(
        "li",
        null,
        React.createElement(
          "p",
          null,
          toCurrency(summary.earnings.regional),
          "/hr"
        ),
        React.createElement(
          "p",
          null,
          "Median Hourly Earnings"
        ),
        React.createElement(
          "p",
          null,
          "Nation: ",
          toCurrency(summary.earnings.national_avg),
          "/hr"
        )
      )
    )
  );
}

// TODO: move chart logic to this class.

var TrendComparisonChart = function (_React$Component) {
  _inherits(TrendComparisonChart, _React$Component);

  function TrendComparisonChart() {
    _classCallCheck(this, TrendComparisonChart);

    return _possibleConstructorReturn(this, (TrendComparisonChart.__proto__ || Object.getPrototypeOf(TrendComparisonChart)).apply(this, arguments));
  }

  _createClass(TrendComparisonChart, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "render",
    value: function render() {}
  }]);

  return TrendComparisonChart;
}(React.Component);

var TrendComparison = function (_React$Component2) {
  _inherits(TrendComparison, _React$Component2);

  function TrendComparison(props) {
    _classCallCheck(this, TrendComparison);

    var _this2 = _possibleConstructorReturn(this, (TrendComparison.__proto__ || Object.getPrototypeOf(TrendComparison)).call(this, props));

    _this2.state = {
      trendComparison: props.data.trend_comparison
    };
    return _this2;
  }

  _createClass(TrendComparison, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var tc = this.state.trendComparison;

      var percChangeArray = function percChangeArray(array) {
        return array.map(function (value, index) {
          var startValue = array[0];
          return toPercent((value - startValue) / startValue);
        });
      };

      var yearArray = function yearArray(start, end) {
        var years = [];
        while (start <= end) {
          years.push(start);
          start += 1;
        }
        return years;
      };

      var ctx = document.querySelector(".trend-comparison-chart");
      var myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: yearArray(tc.start_year, tc.end_year),
          datasets: [{
            backgroundColor: "#000000",
            borderColor: "#000000",
            data: percChangeArray(tc.regional),
            fill: false,
            label: "Regional",
            lineTension: 0,
            pointRadius: 6,
            pointStyle: "circle",
            yAxisID: "y"
          }, {
            backgroundColor: "#4169E1",
            borderColor: "#4169E1",
            data: percChangeArray(tc.state),
            fill: false,
            label: "State",
            lineTension: 0,
            pointRadius: 6,
            pointStyle: "rect",
            yAxisID: "y"
          }, {
            backgroundColor: "#ADD8E6",
            borderColor: "#ADD8E6",
            data: percChangeArray(tc.nation),
            fill: false,
            label: "Nation",
            lineTension: 0,
            pointRadius: 6,
            pointStyle: "triangle",
            yAxisID: "y"
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              gridLines: {
                drawBorder: false,
                zeroLineColor: "#000000"
              },
              ticks: {
                fontColor: "#000000"
              }
            }],
            yAxes: [{
              display: true,
              gridLines: {
                display: false
              },
              id: "y",
              position: "left",
              scaleLabel: {
                display: true,
                labelString: "Percent Change",
                fontColor: "#000000"
              },
              ticks: {
                fontColor: "#000000"
              },
              type: "linear"
            }]
          }
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var tc = this.state.trendComparison;

      tc.regional_change = tc.regional[tc.regional.length - 1] - tc.regional[0];
      tc.regional_change_perc = tc.regional_change / tc.regional[0];

      tc.state_change = tc.state[tc.state.length - 1] - tc.state[0];
      tc.state_change_perc = tc.state_change / tc.state[0];

      tc.nation_change = tc.nation[tc.nation.length - 1] - tc.nation[0];
      tc.nation_change_perc = tc.nation_change / tc.nation[0];

      return React.createElement(
        "section",
        { className: "trend-comparison" },
        React.createElement(
          "h3",
          null,
          "Regional Trends"
        ),
        React.createElement("canvas", { className: "trend-comparison-chart" }),
        React.createElement(
          "table",
          null,
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", null),
              React.createElement(
                "th",
                null,
                "Region"
              ),
              React.createElement(
                "th",
                null,
                tc.start_year,
                " jobs"
              ),
              React.createElement(
                "th",
                null,
                tc.end_year,
                " jobs"
              ),
              React.createElement(
                "th",
                null,
                "Change"
              ),
              React.createElement(
                "th",
                null,
                "% Change"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            React.createElement(
              "tr",
              { className: "trend-comparison-region" },
              React.createElement(
                "td",
                null,
                "\u25CF"
              ),
              React.createElement(
                "td",
                null,
                "Region"
              ),
              React.createElement(
                "td",
                null,
                formatNumber(tc.regional[0])
              ),
              React.createElement(
                "td",
                null,
                formatNumber(tc.regional[tc.regional.length - 1])
              ),
              React.createElement(
                "td",
                null,
                formatNumber(tc.regional_change)
              ),
              React.createElement(
                "td",
                null,
                toPercent(tc.regional_change_perc, 1),
                "%"
              )
            ),
            React.createElement(
              "tr",
              { className: "trend-comparison-state" },
              React.createElement(
                "td",
                null,
                "\u25A0"
              ),
              React.createElement(
                "td",
                null,
                "State"
              ),
              React.createElement(
                "td",
                null,
                formatNumber(tc.state[0])
              ),
              React.createElement(
                "td",
                null,
                formatNumber(tc.state[tc.state.length - 1])
              ),
              React.createElement(
                "td",
                null,
                formatNumber(tc.state_change)
              ),
              React.createElement(
                "td",
                null,
                toPercent(tc.state_change_perc, 1),
                "%"
              )
            ),
            React.createElement(
              "tr",
              { className: "trend-comparison-nation" },
              React.createElement(
                "td",
                null,
                "\u25B2"
              ),
              React.createElement(
                "td",
                null,
                "Nation"
              ),
              React.createElement(
                "td",
                null,
                formatNumber(tc.nation[0])
              ),
              React.createElement(
                "td",
                null,
                formatNumber(tc.nation[tc.nation.length - 1])
              ),
              React.createElement(
                "td",
                null,
                formatNumber(tc.nation_change)
              ),
              React.createElement(
                "td",
                null,
                toPercent(tc.nation_change_perc, 1),
                "%"
              )
            )
          )
        )
      );
    }
  }]);

  return TrendComparison;
}(React.Component);

function EmployingIndustriesRow(props) {
  var industry = props.industry;

  var inOccupationJobsPerc = industry.in_occupation_jobs_perc;
  var divStyle = { background: "linear-gradient(" + "to right, " + "lightblue " + toPercent(inOccupationJobsPerc, 0) + "%, " + "white " + toPercent(inOccupationJobsPerc, 0) + "%)" };

  return React.createElement(
    "tr",
    { style: divStyle },
    React.createElement(
      "td",
      null,
      "\uD83C\uDFE2 ",
      industry.title
    ),
    React.createElement(
      "td",
      null,
      formatNumber(industry.in_occupation_jobs)
    ),
    React.createElement(
      "td",
      null,
      toPercent(industry.in_occupation_jobs_perc, 1),
      "%"
    ),
    React.createElement(
      "td",
      null,
      toPercent(industry.jobs_perc, 1),
      "%"
    )
  );
}

function EmployingIndustries(props) {
  var ei = props.data.employing_industries;

  ei.industries.sort(function (a, b) {
    return b.in_occupation_jobs - a.in_occupation_jobs;
  });

  ei.industries.forEach(function (industry) {
    industry.in_occupation_jobs_perc = industry.in_occupation_jobs / ei.jobs;
    industry.jobs_perc = industry.in_occupation_jobs / industry.jobs;
  });

  var tableRows = ei.industries.map(function (industry) {
    return React.createElement(EmployingIndustriesRow, { key: industry.title, industry: industry });
  });

  return React.createElement(
    "section",
    { className: "employing-industries" },
    React.createElement(
      "h3",
      null,
      "Industries Employing Computer Programmers"
    ),
    React.createElement(
      "table",
      null,
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            null,
            "Industry"
          ),
          React.createElement(
            "th",
            null,
            "Occupation Jobs in Industry (",
            ei.year,
            ")"
          ),
          React.createElement(
            "th",
            null,
            "% of Occupation in Industry (",
            ei.year,
            ")"
          ),
          React.createElement(
            "th",
            null,
            "% of Total Jobs in Industry (",
            ei.year,
            ")"
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        tableRows
      )
    )
  );
}

function App(props) {
  var data = props.data;

  return React.createElement(
    "div",
    null,
    React.createElement(Header, { data: data }),
    React.createElement(Summary, { data: data }),
    React.createElement(TrendComparison, { data: data }),
    React.createElement(EmployingIndustries, { data: data })
  );
}

document.addEventListener("DOMContentLoaded", function (_event) {
  var request = {
    occupation: "15-1131",
    area_type: "msa",
    area_code: "42660"
  };

  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  };

  fetch("/api/occupations", options).then(function (response) {
    if (!response.ok) {
      throw new Error("Error fetching data from server!");
    }
    return response.json();
  }).then(function (data) {
    ReactDOM.render(React.createElement(App, { data: data }), document.getElementById("react-root"));
  }).catch(function (error) {
    return console.log(error);
  });
});