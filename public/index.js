"use strict";

const App = {
  headerTemplate: null,
  summaryTemplate: null,
  trendComparisonTemplate: null,
  employingIndustriesTemplate: null,

  addMetrics(data) {
    data.summary.jobs.perc_diff = 
      (data.summary.jobs.regional - data.summary.jobs.national_avg)
      / data.summary.jobs.national_avg + 1;

    data.trend_comparison.regional_change =
      data.trend_comparison.regional[data.trend_comparison.regional.length - 1]
      - data.trend_comparison.regional[0];
    
    data.trend_comparison.regional_change_perc =
      data.trend_comparison.regional_change / data.trend_comparison.regional[0];

    data.trend_comparison.state_change =
      data.trend_comparison.state[data.trend_comparison.state.length - 1]
      - data.trend_comparison.state[0];
    
    data.trend_comparison.state_change_perc =
      data.trend_comparison.state_change / data.trend_comparison.state[0];

    data.trend_comparison.nation_change =
      data.trend_comparison.nation[data.trend_comparison.nation.length - 1]
      - data.trend_comparison.nation[0];
    
    data.trend_comparison.nation_change_perc =
      data.trend_comparison.nation_change / data.trend_comparison.nation[0];

    data.employing_industries.industries.forEach(industry => {
      industry.in_occupation_jobs_perc = 
        industry.in_occupation_jobs / data.employing_industries.jobs;
      industry.jobs_perc = industry.in_occupation_jobs / industry.jobs;
    });
  },

  compileHtmlTemplates() {
    this.headerTemplate = Handlebars.compile($("#headerTemplate").html());
    this.summaryTemplate = Handlebars.compile($("#summaryTemplate").html());
    this.trendComparisonTemplate = 
      Handlebars.compile($("#trendComparisonTemplate").html());
    this.employingIndustriesTemplate = 
      Handlebars.compile($("#employingIndustriesTemplate").html());

    Handlebars.registerHelper("formatNumber", number => {
      return number.toLocaleString("en-US", {maximumFractionDigits: 0});
    });

    Handlebars.registerHelper("toPercent", number => {
      return (number * 100).toLocaleString("en-US", 
        {minimumFractionDigits: 1, maximumFractionDigits: 1});
    });

    Handlebars.registerHelper("lastElement", array => array[array.length - 1]);

    Handlebars.registerHelper("isPositive", number => number >= 0);
  },

  handleServerResponse(data) {
    this.addMetrics(data);
    this.renderHtmlTemplates(data);
  },

  init() {
    this.compileHtmlTemplates();
    
    const request = {
      occupation: "15-1131",
      area_type: "msa",
      area_code: "42660",
    };
    
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    };

    fetch("/api/occupations", fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error fetching data from server!");
        }
        return response.json();
      })
      .then(data => this.handleServerResponse(data));
  },

  renderHtmlTemplates(data) {
    $("header").html(this.headerTemplate(data));    
    $("#summary-root").html(this.summaryTemplate(data));
    $("#trend-comparison-root").html(this.trendComparisonTemplate(data));
    $("#employing-industries-root").html(this.employingIndustriesTemplate(data));
  },
};

document.addEventListener("DOMContentLoaded", _event => {
  App.init(); 
});
