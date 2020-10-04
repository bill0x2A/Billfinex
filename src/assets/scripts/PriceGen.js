const fs = require('fs');
const start = Date.now();
var os = require("os");

let currentPrice     = 6180;
    counter          = 0,
    internalCounter  = 0,
    candleTracker    = 0,
    thisPhaseCounter = 0,
    candleLimit      = 350;

let candleBuffer     = [],
    nextPhase        = [],
    thisTrend        = [],
    thisCounterTrend = [];

const phaseLength = 500,
      counterTrendPeriod = 50;

function nextPrice(){

    if(counter % phaseLength == 0){
        thisPhase = phaseSelector("normal");
        thisPhaseCounter = 0;

        counterTrendPeriods = Math.round(Math.random() * 3);

        [trend, counterTrend] = phaseGen(thisPhase);
        console.log([trend, counterTrend])
    }

    let decisionSelection = [];

    if(thisPhase < (phaseLength/counterTrendPeriods)){
        decisionSelection = trend;
    } else if (thisPhase < ((phaseLength/counterTrendPeriods) + counterTrendPeriod)){
        decisionSelection = counterTrend;
    } else if (thisPhase < (2 * phaseLength/counterTrendPeriods)){
        decisionSelection = trend;
    } else if (thisPhase < ((2 * phaseLength/counterTrendPeriods) + counterTrendPeriod)){
        decisionSelection = counterTrend;
    } else if (thisPhase < (3 * phaseLength/counterTrendPeriods)){
        decisionSelection = trend;
    } else if (thisPhase < ((3 * phaseLength/counterTrendPeriods) + counterTrendPeriod)){
        decisionSelection = counterTrend;
    } else {
        decisionSelection = trend;
    }



    const randomIndex = Math.round(Math.random() * (decisionSelection.length - 1));
    
    let newPrice =  currentPrice;

    if(currentPrice > 1){
        currentPrice += (decisionSelection[randomIndex]);
        newPrice =  currentPrice;
    }    
    
    candleTracker += 1;
    counter += 1;
    thisPhaseCounter += 1;


    if(candleTracker > candleLimit){
        writeData(candleBuffer);
        candleBuffer = [];
        candleTracker = 0;
    }
    candleBuffer.push(newPrice);
}

function writeData(trades){
    const d = new Date();

    const s = d.getSeconds(),
          m = d.getMinutes(),
          h = d.getHours(),
          day = d.getDay(),
          month = d.getMonth(),
          year = d.getFullYear(),
          time = Date.now(),
          candleData = tradesToCandles(trades);
    processInput((date + ',' + candleData + ',' + time));
    console.log("logging: " + (date + ',' + candleData + ',' + time))
}

function marketCycle(x, a, b, c){
    return Math.abs((a * Math.sin(x/a)) + (b * Math.sin(x/b)) + (c * Math.sin(x/c)) + (200 * Math.sin(x/10)));
}

function processInput ( text ) 
{     
  fs.open("Output.csv", 'a', 666, function( e, id ) {
   fs.write( id, text + os.EOL, null, 'utf8', function(){
    fs.close(id, function(){
        return
    });
   });
  });
 }

function tradesToCandles(trades){
    const open   = trades[0],
          close  = trades[(trades.length-1)],
          low    = Math.min(...trades),
          high    = Math.max(...trades);
    return (open + ',' + high + ',' + low + ',' + close)
}

function selectionArrayGen(ones, zeros, minusOnes){
    const oneArr   = new Array(ones).fill(1),
          zeroArr  = new Array(zeros).fill(0),
          minusArr = new Array(minusOnes).fill(-1);
    return oneArr.concat(zeroArr.concat(minusArr));
}

function marketArrayGen(twos, ones, zeros, minusOnes, minusTwos){
    const   oneArr   = new Array(ones).fill(1),
            zeroArr  = new Array(zeros).fill(0),
            minusArr = new Array(minusOnes).fill(-1),
            twoArr = new Array(twos).fill(2),
            minusTwoArr = new Array(minusTwos).fill(-2);

return (twoArr.concat(oneArr.concat(zeroArr.concat(minusArr.concat(minusTwoArr)))));
}

function phaseGen(phase){
    let trend = [],
        counterTrend = [];

    console.log(phase)

    switch(phase){
        case 2:
            trend = selectionArrayGen(7, 2, 1);
            counterTrend = selectionArrayGen(1,2,5);
            break;
        case 1:
            trend = selectionArrayGen(4, 2, 1);
            counterTrend = selectionArrayGen(2, 1, 4);
            break;
        case 0:
            trend = selectionArrayGen(4, 10, 4);
            counterTrend = selectionArrayGen(4, 10, 4);
            break;
        case -1:
            trend = selectionArrayGen(1, 2, 4);
            counterTrend = selectionArrayGen(4, 1, 2);
            break;
        case -2:
            trend = selectionArrayGen(1, 2, 7);
            counterTrend = selectionArrayGen(5,2,1);
            break;
    }
    return [trend, counterTrend];
}


function phaseSelector(marketConditions){
    let nextPhaseDomain = [];

    switch(marketConditions){
        case "normal":
            nextPhaseDomain = marketArrayGen(1, 4, 4, 3, 1);
            break;
        case "bull":
            nextPhaseDomain = marketArrayGen(4, 3, 0, 1, 1);
            break;
        case "bear":
            nextPhaseDomain = marketArrayGen(0, 3, 3, 5, 4);

    }

    const randomIndex = Math.round(Math.random() * (nextPhaseDomain.length - 1))
    return (nextPhaseDomain[randomIndex]);
}


setInterval(nextPrice, 1);