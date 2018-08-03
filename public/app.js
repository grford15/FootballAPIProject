const app = function(){
  const url = 'http://ufc-data-api.ufc.com/api/v1/us/';
  const fighterURL = 'http://ufc-data-api.ufc.com/api/v1/us/fighters';
  makeRequest(fighterURL, requestComplete);
  google.charts.load("current", {packages:["corechart"]});
}

const makeRequest = function(url, callback){
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('load', callback);
  request.send();
};

const requestComplete = function(response){
  if(this.status !== 200) return;
  const json = this.responseText;
  fighters = JSON.parse(json);
  const activeFighters = _.filter(fighters, {'fighter_status': 'Active'})
  const sortedFigthers = _.sortBy(activeFighters, 'last_name')
  populateSelect(sortedFigthers);
  getFighter(sortedFigthers);
  MostWins(activeFighters);
}

const populateSelect = function(fighters){
  const select = document.getElementById('fighter-menu');
  fighters.forEach(function(fighter, index){
    let option = document.createElement('option');
    option.innerText = fighter.first_name + " " + fighter.last_name;
    option.value = index;
    select.appendChild(option);
  })
}

const getFighter = function(fighters){
  const selectedFighter = document.querySelector('select')
  selectedFighter.addEventListener('change', function() {
    let fighter = fighters[this.value]
    fighterProfile(fighter);
  })
}

const fighterWinGraph = function(fighter){
  const winData = google.visualization.arrayToDataTable([
          [`${fighter.first_name} ${fighter.last_name}`, 'Record'],
          ['Wins', fighter.wins],
          ['Losses', fighter.losses],
          ['Draws', fighter.draws]
        ]);
  const options = {
    title: 'Fight Records'
  }

  const chart = new google.visualization.PieChart(document.getElementById('fighter-graph'));

  chart.draw(winData, options);

}

const fighterProfile = function(fighter){
  const div = document.getElementById('fighter-profile')
  clearProfile(div)
  const fighterName = document.createElement('h2')
  fighterName.innerText = `${fighter.first_name} ${fighter.last_name}`
  const weightClass = document.createElement('p')
  weightClass.innerText = `Weight Class: ${fighter.weight_class}`
  const profilePicture = document.createElement('img')
  profilePicture.src = fighter.thumbnail
  div.appendChild(fighterName)
  div.appendChild(weightClass)
  if(fighter.title_holder){
    const belt = document.createElement('img')
    belt.src = 'https://www.ufcstore.eu/images/fill/800/800/32300'
    belt.style = 'height:100px; width: 200px;'
    weightClass.appendChild(belt);
  }
  div.appendChild(profilePicture)
  fighterWinGraph(fighter);

  return div;
}

const MostWins = function(fighters) {
  const winDesc = _.sortBy(fighters, 'wins').reverse()
  const winners = _.remove(winDesc, function(n){
    if(n.wins > 0){
      return n;
    };
  })
  const top20 = _.take(winners, 20);
  google.charts.setOnLoadCallback(drawTable, function(){
    const winnerData = new google.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('number', 'Wins');
    data.addRows([
      
    ])
  });
}



const clearProfile = function(node){
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

window.addEventListener('load', app)
