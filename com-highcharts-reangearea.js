requirejs.config({
	shim : {
		"extensions/com-highcharts-reangearea/highcharts" : {
			"deps" : []
		},
      	"extensions/com-highcharts-reangearea/highcharts-more" : {
              "deps" : ["./highcharts"] 
		},
		"extensions/com-highcharts-reangearea/moment" : {
			"deps" : []
		}		
	}
});





define(["jquery","./highcharts", "./moment", "./highcharts-more"], function($, Highcharts, moment) {
	'use strict';
	//$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 500
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
							label: "Highcharts Options" ,
							items: {
							  Title : {
								  ref: "ChartTitle",
								  label: "Title",
								  type: "string",
								  defaultValue: "",
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
						},
						Legend: {
							type: "items",
							label: "Legend",
							items: {
								ShowLegend: {
									ref: "legend.show",
									type: "boolean",
									label: "Show legend",
									defaultValue: true
								},
								PositionLegend: {
									ref: "legend.position",
									type: "string",
									component: "dropdown",
									label: "Horizontal osition",
									options: [{
										value: "left",
										label: "Left"
									},{
										value: "center",
										label: "Center"
									},{
										value: "right",
										label: "Right"
									}],
									defaultValue: "right"
								},
								PositionLegendVertical: {
									ref: "legend.positionVertical",
									type: "string",
									component: "dropdown",
									label: "Vertical Position",
									options: [{
										value: "top",
										label: "Top"
									},{
										value: "middle",
										label: "Middle"
									},{
										value: "bottom",
										label: "Bottom"
									}],
									defaultValue: "top"
								},
								LegendLayout: {
									ref: "legend.layout",
									type: "string",
									component: "dropdown",
									label: "Layout",
									options: [{
										value: "horizontal",
										label: "Horizontal"
									},{
										value: "vertical",
										label: "Vertical"
									}],
									defaultValue: "vertical"
								},
								LegendFloating: {
									ref: "legend.floating",
									type: "boolean",
									label: "Floating",
									defaultValue: true
								},					
								MyStringProp: {
									ref: "legend.title",
									label: "Title",
									type: "string",
									defaultValue: ""
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

		var averages = [];
		var ranges1 = []; 
		var ranges = [];
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			//var colors = Highcharts.getOptions().colors;
			var id = "div_" + layout.qInfo.qId;
			$element.html( '<div id="' + id + '"></div>' );

			var d = 0;
			var browserData = [];
			//console.log(qMatrix)
			for(d = 0; d < qMatrix.length; d++) {
				var value = qMatrix[d];
				averages.push( [moment(value[0].qText).valueOf(), value[1].qNum] );
				
				if( value[2].qNum != 0 ) {
					ranges.push( [moment(value[0].qText).valueOf(), value[2].qNum, value[3].qNum] );
				}
				
				if( value[4].qNum != 0 ) {
					ranges1.push( [moment(value[0].qText).valueOf(), value[4].qNum, value[5].qNum] );
				}
			}
			
	//console.log(averages)
	//console.log(ranges)
	if( !layout.legend.position ) {
		layout.legend.position = 'right'
	}	
	
	if( !layout.legend.positionVertical ) {
		layout.legend.positionVertical = 'top'
	}
	
	if( !layout.legend.layout ) {
		layout.legend.layout = 'vertical'
	}
	
	if( !layout.legend.title ) {
		layout.legend.title = ''
	}	
	
	$('#'+id).highcharts({
	  plotOptions: {
		  series: {
			  animation: false
		  }
	  },
        title: {
            text: layout.ChartTitle
        },
        legend: {
            align: layout.legend.position,
            verticalAlign: layout.legend.positionVertical,
            layout: layout.legend.layout,
			floating: layout.legend.floating,
            x: 0,
            y: 0,
			enabled: layout.legend.show,
			title: {
				text: layout.legend.title
				}
        },
        xAxis: {
            type: 'date'
        },

        yAxis: {
            title: {
                text: null
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '',
			formatter: function() {
          		return console.log(this.points); //'<b>' + moment(this.value).format("YYYY-MM-DD") + '</b><br/>' + this.y
				;
        	}
        },
        series: [{
            name: 'Week',
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
