const request = require('request');
//cheerio parses html markups and implement JQuery to select DOM elements
const cheerio = require('cheerio');


function getXkcdOld(n) {
  var i = 1;
  (function getURL(i){
    var tempurl = 'https://www.xkcd.com/' + i;
    request(tempurl, function(error, response, body) {
      if (error) console.log('error: ' + error);
      let $ = cheerio.load(body);
      //prints the title of the xkcd comic
      console.log($('title').text() + '\n');
      i++;
      if (i <= n) getURL(i);
    });
  })(i);
}

getXkcdOld(4);


// using Promise
var xkcd = function(i) {
  return new Promise(
    function (resolve, reject) {
      var tempurl = 'https://www.xkcd.com/' + i;
      request(tempurl, function(error, response, body) {
        if (error) reject(error);
        var $ = cheerio.load(body);
        resolve($('title').text() + '\n');
      });
    });
};

//chaining Promises using .then() explicitly
function getXkcdPromise() {
  var result = '';
  xkcd(1)
    .then(fullfilled => {
      result += fullfilled;
    })
    .then(() => xkcd(2))
    .then(fullfilled => {
      result += fullfilled;
    })
    .then(() => xkcd(3))
    .then(fullfilled => {
      result += fullfilled;
    })
    .then(() => xkcd(4))
    .then(fullfilled => {
      result += fullfilled;
      console.log(result);
    });
}

//pushing Promises into an array and use Promise.all
function getXkcdPromiseAll(n) {
  var arr = [];
  for (var i = 1; i <= n; i++) {
    arr.push(xkcd(i));
  }
  Promise.all(arr).then(values => {
    console.log(values.join(''));
  });
}

getXkcdPromiseAll(4);

//using recursive function to get Promises sequentially
function getXkcdSeq(current, doUntil) {
  if (current !== doUntil) {
    xkcd(current)
      .then(title => {
        console.log(title);
        getXkcdSeq(current + 1, doUntil);
      });
  }
}

getXkcdSeq(2, 10);
