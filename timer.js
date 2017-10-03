var config = {
    apiKey: "AIzaSyCcb3bzfYhoZyytxk69dLXdGf8FD-IqVic",
    authDomain: "orienteering-a0c63.firebaseapp.com",
    databaseURL: "https://orienteering-a0c63.firebaseio.com",
    projectId: "orienteering-a0c63",
    storageBucket: "orienteering-a0c63.appspot.com",
    messagingSenderId: "570574227287"
  };
firebase.initializeApp(config);

//create variable
var dtb = firebase.database();

function start(){
	startTime();
	scanTime();
	createResults();
}
var resultId;
function stop(){
	var total = h + ":" + m + ":" + s;
	dtb.ref('results/'+ resultId).child('totalTime').set(total);
	console.log(resultId);
	clearTimeout(start);
	clearTimeout(scan);
	window.open("results.html","_self");
}

function createResults(){
	var x = localStorage.getItem("currentUser");
	var y = localStorage.getItem("courseID");
	var user = localStorage.getItem("currentUser");
	var courseID = localStorage.getItem("courseID");
	console.log(JSON.parse(user).uid);
	var userId = JSON.parse(user).uid;
	resultId = dtb.ref('results').push().key;
	console.log(resultId);
	var result = {
		user : userId,
		course: courseID,
		scans: {},
		totalTime: ""
	}
	console.log(result);
	dtb.ref('results').child(resultId).set(result);
}

var start,scan;
var h = 0;
var m = 0;
var s = 0;
function startTime() {
 	start = setTimeout(startTime, 1000);
    s = checkTime(s);
	//m = checkTime(m);
    //h = checkTime(h);
	if(m<10 && h <10){
		document.getElementById('txt').innerHTML =
						"0" + h + ":" + "0" + m + ":" + s;
	} else if(h <10){
		document.getElementById('txt').innerHTML =
						"0" + h + ":" + m + ":" + s;
	} else if(m <10){
		document.getElementById('txt').innerHTML =
						 h + ":" + "0" + m + ":" + s;
	} else{
		document.getElementById('txt').innerHTML =
						 h + ":" + m + ":" + s;
	}
    s++;
    if(s == 60){
    	s = 0;
        m++;
    }
    if(m==60){
    	m=0;
        h++;
    }
}

function checkTime(i) {
    if (i < 10) {
		i = "0" + i;
	} // add zero in front of numbers < 10
    if(i==60){
    	i = "00";
    }
    return i;
}

var sH = 0;
var sM = 0;
var sS = 0;
var val= document.getElementById("show").innerHTML;
var i = 1;
function scanTime(){
	validateCode(value);
	var value = document.getElementById("show").innerHTML;
	if(val != value ){
		var find = validateCode(value);
		//console.log(value);
		if(find == "not found"){
			alert("QR code is not valid!");
		} else{
			var courseID = localStorage.getItem("courseID");
			var id = "'"+ courseID+"'";
			var courseType;
			dtb.ref('courses/'+courseID).child('type').on('value',function(res){
				courseType = 'score';//res.val();
				//console.log(courseType);
			
				if(courseType == "line"){
					line(courseID, find, value);
				} else if(courseType == "scatter"){
					scatter(find, value);
				} else{
					score(find, value);
				}
			});
			console.log(courseType);
		}
	}
	val = value;
	scan = setTimeout(scanTime, 1000);
}

function validateCode(code){
	//console.log(code);
	var find = "not found";
	var work = false;
	dtb.ref('controlPoints').on('value', function(res){
		var ctrP = res.val();
		var keys = Object.keys(ctrP);

		for(var i = 0; i < keys.length; i++){
			var k = keys[i];
			//console.log(k);
			if(k == code){
				find = k;
				i = keys.length;
				//console.log(find);
			}
		}
	});
	return find;
}
var oldCtr = 0;
function line(courseID, ctrId, code){
	console.log(ctrId);
	dtb.ref('courses/'+courseID).child('ctrlpts/'+code).on('value', function(res){
		var rank = res.val();
		var newCtr = parseInt(rank);
		console.log(rank);
		if(newCtr != (oldCtr + 1)){
			alert("Invalid! Please scan in order of checkpoints");
		} else{
			var fS = s >= sS? (s-sS):(s+60-sS);
			fS = fS == 60? 0:fS;

			var fM = m >= sM? (m-sM):(s+60-sM);
			fM = fM == 60? 0:fM;
	
			var fH = h >= sH? (h-sH):(h+24-sH);
			fH = fH == 24? 0:fH;

			var time = fH + ":" + fM + ":" + fS;

			document.getElementById("scanTime").innerHTML =
			"Station " + i + ">> " + time + "<br>" + document.getElementById("scanTime").innerHTML;

			dtb.ref('results/'+ resultId + '/scan').child(ctrId).set(time);

			sH = h;
			sM = m;
			sS = s;
			i++;
			oldCtr = newCtr;
		}
	});
}

function scatter(ctrId, code){
	var fS = s >= sS? (s-sS):(s+60-sS);
		fS = fS == 60? 0:fS;
	var fM = m >= sM? (m-sM):(s+60-sM);
		fM = fM == 60? 0:fM;
	var fH = h >= sH? (h-sH):(h+24-sH);
		fH = fH == 24? 0:fH;

	if(fS <10){
		
	}

	var time = fH + ":" + fM + ":" + fS;

	document.getElementById("scanTime").innerHTML =
	"Station " + i + ">> " + time + "<br>" + document.getElementById("scanTime").innerHTML;

	dtb.ref('results/'+ resultId + '/scan').child(ctrId).set(time);

	sH = h;
	sM = m;
	sS = s;
	i++;
}

var total = 0;
function score(ctrId, code){
	dtb.ref('controlPoints/'+ctrId).child('point').on('value', function(res){
		var score = parseInt(res.val());
		total += score;
		
		var fS = s >= sS? (s-sS):(s+60-sS);
			fS = fS == 60? 0:fS;
		var fM = m >= sM? (m-sM):(s+60-sM);
			fM = fM == 60? 0:fM;
		var fH = h >= sH? (h-sH):(h+24-sH);
			fH = fH == 24? 0:fH;

		if(fS <10){
		
		}

		var time = fH + ":" + fM + ":" + fS;

		document.getElementById("scanTime").innerHTML =
		"Station " + i + ">> " + time + "<br>Score >> " + score + '<br><br>'
		+ document.getElementById("scanTime").innerHTML;

		dtb.ref('results/'+ resultId + '/scan').child(ctrId).set(time);

		sH = h;
		sM = m;
		sS = s;
		i++;
		
		dtb.ref('results/'+ resultId + '/points').set(total);
	});
}
