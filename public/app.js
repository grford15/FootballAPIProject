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
  populateSelect(fighters);
}

const populateSelect = function(fighters){
  const select = document.getElementById('fighter-menu');
  fighters.forEach(function(fighter, index){
    if(fighter.fighter_status === 'Active'){
    let option = document.createElement('option');
    option.innerText = fighter.first_name + " " + fighter.last_name;
    option.value = index;
    select.appendChild(option);}
  })
}

window.addEventListener('load', app)
