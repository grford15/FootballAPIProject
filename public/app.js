const app = function(){
  const url = 'http://ufc-data-api.ufc.com/api/v1/us/';
  const fighterURL = 'http://ufc-data-api.ufc.com/api/v1/us/fighters';
  makeRequest(fighterURL, requestComplete);
  google.charts.load("current", {packages:["corechart"]});
  google.charts.load('current', {'packages':['table']});
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
  beltHolders(activeFighters);
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
    belt.style = 'height:100px; width: 150px;'
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
  google.charts.setOnLoadCallback(function(){
    const winnersData = new google.visualization.DataTable();
    winnersData.addColumn('string', 'Name');
    winnersData.addColumn('number', 'Wins');
    _.forEach(top20, function(fighter){
      winnersData.addRows([
            [fighter.first_name + " " + fighter.last_name,  fighter.wins]
          ]);
    })
    const winnerTable = new google.visualization.Table(document.getElementById('win-table'));
    winnerTable.draw(winnersData, {showRowNumber: true, width: '100%', height: '100%'});
  });
}

const beltHolders = function(fighters){
  const champions = _.filter(fighters, {'title_holder': true});
  let flyweight = _.find(champions, {'weight_class': 'Flyweight'});
  let bantamweight = _.find(champions, {'weight_class': 'Bantamweight'});
  let featherweight = _.find(champions, {'weight_class': 'Featherweight'});
  let lightweight = _.find(champions, {'weight_class': 'Lightweight'});
  let welterweight = _.find(champions, {'weight_class': 'Welterweight'});
  let middleweight = _.find(champions, {'weight_class': 'Middleweight'});
  let lightHeavyWeight = _.find(champions, {'weight_class': 'Light_Heavyweight'});
  google.charts.setOnLoadCallback(function(){
    const champData = new google.visualization.DataTable();
    champData.addColumn('string', 'Weight Class');
    champData.addColumn('string', 'Name');
    champData.addRows([
      ['Flyweight', `${flyweight.first_name} ${flyweight.last_name}`],
      ['Bantamweight', `${bantamweight.first_name} ${bantamweight.last_name}`],
      ['Featherweight', `${featherweight.first_name} ${featherweight.last_name}`],
      ['Lightweight', `${lightweight.first_name} ${lightweight.last_name}`],
      ['Welterweight', `${welterweight.first_name} ${welterweight.last_name}`],
      ['Middleweight', `${middleweight.first_name} ${middleweight.last_name}`],
      ['Light-Heavyweight', `${lightHeavyWeight.first_name} ${lightHeavyWeight.last_name}`],
      ['Heavyweight', `${lightHeavyWeight.first_name} ${lightHeavyWeight.last_name}`]
    ])
    const champTable = new google.visualization.Table(document.getElementById('champ-table'));
    champTable.draw(champData, {showRowNumber: true, width: '100%', height: '100%'});
  })
}


const clearProfile = function(node){
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

window.addEventListener('load', app)
