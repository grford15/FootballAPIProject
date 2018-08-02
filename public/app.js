const app = function(){
  const url = 'http://ufc-data-api.ufc.com/api/v1/us/';
  const fighterURL = 'http://ufc-data-api.ufc.com/api/v1/us/fighters';
}

const makeRequest = function(url, callback){
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('load', callback);
  request.send();
};

const requestComplete = function(response){
  

}

window.addEventListener('load', function(){

})
