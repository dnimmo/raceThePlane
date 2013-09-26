function RaceController($scope, socket){
	$scope.tweets = [];
	$scope.dreamliner = 0;
	$scope.tweetliner = 0;
	$scope.totalMiles = 3570;

	var map = new Raphael("map", '100%', '100%');
	var svgWidth = 1000;
	var svgHeight = 400;
	var startPoint = [800, 150];
	var endPoint = [300, 250];
	var originCountry = map.circle(startPoint[0]-30, startPoint[1]-40, 75);
	var destinationCountry = map.circle(endPoint[0]-75, endPoint[1]-100, 200);
	var destinationPoint = map.circle(endPoint[0], endPoint[1], 15);
	var originPoint = map.circle(startPoint[0], startPoint[1], 15);
	var flightPath = map.path(
		"M"+startPoint+" "+
		"Q"+"600, 400"+" "+endPoint
	);
	var dreamLiner = map.circle(startPoint[0], startPoint[1], 10);

	map.setViewBox(0,0, svgWidth, svgHeight, true);

	destinationPoint.attr('fill', '#e00000');
	originPoint.attr('fill', '#fff');
	dreamLiner.attr('fill', '#000');
	flightPath.attr('stroke', '#666');
	originCountry.attr('fill', '#4DBD33');
	destinationCountry.attr('fill', '#4DBD33');

	socket.on('tweet', function(data, miles){
		$scope.tweets.unshift(data);
		$scope.tweetliner = miles;
	});
};

