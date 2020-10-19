"use strict";

var formatNumber = function formatNumber(number) {
  return number.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

var toPercent = function toPercent(number, digits) {
  return (number * 100).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
};

var toCurrency = function toCurrency(number) {
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

function addMetrics(data) {
  data.summary.jobs.perc_diff = (data.summary.jobs.regional - data.summary.jobs.national_avg) / data.summary.jobs.national_avg + 1;

  data.trend_comparison.regional_change = data.trend_comparison.regional[data.trend_comparison.regional.length - 1] - data.trend_comparison.regional[0];

  data.trend_comparison.regional_change_perc = data.trend_comparison.regional_change / data.trend_comparison.regional[0];

  data.trend_comparison.state_change = data.trend_comparison.state[data.trend_comparison.state.length - 1] - data.trend_comparison.state[0];

  data.trend_comparison.state_change_perc = data.trend_comparison.state_change / data.trend_comparison.state[0];

  data.trend_comparison.nation_change = data.trend_comparison.nation[data.trend_comparison.nation.length - 1] - data.trend_comparison.nation[0];

  data.trend_comparison.nation_change_perc = data.trend_comparison.nation_change / data.trend_comparison.nation[0];

  data.employing_industries.industries.forEach(function (industry) {
    industry.in_occupation_jobs_perc = industry.in_occupation_jobs / data.employing_industries.jobs;
    industry.jobs_perc = industry.in_occupation_jobs / industry.jobs;
  });
}

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
            "-",
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
            " -",
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

function TrendComparison(props) {
  var trendComparison = props.data.trend_comparison;

  return React.createElement(
    "section",
    { className: "trend-comparison" },
    React.createElement(
      "h3",
      null,
      "Regional Trends"
    ),
    React.createElement("div", { className: "trend-comparison-chart" }),
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
            trendComparison.start_year,
            " jobs"
          ),
          React.createElement(
            "th",
            null,
            trendComparison.end_year,
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
            formatNumber(trendComparison.regional[0])
          ),
          React.createElement(
            "td",
            null,
            formatNumber(trendComparison.regional[trendComparison.regional.length - 1])
          ),
          React.createElement(
            "td",
            null,
            formatNumber(trendComparison.regional_change)
          ),
          React.createElement(
            "td",
            null,
            toPercent(trendComparison.regional_change_perc, 1),
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
            formatNumber(trendComparison.state[0])
          ),
          React.createElement(
            "td",
            null,
            formatNumber(trendComparison.state[trendComparison.state.length - 1])
          ),
          React.createElement(
            "td",
            null,
            formatNumber(trendComparison.state_change)
          ),
          React.createElement(
            "td",
            null,
            toPercent(trendComparison.state_change_perc, 1),
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
            formatNumber(trendComparison.nation[0])
          ),
          React.createElement(
            "td",
            null,
            formatNumber(trendComparison.nation[trendComparison.nation.length - 1])
          ),
          React.createElement(
            "td",
            null,
            formatNumber(trendComparison.nation_change)
          ),
          React.createElement(
            "td",
            null,
            toPercent(trendComparison.nation_change_perc, 1),
            "%"
          )
        )
      )
    )
  );
}

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
  var employingIndustries = props.data.employing_industries;

  var tableRows = employingIndustries.industries.map(function (industry) {
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
            employingIndustries.year,
            ")"
          ),
          React.createElement(
            "th",
            null,
            "% of Occupation in Industry (",
            employingIndustries.year,
            ")"
          ),
          React.createElement(
            "th",
            null,
            "% of Total Jobs in Industry (",
            employingIndustries.year,
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
  var data = addMetrics(props.data);

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