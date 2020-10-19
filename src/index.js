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

  summary.jobs.perc_diff = 1 + 
    (summary.jobs.regional - summary.jobs.national_avg) / summary.jobs.national_avg;

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

class TrendComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trendComparison: props.data.trend_comparison,
    };
  }
  
  componentDidMount() {
    const tc = this.state.trendComparison;
    
    const percChangeArray = array => {
      return array.map((value, index) => {
        if (index === 0) {
          return 0;
        }
        const startValue = array[0];
        return toPercent((value - startValue) / startValue);
      });
    };

    const ctx = document.querySelector(".trend-comparison-chart");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [2013, 2014, 2015, 2016, 2017, 2018],
        datasets: [{
          label: "Regional",
          backgroundColor: "#000000",
          borderColor: "#000000",
          fill: false,
          data: percChangeArray(tc.regional),
        }, {
          label: "State",
          backgroundColor: "#4169E1",
          borderColor: "#4169E1",
          fill: false,
          data: percChangeArray(tc.state),
        }, {
          label: "Nation",
          backgroundColor: "#ADD8E6",
          borderColor: "#ADD8E6",
          fill: false,
          data: percChangeArray(tc.nation),
        }],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          x: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Year",
            },
          },
          y: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Percent Change",
            },
          },
        },
      },
    });
  }
  
  render() {
    const tc = this.state.trendComparison;

    tc.regional_change = tc.regional[tc.regional.length - 1] - tc.regional[0];
    tc.regional_change_perc = tc.regional_change / tc.regional[0];

    tc.state_change = tc.state[tc.state.length - 1] - tc.state[0];
    tc.state_change_perc = tc.state_change / tc.state[0];

    tc.nation_change = tc.nation[tc.nation.length - 1] - tc.nation[0];
    tc.nation_change_perc = tc.nation_change / tc.nation[0];

    return (
      <section className="trend-comparison">
        <h3>Regional Trends</h3>
        <canvas className="trend-comparison-chart"></canvas>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Region</th>
              <th>{tc.start_year} jobs</th>
              <th>{tc.end_year} jobs</th>
              <th>Change</th>
              <th>% Change</th>
            </tr>
          </thead>
          <tbody>
            <tr className="trend-comparison-region">
              <td>&#x25CF;</td>
              <td>Region</td>
              <td>{formatNumber(tc.regional[0])}</td>
              <td>{formatNumber(tc.regional[tc.regional.length - 1])}</td>
              <td>{formatNumber(tc.regional_change)}</td>
              <td>{toPercent(tc.regional_change_perc, 1)}%</td>
            </tr> 
            <tr className="trend-comparison-state">
              <td>&#x25A0;</td>
              <td>State</td>
              <td>{formatNumber(tc.state[0])}</td>
              <td>{formatNumber(tc.state[tc.state.length - 1])}</td>
              <td>{formatNumber(tc.state_change)}</td>
              <td>{toPercent(tc.state_change_perc, 1)}%</td>
            </tr> 
            <tr className="trend-comparison-nation">
              <td>&#x25B2;</td>
              <td>Nation</td>
              <td>{formatNumber(tc.nation[0])}</td>
              <td>{formatNumber(tc.nation[tc.nation.length - 1])}</td>
              <td>{formatNumber(tc.nation_change)}</td>
              <td>{toPercent(tc.nation_change_perc, 1)}%</td>
            </tr> 
          </tbody>
        </table>
      </section>
    );
  }
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
  const ei = props.data.employing_industries;
  
  ei.industries.forEach(industry => {
    industry.in_occupation_jobs_perc = industry.in_occupation_jobs / ei.jobs;
    industry.jobs_perc = industry.in_occupation_jobs / industry.jobs;
  });

  const tableRows = ei.industries.map(industry => {
    return <EmployingIndustriesRow key={industry.title} industry={industry} />
  });

  return (
    <section className="employing-industries">
      <h3>Industries Employing Computer Programmers</h3>
      <table>
        <thead>
          <tr>
            <th>Industry</th>
            <th>Occupation Jobs in Industry ({ei.year})</th>
            <th>% of Occupation in Industry ({ei.year})</th>
            <th>% of Total Jobs in Industry ({ei.year})</th>
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
  const data = props.data;

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


