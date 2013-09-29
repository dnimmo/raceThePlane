function RaceController($scope, socket){
	$scope.tweets = [];
	$scope.dreamliner = 0;
	$scope.tweetliner = 0;
	$scope.totalMiles = 3570;
	$scope.twitterFeed;
	$scope.map;

	$scope.toggleTwitterFeed = function(arg){
		if($scope.twitterFeed && arg){
			$scope.twitterFeed = false;
		} else {
			$scope.twitterFeed = true;
			$scope.map = false;
		}
	}

	$scope.toggleMap = function(arg){
		if($scope.map && arg){
			$scope.map = false;
		} else {
			$scope.map = true;
			$scope.twitterFeed = false;
		}
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
	var counter = 0; // For the animation: Work out how to replace with scope.tweetliner! 
	map.setViewBox(0,0, svgWidth, svgHeight, true);
	originCountry.attr('fill', '#4DBD33');
	destinationCountry.attr('fill', '#4DBD33');

	//Set up the curve - randomly create flight path (Change this in future)
	function curve(x, y, zx, zy, colour) {
        var ax = 200 + x;
        var ay = 200 + (y - 150);
        var bx = 255 + (zx - 100);
        var by = 500 + (zy - 400);
        e = map.circle(x, y, 10).attr({
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
        controls = map.set(
            	map.circle(x, y, 15).attr('fill', '#fff'), map.circle(zx, zy, 15).attr('fill', '#e00000')
            );
    }
    curve(startPoint[0], startPoint[1], endPoint[0], endPoint[1], "#e00000");

	// =========
	// Socket.io
	// =========
	socket.on('tweet', function(data, miles){
		$scope.tweets.unshift(data);
		$scope.tweetliner = miles;
		move();
	});

	function move(){
	    if(flightPath.getTotalLength() <= counter){   // Stop when it gets to the destination!
	        clearInterval(animation);
	        return;
	    }
	    var pos = flightPath.getPointAtLength(counter);   // Get the currentposition
	    e.attr({cx: pos.x, cy: pos.y});  // Set the new position
	    counter++;
	};
};