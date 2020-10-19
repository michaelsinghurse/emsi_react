"use strict";

const formatNumber = number => {
  return number.toLocaleString("en-US", {maximumFractionDigits: 0});
};

const toPercent = (number, digits) => {
  return (number * 100).toLocaleString("en-US", 
    {minimumFractionDigits: digits, maximumFractionDigits: digits});
};

const toCurrency = number => {
  return number.toLocaleString("en-US", {style: "currency", currency: "USD"});
};

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
  const data = props.data;

  return (
    <header>
      <h1>Occupation Overview</h1>
      <h2>{data.occupation.title} in {data.region.title}</h2>
    </header>
  );
}

function Summary(props) {
  const data = props.data;
  const summary = data.summary;

  return (
    <section className="summary">
      <h3>Occupation Summary for {data.occupation.title}</h3>
      <ul>
        <li>
          <p>{formatNumber(summary.jobs.regional)}</p>
          <p>Jobs ({summary.jobs.year})</p>
          <p>{toPercent(summary.jobs.perc_diff, 0)}% 
            {summary.jobs.perc_diff >= 0 &&
              <span className="green"> above </span> 
            }
            {summary.jobs.perc_diff < 0 &&
              <span className="red"> below </span>
            }
            National average</p>
        </li>
        <li>
          <p>
            {summary.jobs_growth.regional >= 0 &&
              <span className="green">+{summary.jobs_growth.regional}%</span>
            }
            {summary.jobs_growth.regional < 0 &&
              <span className="red">-{summary.jobs_growth.regional}%</span>
            } 
          </p>
          <p>
            % Change ({summary.jobs_growth.start_year}-{summary.jobs_growth.end_year})
          </p>
          <p>Nation: 
            {summary.jobs_growth.national_avg >= 0 &&
              <span className="green"> +{summary.jobs_growth.national_avg}%</span>
            }
            {summary.jobs_growth.national_avg < 0 && 
              <span className="red"> -{summary.jobs_growth.national_avg}%</span>
            }
          </p>
        </li>
        <li>
          <p>{toCurrency(summary.earnings.regional)}/hr</p>
          <p>Median Hourly Earnings</p>
          <p>Nation: {toCurrency(summary.earnings.national_avg)}/hr</p>
        </li>
      </ul>
    </section>
  );
}

function TrendComparison(props) {
  const trendComparison = props.data.trend_comparison;

  return (
    <section className="trend-comparison">
      <h3>Regional Trends</h3>
      <div className="trend-comparison-chart"></div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Region</th>
            <th>{trendComparison.start_year} jobs</th>
            <th>{trendComparison.end_year} jobs</th>
            <th>Change</th>
            <th>% Change</th>
          </tr>
        </thead>
        <tbody>
          <tr className="trend-comparison-region">
            <td>&#x25CF;</td>
            <td>Region</td>
            <td>{formatNumber(trendComparison.regional[0])}</td>
            <td>{formatNumber(trendComparison.regional[trendComparison.regional.length - 1])}</td>
            <td>{formatNumber(trendComparison.regional_change)}</td>
            <td>{toPercent(trendComparison.regional_change_perc, 1)}%</td>
          </tr> 
          <tr className="trend-comparison-state">
            <td>&#x25A0;</td>
            <td>State</td>
            <td>{formatNumber(trendComparison.state[0])}</td>
            <td>{formatNumber(trendComparison.state[trendComparison.state.length - 1])}</td>
            <td>{formatNumber(trendComparison.state_change)}</td>
            <td>{toPercent(trendComparison.state_change_perc, 1)}%</td>
          </tr> 
          <tr className="trend-comparison-nation">
            <td>&#x25B2;</td>
            <td>Nation</td>
            <td>{formatNumber(trendComparison.nation[0])}</td>
            <td>{formatNumber(trendComparison.nation[trendComparison.nation.length - 1])}</td>
            <td>{formatNumber(trendComparison.nation_change)}</td>
            <td>{toPercent(trendComparison.nation_change_perc, 1)}%</td>
          </tr> 
        </tbody>
      </table>
    </section>
  );
}

function EmployingIndustriesRow(props) {
  const industry = props.industry;

  const inOccupationJobsPerc = industry.in_occupation_jobs_perc;
  const divStyle = { background: "linear-gradient(" + 
    "to right, " +
    "lightblue " + toPercent(inOccupationJobsPerc, 0) + "%, " +
    "white " + toPercent(inOccupationJobsPerc, 0) + "%)" };

  return (
    <tr style={divStyle} >
      <td>&#x1F3E2; {industry.title}</td>
      <td>{formatNumber(industry.in_occupation_jobs)}</td>
      <td>{toPercent(industry.in_occupation_jobs_perc, 1)}%</td>
      <td>{toPercent(industry.jobs_perc, 1)}%</td>
    </tr>
  );
}

function EmployingIndustries(props) {
  const employingIndustries = props.data.employing_industries;
  
  const tableRows = employingIndustries.industries.map(industry => {
    return <EmployingIndustriesRow key={industry.title} industry={industry} />
  });

  return (
    <section className="employing-industries">
      <h3>Industries Employing Computer Programmers</h3>
      <table>
        <thead>
          <tr>
            <th>Industry</th>
            <th>Occupation Jobs in Industry ({employingIndustries.year})</th>
            <th>% of Occupation in Industry ({employingIndustries.year})</th>
            <th>% of Total Jobs in Industry ({employingIndustries.year})</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </section>
  );
}

function App(props) {
  const data = addMetrics(props.data);
  
  return (
    <div>
      <Header data={data} />
      <Summary data={data} />
      <TrendComparison data={data} />
      <EmployingIndustries data={data} />
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


