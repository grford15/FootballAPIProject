const app = function(){
  const url = 'http://ufc-data-api.ufc.com/api/v1/us/';
  const fighterURL = 'http://ufc-data-api.ufc.com/api/v1/us/fighters';
  makeRequest(fighterURL, requestComplete);
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
  const activeFighters = _.filter(fighters, ['fighter_status', 'Active'])
  const sortedFigthers = _.sortBy(activeFighters, 'last_name')
  populateSelect(sortedFigthers);
  getFighter(sortedFigthers);
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

const fighterProfile = function(fighter){
  const div = document.getElementById('fighter-profile')
  const fighterName = document.createElement('h2')
  fighterName.innerText = `${fighter.first_name} ${fighter.last_name}`
  const weightClass = document.createElement('p')
  weightClass.innerText = `Weight Class: ${fighter.weight_class}`
  const profilePicture = document.createElement('img')
  profilePicture.src = fighter.thumbnail
  div.appendChild(fighterName)
  div.appendChild(weightClass)
  div.appendChild(profilePicture)
  return div;
}

window.addEventListener('load', app)
