requirejs.config({
	shim : {
		"extensions/com-highcharts-reangearea/highcharts" : {
			"deps" : []
		},
      	"extensions/com-highcharts-reangearea/highcharts-more" : {
              "deps" : ["./highcharts"] 
	}
	}
});





define(["jquery","./highcharts", "./highcharts-more","text!./simpletable.css"], function($,Highcharts , cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 50
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1
				},
				measures : {
					uses : "measures",
					min : 3
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {
						initFetchRows : {
							ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							label : "Initial fetch rows",
							type : "number",
							defaultValue : 500
						},
						Pivot: {
							type: "items",
							label: "Pie Chart Options" ,
							items: {
						Title : {
							ref: "PieTitle",
							label: "Title",
							type: "string",
							defaultValue: "Pie Chart",
						},								
						Size : {
							ref: "PieSize",
							label: "Size",
							type: "integer",
							defaultValue: 100,
							component: "slider",
							min: 1,
							max: 100,
							step: 1
						},	
						InnerSize : {
							ref: "PieInnerSize",
							label: "Inner Size",
							type: "integer",
							defaultValue: 60,
							component: "slider",
							min: 1,
							max: 100,
							step: 1
						}							
}
}						
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element,layout) {
		
		
    var ranges = [

            [1246752000000, 16.5, 25.0],
            [1246838400000, 17.8, 25.7],
            [1246924800000, 13.5, 24.8],
            [1247011200000, 10.5, 21.4]
        ],
    ranges1 = [
            [1246406400000, 24.3, 17.7],           
            [1246492800000, 24.5, 17.8],
            [1246579200000, 25.5, 19.6],
            [1246665600000, 26.7, 20.7],
            [1246752000000, 26.5, 15.0],
            [1246838400000, 27.8, 15.7],
            [1246924800000, 23.5, 14.8],
            [1247011200000, 20.5, 11.4]
        ],        
        averages = [
            [1246406400000, 21.5],
            [1246492800000, 22.1],
            [1246579200000, 23],
            [1246665600000, 23.8],
            [1246752000000, 21.4],
            [1246838400000, 21.3],
            [1246924800000, 18.3],
            [1247011200000, 15.4]

        ];		
		
		
		var averages = [];
		var ranges1 = []; 
		var ranges = [];
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			//var colors = Highcharts.getOptions().colors;
			var id = "div_" + layout.qInfo.qId;
			$element.html( '<div id="' + id + '"></div>' );

			var d = 0;
			var browserData = [];
			console.log(qMatrix)
			for(d = 0; d < qMatrix.length; d++) {
				var value = qMatrix[d];
				averages.push( [value[0].qNum, value[1].qNum] );
				ranges.push( [value[0].qNum, value[2].qNum, value[3].qNum] );
				ranges1.push( [value[0].qNum, value[4].qNum, value[5].qNum] );
				//var obj = {};
				//obj.name = qMatrix[d][0].qText;
				//obj.y = parseInt(qMatrix[d][1].qText.replace('%', ''));
				//browserData.push(obj);
			}
console.log(averages)
console.log(ranges)
			$('#'+id).highcharts({

        title: {
            text: 'July temperatures'
        },

        xAxis: {
            type: 'number'
        },

        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C'
        },

        legend: {
        },

        series: [{
            name: 'Temperature',
            data: averages,
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: 'red'
            }
        }, {
            name: 'Range',
            data: ranges,
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: 'green',
            fillOpacity: 0.3,
            zIndex: 0
        }, {
            name: 'Range1',
            data: ranges1,
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: 'blue',
            fillOpacity: 0.3,
            zIndex: 0
        }]
    });
          //});
		
					
		}
	};
});
