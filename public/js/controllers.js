function RaceController($scope, socket){
	$scope.tweets = [];
	$scope.dreamliner = 0;
	$scope.tweetliner;
	$scope.totalMiles = 3570;
	$scope.twitterFeed;
	$scope.map = false;

	$scope.toggleTwitterFeed = function(arg){
		$scope.twitterFeed = arg;
		$scope.map = false
	}

	$scope.toggleMap = function(arg){
		$scope.map = arg;
		$scope.twitterFeed = false;
	}

	// =======
	// Raphael 
	// =======
	
	var animation;
	var map = new Raphael("map", '100%', '100%');
	var svgWidth = 1000;
	var svgHeight = 400;
	var startPoint = [800, 150];
	var endPoint = [300, 250];
	var originCountry = map.circle(startPoint[0]-30, startPoint[1]-40, 75);
	var destinationCountry = map.circle(endPoint[0]-75, endPoint[1]-100, 200);
	map.setViewBox(0,0, svgWidth, svgHeight, true);
	originCountry.attr('fill', '#4DBD33');
	destinationCountry.attr('fill', '#4DBD33');

	//Set up the Dreamliner flight path
	function dreamFlightPath(x, y, zx, zy, colour) {
        var ax = 200 + x;
        var ay = 400 + (y - 150);
        var bx = 255 + (zx - 100);
        var by = 500 + (zy - 400);
        controls = 	map.set(
            		map.circle(x, y, 15).attr('fill', '#fff'), map.circle(zx, zy, 15).attr('fill', '#FFFFFF'));
        dreamliner = map.circle(x, y, 10).attr({
            stroke: "none",
            fill: colour
        });
        var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]];
            flightPath = map.path(path).attr({
                stroke: colour,
                "stroke-width": 4,
                "stroke-linecap": "round",
                "stroke-opacity": 0.2
            });
    }
    //Initialise flight path
    dreamFlightPath(startPoint[0], startPoint[1]-35, endPoint[0], endPoint[1]-35, "#e00000");

	//Set up the Tweetliner flight path
	function tweetFlightPath(x, y, zx, zy, colour) {
        var ax = 200 + x;
        var ay = 400 + (y - 150);
        var bx = 255 + (zx - 100);
        var by = 500 + (zy - 400);
        controls = 	map.set(
            		map.circle(x, y, 15).attr('fill', '#fff'), map.circle(zx, zy, 15).attr('fill', '#FFFFFF'));
        tweetliner = map.circle(x, y, 10).attr({
            stroke: "none",
            fill: colour
        });
        var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]];
            tweetFlightPath = map.path(path).attr({
                stroke: colour,
                "stroke-width": 4,
                "stroke-linecap": "round",
                "stroke-opacity": 0.2
            });
    }
    //Initialise Tweetliner flight path
    tweetFlightPath(startPoint[0], startPoint[1], endPoint[0], endPoint[1], "#0E203F");

	function moveDreamliner(){
	    if(dreamFlightPath.getTotalLength() <= $scope.dreamliner){  // Stop when it gets to the destination!
	        clearInterval(animation);
	        return;
	    }
	   	var pos = tweetFlightPath.getPointAtLength($scope.dreamliner);   // Get the current position
	    dreamliner.attr({cx: pos.x, cy: pos.y});  // Set the new position
    	socket.emit('position', pos);
	};

	function moveTweetliner(){
	    if(tweetFlightPath.getTotalLength() <= $scope.tweetliner){  // Stop when it gets to the destination!
	        clearInterval(animation);
	        return;
	    }
	   	var pos = tweetFlightPath.getPointAtLength($scope.tweetliner);   // Get the current position
	    tweetliner.attr({cx: pos.x, cy: pos.y});  // Set the new position
    	socket.emit('position', pos);
	};

	// =========
	// Socket.io 
	// =========

	// Request position of flights
	socket.emit('loadPosition');

	socket.on('tweet', function(data, miles){
		$scope.tweets.unshift(data);
		$scope.tweetliner++;
		socket.emit('milesTravelled', $scope.tweetliner);
		moveTweetliner();
	});

	// Get plane position on client load
	socket.on('loadedPosition',function(miles, count){
		$scope.tweetliner = miles;
		moveTweetliner();
	});
};