import React, { Component } from 'react';
import classes from './Graph.module.css';
import * as d3 from 'd3';
import * as _ from 'lodash';
import data from '../../assets/scripts/Output.csv';
import EthLogo from '../../assets/imgs/ETH.svg';
import XrpLogo from '../../assets/imgs/XRP.svg';
import BtcLogo from '../../assets/imgs/BTC.svg';
import EosLogo from '../../assets/imgs/EOS.svg';



class Graph extends Component {

  state = {
    firstLoad    : true,
    candleData   : [],
    currentPrice : this.props.coin.price,
    counter      : 0,
    phaseLength  : 500,
    counterTrendPeriod : 50,
    candleTracker : 0,
    thisPhaseCounter : 0,
    candleLimit : 800,
    internalCounter : 0,
    trend : [],
    counterTrend : [],
    candleBuffer : [],
    macroTrend : this.props.trend

  }

     drawChart = () => {
d3.csv(data).then(starterPrices => {
      this.clearChart();
      const newPrices = this.state.candleData;
      const prices = starterPrices.concat(newPrices);
            
            const months = {0 : 'Jan', 1 : 'Feb', 2 : 'Mar', 3 : 'Apr', 4 : 'May', 5 : 'Jun', 6 : 'Jul', 7 : 'Aug', 8 : 'Sep', 9 : 'Oct', 10 : 'Nov', 11 : 'Dec'}

            for (var i = 0; i < prices.length; i++) {
 
                const newDate = new Date(parseInt(prices[i]['Time']));
                
                prices[i]['Date'] = newDate;

            }
            const margin = {top: 15, right: 20, bottom: 80, left: 50},
            w = this.props.width - margin.left - margin.right - 4,
            h = 502 - margin.top - margin.bottom;
    
            var svg = d3.select("#container")
                            .attr("width", w + margin.left + margin.right)
                            .attr("height", h + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left+ "," +margin.top+ ")");
    
            let dates = _.map(prices, 'Date');
            
            var xmin = d3.min(prices.map(r => {
                return r.Date.getTime()
            }));
            var xmax = d3.max(prices.map(r => r.Date.getTime()));
            var xScale = d3.scaleLinear().domain([0, dates.length-1])
                            .range([0, w])
            var xDateScale = d3.scaleQuantize().domain([0, dates.length]).range(dates)
            let xBand = d3.scaleBand().domain(d3.range(-1, dates.length)).range([0, w]).padding(0.3)
            var xAxis = d3.axisBottom()
                                      .scale(xScale)
                                      .tickFormat(function(d) {
                                          var d = dates[d]
                                            var seconds = d.getSeconds();
                                            var hours = d.getHours()
                                            var minutes = (d.getMinutes()<10?'0':'') + d.getMinutes() 
                                            var amPM = hours < 13 ? 'am' : 'pm'
                                            return hours + ':' + minutes + ':' + seconds +  ' ' + amPM;
                                        })
                                      .tickSizeInner(-h);
            
            svg.append("rect")
                        .attr("id","rect")
                        .attr("width", w)
                        .attr("height", h)
                        .style("fill", "none")
                        .style("pointer-events", "all")
                        .attr("clip-path", "url(#clip)")
            
            var gX = svg.append("g")
                        .attr("class", "axis x-axis") //Assign "axis" class
                        .attr("transform", "translate(0," + h + ")")
                        .call(xAxis)
            
            gX.selectAll(".tick text")
              .call(this.wrap, xBand.bandwidth())
    
            var ymin = d3.min(prices.map(r => r.Low));
            var ymax = d3.max(prices.map(r => r.High));
            var yScale = d3.scaleLinear().domain([ymin, ymax]).range([h, 0]).nice();
            var yAxis = d3.axisLeft()
                          .scale(yScale)
            
            var gY = svg.append("g")
                        .attr("class", "axis y-axis")
                        .call(yAxis);
            
            var chartBody = svg.append("g")
                        .attr("class", "chartBody")
                        .attr("clip-path", "url(#clip)");
            
            // draw rectangles
            let candles = chartBody.selectAll(".candle")
               .data(prices)
               .enter()
               .append("rect")
               .attr('x', (d, i) => xScale(i) - xBand.bandwidth())
               .attr("class", "candle")
               .attr('y', d => yScale(Math.max(d.Open, d.Close)))
               .attr('width', xBand.bandwidth())
               .attr('height', d => (d.Open === d.Close) ? 1 : yScale(Math.min(d.Open, d.Close))-yScale(Math.max(d.Open, d.Close)))
               .attr("fill", d => (d.Open === d.Close) ? "silver" : (d.Open > d.Close) ? "red" : "green")
            
            // draw high and low
            let stems = chartBody.selectAll("g.line")
               .data(prices)
               .enter()
               .append("line")
               .attr("class", "stem")
               .attr("x1", (d, i) => xScale(i) - xBand.bandwidth()/2)
               .attr("x2", (d, i) => xScale(i) - xBand.bandwidth()/2)
               .attr("y1", d => yScale(d.High))
               .attr("y2", d => yScale(d.Low))
               .attr("stroke", d => (d.Open === d.Close) ? "white" : (d.Open > d.Close) ? "red" : "green");
            
            svg.append("defs")
               .append("clipPath")
               .attr("id", "clip")
               .append("rect")
               .attr("width", w)
               .attr("height", h)
            
            const extent = [[0, 0], [w, h]];
            
            var resizeTimer;
            var zoom = d3.zoom()
              .scaleExtent([1, 100])
              .translateExtent(extent)
              .extent(extent)
              .on("zoom", event => {
                var t = event.transform;
                let xScaleZ = t.rescaleX(xScale);
                
                let hideTicksWithoutLabel = function() {
                    d3.selectAll('.xAxis .tick text').each(function(d){
                        if(this.innerHTML === '') {
                        this.parentNode.style.display = 'none'
                        }
                    })
                }
    
                gX.call(
                    d3.axisBottom(xScaleZ).tickFormat((d, e, target) => {
                            if (d >= 0 && d <= dates.length-1) {
                         var d = dates[d]
                         var seconds = d.getSeconds();
                        var hours = d.getHours()
                         var minutes = (d.getMinutes()<10?'0':'') + d.getMinutes() 
                        var amPM = hours < 13 ? 'am' : 'pm'
                        return hours + ':' + minutes + ':' + seconds +  ' ' + amPM;
                        }
                    })
                )
    
                candles.attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth()*t.k)/2)
                       .attr("width", xBand.bandwidth()*t.k);
                stems.attr("x1", (d, i) => xScaleZ(i) - xBand.bandwidth()/2 + xBand.bandwidth()*0.5);
                stems.attr("x2", (d, i) => xScaleZ(i) - xBand.bandwidth()/2 + xBand.bandwidth()*0.5);
    
                hideTicksWithoutLabel();
    
                gX.selectAll(".tick text")
                .call(this.wrap, xBand.bandwidth())
              })
              .on('zoom.end', event => {
                
                var t = event.transform;
                let xScaleZ = t.rescaleX(xScale);
                clearTimeout(resizeTimer)
                resizeTimer = setTimeout(function() {
    
                var xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0])))
                var xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1])))
                var filtered = _.filter(prices, d => ((d.Date >= xmin) && (d.Date <= xmax)))
                var minP = +d3.min(filtered, d => d.Low)
                var maxP = +d3.max(filtered, d => d.High)
                var buffer = Math.floor((maxP - minP) * 0.1)
    
                yScale.domain([minP - buffer, maxP + buffer])
                candles.transition()
                       .duration(200)
                       .attr("y", (d) => yScale(Math.max(d.Open, d.Close)))
                       .attr("height",  d => (d.Open === d.Close) ? 1 : yScale(Math.min(d.Open, d.Close))-yScale(Math.max(d.Open, d.Close)));
                       
                stems.transition().duration(200)
                     .attr("y1", (d) => yScale(d.High))
                     .attr("y2", (d) => yScale(d.Low))
                
                gY.transition().duration(200).call(d3.axisLeft().scale(yScale));
    
                }, 200)
                
              });
            
            svg.call(zoom)
    });}
    
    wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
    }

    clearChart = () => {
      var svg = document.getElementById('container');
      svg.innerHTML = '';
    }

    componentDidMount = () => {
      this.interval = setInterval(this.nextPrice, 1);
      this.drawChart();
    }

    // componentDidUpdate(prevProps) {
    //   if(prevProps !== this.props){
    //     this.clearChart();
    //     this.drawChart();
    //   }
    // }

    nextPrice = () => {

      if(this.state.counter % this.state.phaseLength == 0){

            let trend = [],
            counterTrend = [],
            thisPhase = this.phaseSelector(this.state.macroTrend);

        [trend, counterTrend] = this.phaseGen(thisPhase);

        this.setState({thisPhase:thisPhase,
                       thisPhaseCounter:0,
                       counterTrendPeriods:Math.round(Math.random() * 3),
                       trend : trend,
                       counterTrend : counterTrend
                      });
    }

    let decisionSelection = [],
        plCtp = this.state.phaseLength/this.state.counterTrendPeriods;

    if(this.state.thisPhase < plCtp){
        decisionSelection = this.state.trend;
    } else if (this.state.thisPhase < (plCtp + this.state.counterTrendPeriod)){
        decisionSelection = this.state.counterTrend;
    } else if (this.state.thisPhase < (2 * plCtp)){
        decisionSelection = this.state.trend;
    } else if (this.state.thisPhase < ((2 * plCtp) + this.state.counterTrendPeriod)){
        decisionSelection = this.state.counterTrend;
    } else if (this.state.thisPhase < (3 * plCtp)){
        decisionSelection = this.state.trend;
    } else if (this.state.thisPhase < ((3 * plCtp) + this.state.counterTrendPeriod)){
        decisionSelection = this.state.counterTrend;
    } else {
        decisionSelection = this.state.trend;
    }

    let randomIndex = Math.round(Math.random() * (decisionSelection.length - 1)),   
        newPrice =  this.state.currentPrice;

    if(newPrice > 1){
        newPrice += (decisionSelection[randomIndex]);
        this.setState({currentPrice:newPrice});
    }    
    
    this.setState({
                   candleTracker    : this.state.candleTracker+=1,
                   counter          : this.state.counter += 1,
                   thisPhaseCounter : this.thisPhaseCounter+=1
                  })


    if(this.state.candleTracker > this.state.candleLimit){
        let newCandleData = [...this.state.candleData];
        newCandleData.push(this.tradesToCandles(this.state.candleBuffer))
        this.drawChart();
        this.props.changePrice(newPrice);

        this.setState({
                      candleData    : newCandleData,
                      candleBuffer  : [],
                      candleTracker : 0
                    })
    }

    let newCandleBuffer = [...this.state.candleBuffer];
    newCandleBuffer.push(newPrice);
    this.setState({candleBuffer:newCandleBuffer});

     }

    tradesToCandles = (trades) => {
      const d = new Date();
      const open  = trades[0],
            close = trades[(trades.length-1)],
            low   = Math.min(...trades),
            high  = Math.max(...trades),
            day   = d.getDay(),
            month = d.getMonth(),
            year  = d.getFullYear(),
            time  = Date.now();

      return ({
        Date  : (year + "-" + month + "-" + day),
        Open  : open,
        Close : close,
        High  : high,
        Low   : low,
        Close : close,
        Time  : time
      })
     }

    selectionArrayGen = (ones, zeros, minusOnes) => {
      const oneArr   = new Array(ones).fill(1),
            zeroArr  = new Array(zeros).fill(0),
            minusArr = new Array(minusOnes).fill(-1);
      return oneArr.concat(zeroArr.concat(minusArr));
     }

    marketArrayGen = (twos, ones, zeros, minusOnes, minusTwos) => {
      const   oneArr   = new Array(ones).fill(1),
              zeroArr  = new Array(zeros).fill(0),
              minusArr = new Array(minusOnes).fill(-1),
              twoArr = new Array(twos).fill(2),
              minusTwoArr = new Array(minusTwos).fill(-2);
  
      return (twoArr.concat(oneArr.concat(zeroArr.concat(minusArr.concat(minusTwoArr)))));
  }

    phaseGen(phase){
    let trend = [],
        counterTrend = [];

    switch(phase){
        case 2:
            trend = this.selectionArrayGen(7, 2, 1);
            counterTrend = this.selectionArrayGen(1,2,5);
            break;
        case 1:
            trend = this.selectionArrayGen(4, 2, 1);
            counterTrend = this.selectionArrayGen(2, 1, 4);
            break;
        case 0:
            trend = this.selectionArrayGen(4, 10, 4);
            counterTrend = this.selectionArrayGen(4, 10, 4);
            break;
        case -1:
            trend = this.selectionArrayGen(1, 2, 4);
            counterTrend = this.selectionArrayGen(4, 1, 2);
            break;
        case -2:
            trend = this.selectionArrayGen(1, 2, 7);
            counterTrend = this.selectionArrayGen(5,2,1);
            break;
    }
    return [trend, counterTrend];
}

phaseSelector = (marketConditions) => {
  let nextPhaseDomain = [];

  switch(marketConditions){
      case "normal":
          nextPhaseDomain = this.marketArrayGen(1, 4, 4, 3, 1);
          break;
      case "bull":
          nextPhaseDomain = this.marketArrayGen(4, 3, 0, 1, 1);
          break;
      case "bear":
          nextPhaseDomain = this.marketArrayGen(0, 3, 3, 5, 4);

  }

  const randomIndex = Math.round(Math.random() * (nextPhaseDomain.length - 1))
  return (nextPhaseDomain[randomIndex]);
}

    render () {

      let coinLogo = null;

    switch (this.props.coin.name){
        case "BTC":
            coinLogo = BtcLogo;
            break;
        case "ETH":
            coinLogo = EthLogo;
            break;
        case "XRP":
            coinLogo = XrpLogo;
            break;
        case "EOS":
            coinLogo = EosLogo;
            break;
    }


        return(
            <div className={classes.Container}>
                <div className={classes.CoinDisplay}><img src={coinLogo}/>{this.props.coin.name}/USD</div>
                <svg id="container"></svg>
            </div>
            )
    }

}


export default Graph;