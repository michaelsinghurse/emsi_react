"use strict";

function addMetrics(data) {
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
}

function Header(props) {
  return (
    <div>
      <h1>Occupation Overview</h1>
      <h2>{props.data.occupation.title} in {props.data.region.title}</h2>
    </div>
  );
}

function Summary(props) {
  return (
    <div></div>
  );
}

function TrendComparison(props) {
  return (
    <div></div>
  );
}

function EmployingIndustries(props) {
  return (
    <div></div>
  );
}

function App(props) {
  return (
    <div>
      <Header data={props.data} />
      <Summary data={props.data} />
      <TrendComparison data={props.data} />
      <EmployingIndustries data={props.data} />
    </div>
  );
}

document.addEventListener("DOMContentLoaded", _event => {
  const request = {
    occupation: "15-1131",
    area_type: "msa",
    area_code: "42660",
  };
  
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  };

  fetch("/api/occupations", options)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error fetching data from server!");
      }
      return response.json();
    })
    .then(data => {
      ReactDOM.render(
        <App data={data} />,
        document.getElementById("react-root")
      );
    })
    .catch(error => console.log(error));
});

/*
  <header>
  </header>
  <main>
    <div id="summary-root">
    </div>
    <div id="trend-comparison-root">
    </div>
    <div id="employing-industries-root">
    </div>
  </main>

  <script id="headerTemplate" type="text/x-handlebars-template">
    <h1>Occupation Overview</h1>
    <h2>{{occupation.title}} in {{region.title}}</h2>
  </script>

  <script id="summaryTemplate" type="text/x-handlebars-template">
    <section class="summary">
      <h3>Occupation Summary for {{occupation.title}}</h3>
      <ul>
        <li>
          <p>{{formatNumber summary.jobs.regional}}</p>
          <p>Jobs ({{summary.jobs.year}})</p>
          <p>{{toPercent summary.jobs.perc_diff}}% 
            {{#if (isPositive summary.jobs.perc_diff)}}
              <span class="green">above</span> 
            {{else}}
              <span class="red">below</span>
            {{/if}}
            National average</p>
        </li><!--
        --><li>
          <p>
            {{#if (isPositive summary.jobs_growth.regional)}}
              <span class="green">+{{summary.jobs_growth.regional}}%</span>
            {{else}}
              <span class="red">-{{summary.jobs_growth.regional}}%</span>
            {{/if}} 
          </p>
          <p>
            % Change ({{summary.jobs_growth.start_year}}-{{summary.jobs_growth.end_year}})
          </p>
          <p>Nation: 
            {{#if (isPositive summary.jobs_growth.national_avg)}}
              <span class="green">+{{summary.jobs_growth.national_avg}}%</span>
            {{else}}
              <span class="red">{{summary.jobs_growth.national_avg}}%</span>
            {{/if}}
          </p>
        </li><!--
        --><li>
          <p>${{summary.earnings.regional}}/hr</p>
          <p>Median Hourly Earnings</p>
          <p>Nation: ${{summary.earnings.national_avg}}/hr</p>
        </li>
      </ul>
    </section>
  </script>

  <script id="trendComparisonTemplate" type="text/x-handlebars-template">
    <section class="trend-comparison">
      <h3>Regional Trends</h3>
      <div class="trend-comparison-chart"></div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Region</th>
            <th>{{trend_comparison.start_year}} jobs</th>
            <th>{{trend_comparison.end_year}} jobs</th>
            <th>Change</th>
            <th>% Change</th>
          </tr>
        </thead>
        <tbody>
          <tr class="trend-comparison-region">
            <td>&#x25CF;</td>
            <td>Region</td>
            <td>{{formatNumber trend_comparison.regional.[0]}}</td>
            <td>{{formatNumber (lastElement trend_comparison.regional)}}</td>
            <td>{{formatNumber trend_comparison.regional_change}}</td>
            <td>{{toPercent trend_comparison.regional_change_perc}}%</td>
          </tr> 
          <tr class="trend-comparison-state">
            <td>&#x25A0;</td>
            <td>State</td>
            <td>{{formatNumber trend_comparison.state.[0]}}</td>
            <td>{{formatNumber (lastElement trend_comparison.state)}}</td>
            <td>{{formatNumber trend_comparison.state_change}}</td>
            <td>{{toPercent trend_comparison.state_change_perc}}%</td>
          </tr> 
          <tr class="trend-comparison-nation">
            <td>&#x25B2;</td>
            <td>Nation</td>
            <td>{{formatNumber trend_comparison.nation.[0]}}</td>
            <td>{{formatNumber (lastElement trend_comparison.nation)}}</td>
            <td>{{formatNumber trend_comparison.nation_change}}</td>
            <td>{{toPercent trend_comparison.nation_change_perc}}%</td>
          </tr> 
        </tbody>
      </table>
    </section>
  </script>

  <script id="employingIndustriesTemplate" type="text/x-handlebars-template">
    <section class="employing-industries">
      <h3>Industries Employing Computer Programmers</h3>
      <table>
        <thead>
          <tr>
            <th>Industry</th>
            <th>Occupation Jobs in Industry ({{employing_industries.year}})</th>
            <th>% of Occupation in Industry ({{employing_industries.year}})</th>
            <th>% of Total Jobs in Industry ({{employing_industries.year}})</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: linear-gradient(
            to right, 
            lightblue {{toPercent employing_industries.industries.[0].in_occupation_jobs_perc}}%, 
            white {{toPercent employing_industries.industries.[0].in_occupation_jobs_perc}}%);">
            <td>&#x1F3E2 {{employing_industries.industries.[0].title}}</td>
            <td>{{formatNumber employing_industries.industries.[0].in_occupation_jobs}}</td>
            <td>{{toPercent employing_industries.industries.[0].in_occupation_jobs_perc}}%</td>
            <td>{{toPercent employing_industries.industries.[0].jobs_perc}}%</td>
          </tr>
          <tr style="background: linear-gradient(
            to right, 
            lightblue {{toPercent employing_industries.industries.[1].in_occupation_jobs_perc}}%, 
            white {{toPercent employing_industries.industries.[1].in_occupation_jobs_perc}}%);">
            <td>&#x1F3E2 {{employing_industries.industries.[1].title}}</td>
            <td>{{formatNumber employing_industries.industries.[1].in_occupation_jobs}}</td>
            <td>{{toPercent employing_industries.industries.[1].in_occupation_jobs_perc}}%</td>
            <td>{{toPercent employing_industries.industries.[1].jobs_perc}}%</td>
          </tr>
          <tr style="background: linear-gradient(
            to right, 
            lightblue {{toPercent employing_industries.industries.[2].in_occupation_jobs_perc}}%, 
            white {{toPercent employing_industries.industries.[2].in_occupation_jobs_perc}}%);">
            <td>&#x1F3E2 {{employing_industries.industries.[2].title}}</td>
            <td>{{formatNumber employing_industries.industries.[2].in_occupation_jobs}}</td>
            <td>{{toPercent employing_industries.industries.[2].in_occupation_jobs_perc}}%</td>
            <td>{{toPercent employing_industries.industries.[2].jobs_perc}}%</td>
          </tr>
          <tr style="background: linear-gradient(
            to right, 
            lightblue {{toPercent employing_industries.industries.[3].in_occupation_jobs_perc}}%, 
            white {{toPercent employing_industries.industries.[3].in_occupation_jobs_perc}}%);">
            <td>&#x1F3E2 {{employing_industries.industries.[3].title}}</td>
            <td>{{formatNumber employing_industries.industries.[3].in_occupation_jobs}}</td>
            <td>{{toPercent employing_industries.industries.[3].in_occupation_jobs_perc}}%</td>
            <td>{{toPercent employing_industries.industries.[3].jobs_perc}}%</td>
          </tr>
          <tr style="background: linear-gradient(
            to right, 
            lightblue {{toPercent employing_industries.industries.[4].in_occupation_jobs_perc}}%, 
            white {{toPercent employing_industries.industries.[4].in_occupation_jobs_perc}}%);">
            <td>&#x1F3E2 {{employing_industries.industries.[4].title}}</td>
            <td>{{formatNumber employing_industries.industries.[4].in_occupation_jobs}}</td>
            <td>{{toPercent employing_industries.industries.[4].in_occupation_jobs_perc}}%</td>
            <td>{{toPercent employing_industries.industries.[4].jobs_perc}}%</td>
          </tr>
        </tbody>
      </table>
    </section>
  </script>
*/
