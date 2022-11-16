//////////////
// we have a basic skeleton here to help you start.
// if you dont want to use it you dont have to -
// just clear the file and start from scratch
//////////////

// notice in our html we have a node with ID "app"
// hint: use this reference later to inject data into your page
const app = document.getElementById('app');
const API_BASE = `https://www.balldontlie.io/api/v1/games?seasons[]=2022`

const dataSort = document.getElementById("data-sort");
dataSort.addEventListener("change", async (event) => {
  console.log("Data Sort Change");
  console.log(event.target.value);
  const data = await getData();
  const sortedData = sortData(data, event.target.value);
  await renderUI(sortedData);
})

const dataFilter = document.getElementById("data-filter");
dataFilter.addEventListener("change", async (event) => {
  console.log("Data Filter Change");
  console.log(event.target.value);
  const data = await getData();
  const filteredData = filterData(data, event.target.value);
  await renderUI(filteredData);
})


async function getData() {
  // write you logic for getting the data from the API here
  // return your data from this function
  let games = []
  // const response = await fetch(API_BASE);
  // const dataFile = await response.json();
  // const pages = dataFile.mata.total_pages;
  // console.log(pages);
  const pages = 13;
  for (let page_num = 1; page_num < pages; page_num++) {
    const API_ENDPOINT = `${API_BASE}&page=${page_num}&per_page=100`;
    const response = await fetch(API_ENDPOINT);
    const dataFile = await response.json()
    dataFile.data.forEach((e) => {
      const game = {
      year: (e.date.substring(0,4)),
      month: (e.date.substring(5,7)),
      day: (e.date.substring(8,10)),
      home: e.home_team.full_name,
      homeScore: e.home_team_score,
      period: (e.period == 4 && e.status == "Final" ? 5 : e.period),
      season: e.season,
      status: e.status,
      time: e.time,
      visitor: e.visitor_team.full_name,
      visitorScore: e.visitor_team_score};
      games.push(game);
    });
  }
  games = filterData(games, dataFilter.value);
  games = sortData(games, dataSort.value);
  return games;
}

function filterData(data, key){
    if (key==="ended") {
      return data.filter((game) => game.period > 4);
    } else {
      if (key==="future") {
        return data.filter((game) => game.period < 1);
      } else {
        if (key==="live") {
          return data.filter((game) => (game.period > 0 && game.period < 5));} }}
}

function sortData(data, key) {
  data = data.sort((a, b) => {
    if (a.year > b.year) {
      return key === "newest" ? 1 : -1;
    }
    if (a.year == b.year && a.month > b.month) {
      return key === "newest" ? 1 : -1;
    }
    if (a.year == b.year && a.month == b.month && a.day > b.day) {
      return key === "newest" ? 1 : -1;
    }
    if (a.year < b.year) {
      return key === "newest" ? -1 : 1;
    }
    if (a.year == b.year && a.month < b.month) {
      return key === "newest" ? -1 : 1;
    }
    if (a.year == b.year && a.month == b.month && a.day < b.day) {
      return key === "newest" ? -1 : 1;
    }
    return 0;
  })
  return data;
}


function clearUI() {
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }
}

async function renderUI(data) {
  clearUI();
  if (data.length == 0){
    const dummyItemElement = Object.assign(document.createElement("div"), { className: "item" });
    const dummyContentElement = Object.assign(document.createElement("div"), { className: "content" });
    dummyContentElement.innerHTML = `<h2 id="none">There are no NBA matches currently taking place</h2>`
    dummyItemElement.classList.remove('item'); // removing the hover
    dummyItemElement.appendChild(dummyContentElement);
    app.appendChild(dummyItemElement);
  }

  data.forEach(e => {
    const dummyItemElement = Object.assign(document.createElement("div"), { className: "item" });
    const dummyContentElement = Object.assign(document.createElement("div"), { className: "content" });
    if(e.period == 0) {dummyContentElement.innerHTML = `<h2 id="teams"><span id="home">${e.home}</span> <br>-<br> <span id="visit">${e.visitor}</span></h2><h2 id="score">
    <h3 id="status">${e.status}</h3>
    <h3 id="date">${e.day}.${e.month}.${e.year}</h3>`;
    }
    else{if (e.period == 5) {dummyContentElement.innerHTML = `<h2 id="teams"><span id="home">${e.home}</span> <br>-<br> <span id="visit">${e.visitor}</span></h2><h2 id="score">
    <span id="home-score">${e.homeScore}</span> - <span id="visit-score">${e.visitorScore}</span></h2>
    <h3 id="date">${e.day}.${e.month}.${e.year}</h3>`;
  } else {dummyContentElement.innerHTML = `<h2 id="teams"><span id="home">${e.home}</span> <br>-<br> <span id="visit">${e.visitor}</span></h2><h2 id="score">
    <span id="home-score">${e.homeScore}</span> - <span id="visit-score">${e.visitorScore}</span></h2>
    <h3 id="status">${e.status} | ${e.time}</h3>`;
    }}
    dummyItemElement.appendChild(dummyContentElement);
    app.appendChild(dummyItemElement);
    });


  // you have your data! add logic here to render it to the UI
  // notice in the HTML file we call render();
}
console.log("start session");
const data = await getData();
await renderUI(data);

