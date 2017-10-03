/*
Author: Hiruna Wijesinghe
Last Modified: 17/08/2017


*/

displayTime("dashboardDate", "dashboardTime");

var isAdditionalUserDataLoaded = false;

//additionalUserData
var additionalUserData = JSON.parse(localStorage.getItem("additionalUserData"));

//user
var user = JSON.parse(localStorage.getItem("user"));


var eventsRef = database.ref('/events');
var coursesRef = database.ref('/courses');
var resultsRef = database.ref('/results');
var usersRef = database.ref('/users');
var adminsRef = database.ref('/admins');


/******************COURSES GLOBAL VARS*********************/

var tableLineCoursesHead;
var tableScatterCoursesHead;
var tableScoreCoursesHead;
var tableLineCoursesBody;
var tableScatterCoursesBody;
var tableScoreCoursesBody;

//users page

var tableNonAdminUsersHead;
var tableNonAdminUsersBody;
var tableAdminUsersHead;
var tableAdminUsersBody;

//display user info
document.getElementById("userName").innerHTML =
  additionalUserData.firstName + " " + additionalUserData.lastName;



//event handling
eventsRef.on('value', function(snapshot){
  //if user is admin
  //if(localStorage.getItem("isAdmin")=="true"){
    if(snapshot.exists()){
        var content = '';
        content +='<thead>';
        content +='<tr>';
        content +='<th>Name</th>';
        content +='<th>Courses</th>';
        content +='</tr>';
        content +='</thead>' + '<tbody>';
        snapshot.forEach(function(data){
            var val = data.val();
            content +='<tr>';
            content += '<td>' + val.name + '</td>';
            content += '<td>';
            for(var key in val.courses){
              if (val.courses.hasOwnProperty(key)) {
                //if course is set to true
                if(val.courses[key]==true){
                  findCourseByKey(key);
                  var tempCourseName = localStorage.getItem('tempCourseName');
                  content+= tempCourseName + ", ";

                }
              }
            }
           //remoeventsRef.on('value', function(snapshot){eventsRef.on('value', function(snapshot){ve the last comma from courses list
           content = content.substring(0, content.length-2);
           content += '</td>' + '</tr>';
        });
        content +='</tbody>';
        $('#tableEvents').html(content);
    }
//  }

  //TODO ----- IMPLEMENT CODE FOR WHEN A PLAYER IS LOGGED IN
  //only show participating events
});

function findCourseByKey(cKey){
  if(cKey!=undefined){
    coursesRef.child(cKey).once('value', function(snapshot){
      if(snapshot.exists()){
        console.log(snapshot.val().name);
        localStorage.removeItem('tempCourseName');
        localStorage.setItem('tempCourseName',snapshot.val().name);
      }
    });
  }
}

function findUserNameByKey(uKey){
  if(uKey!=undefined){
    usersRef.child(uKey).once('value', function(snapshot){
      if(snapshot.exists()){
        //console.log(snapshot.val());
        //localStorage.removeItem('tempUserName');
        localStorage.removeItem('tempUserName');
        var tempFullName = snapshot.val().firstName + " " + snapshot.val().lastName;
        localStorage.setItem('tempUserName', tempFullName);
      }
    });
  }
}

function getAverageTotalTimeInMins(totalTime){
  var h = parseInt(totalTime.split(":")[0]);
  var m = parseInt(totalTime.split(":")[1]);
  var s = parseInt(totalTime.split(":")[2]);

  //console.log(h + " OK " + m + " OK " + s);


  if(h==0 && m==0 && s!=0){
    if((Math.ceil(s / 10) * 10)==60){
      m+=1;
      s=0;
      return m.toFixed(2);
    }
    else{
      return (s/60).toFixed(2);
    }
  }
  if(h==0 && m!=0 && s!=0){
    if((Math.ceil(s / 10) * 10)==60){
      m+=1;
      s=0;
    }
    return m.toFixed(2);
  }
  if(h==1){
    return (60).toString();
  }
  if(h==0 && s==0){
    return (m).toFixed(2);
  }
  else{
    var totalTime = {
      hours:h,
      mins:m,
      seconds:s
    }
    return totalTime;
  }

  //console.log(Math.ceil(s / 10) * 10);
}

//event handling
resultsRef.on('value', function(snapshot){
  //if user is admin
  //if(localStorage.getItem("isAdmin")=="true"){
    if(snapshot.exists()){

        //myResults headders
          var myResultsContent = '';
          myResultsContent +='<thead>';
          myResultsContent +='<tr>';
          myResultsContent +='<th>Course</th>';
          myResultsContent +='<th>Total Time</th>';
          myResultsContent +='<th>Points</th>'
          myResultsContent +='</tr>';
          myResultsContent +='</thead>' + '<tbody>';
        //otherResultsHeaders
          var otherResultsContent = '';
          otherResultsContent +='<thead>';
          otherResultsContent +='<tr>';
          otherResultsContent +='<th>User</th>';
          otherResultsContent +='<th>Course</th>';
          otherResultsContent +='<th>Total Time</th>';
          otherResultsContent +='<th>Points</th>';
          otherResultsContent +='</tr>';
          otherResultsContent +='</thead>' + '<tbody>';


    //dashboard chart
          var dashboardChartVertical = '<ul class=\"y-axis\">';
          dashboardChartVertical += '<li><span>60 mins</span></li>';
          dashboardChartVertical += '<li><span>50 mins</span></li>';
          dashboardChartVertical += '<li><span>40 mins</span></li>';
          dashboardChartVertical += '<li><span>30 mins</span></li>';
          dashboardChartVertical += '<li><span>20 mins</span></li>';
          dashboardChartVertical += '<li><span>0</span></li>';
          dashboardChartVertical += '</ul>';

          var dashboardChartHorizontal = '';



        snapshot.forEach(function(data){
            var val = data.val();

            //console.log(currentUser.uid);
            if(val.user==currentUser.uid){
              myResultsContent +='<tr>';
              myResultsContent +='<td>';
              findCourseByKey(val.course);
              var tempCourseName = localStorage.getItem('tempCourseName');
              myResultsContent += tempCourseName;
              myResultsContent +='</td>';
              myResultsContent +='<td>';
              myResultsContent += val.totalTime;
              myResultsContent +='</td>';
              myResultsContent +='<td>';
              myResultsContent += val.points;
              myResultsContent +='</td>';
              myResultsContent +='</tr>';

              //dashboard results chart
              dashboardChartHorizontal += '<div class=\"bar\">';
              dashboardChartHorizontal += '<div class=\"title\">' + tempCourseName  + '</div>';
              dashboardChartHorizontal += '<div class=\"value tooltips\" data-original-title=\"' + getAverageTotalTimeInMins(val.totalTime) + '\" data-toggle=\"tooltip\" data-placement=\"top\" style=\"height:' + 100*(getAverageTotalTimeInMins(val.totalTime)/60) + '%;\"' + '>' + getAverageTotalTimeInMins(val.totalTime) + ' mins</div>';
              dashboardChartHorizontal += '</div>';



            }
            else{
              otherResultsContent +='<tr>';
              otherResultsContent +='<td>';
              findUserNameByKey(val.user);
              var tempUserName = localStorage.getItem('tempUserName');
              otherResultsContent += tempUserName;
              otherResultsContent +='</td>';
              otherResultsContent +='<td>';
              findCourseByKey(val.course);
              var tempCourseName = localStorage.getItem('tempCourseName');
              otherResultsContent += tempCourseName;
              otherResultsContent +='</td>';
              otherResultsContent +='<td>';
              otherResultsContent += val.totalTime;
              otherResultsContent +='</td>';
              otherResultsContent +='<td>';
              otherResultsContent += val.points;
              otherResultsContent +='</td>';
              otherResultsContent +='</tr>';
            }

         });

        myResultsContent +='</tbody>';
        otherResultsContent +='</tbody>';


        $('#myResultsTable').html(myResultsContent);
        $('#otherResultsTable').html(otherResultsContent);

        //dashboard chart
        $('#chartDashboardResults').html(dashboardChartVertical + dashboardChartHorizontal);



  }
});

//courses handling
coursesRef.on('value', function(snapshot){
    if(snapshot.exists()){

      tableLineCoursesHead = '';
      tableLineCoursesHead +='<thead>';
      tableLineCoursesHead +='<tr>';
      tableLineCoursesHead +='<th>Name</th>';
      //tableLineCoursesHead +='<th>Type</th>';
      tableLineCoursesHead +='<th>Location</th>';
      tableLineCoursesHead +='<th>Date</th>';
      tableLineCoursesHead +='<th>Start Time</th>';
      tableLineCoursesHead +='<th>End Time</th>';
      /**********************REMOVED FOR DEMO
      tableLineCoursesHead +='<th>Control Points</th>';
      //only show participants if user is admin
      if(localStorage.getItem("isAdmin")=="true"){
        tableLineCoursesHead +='<th>Participants</th>';
      }
      ***********************************/
      tableLineCoursesHead +='<th>Actions</th>';
      tableLineCoursesHead +='</tr>';
      tableLineCoursesHead +='</thead>';

      tableScatterCoursesHead = '';
      tableScatterCoursesHead +='<thead>';
      tableScatterCoursesHead +='<tr>';
      tableScatterCoursesHead +='<th>Name</th>';
      //tableScatterCoursesHead +='<th>Type</th>';
      tableScatterCoursesHead +='<th>Location</th>';
      tableScatterCoursesHead +='<th>Date</th>';
      tableScatterCoursesHead +='<th>Start Time</th>';
      tableScatterCoursesHead +='<th>End Time</th>';
      /**********************REMOVED FOR DEMO
      tableScatterCoursesHead +='<th>Control Points</th>';
      //only show participants if user is admin
      if(localStorage.getItem("isAdmin")=="true"){
        tableScatterCoursesHead +='<th>Participants</th>';
      }
      ********************************/
      tableScatterCoursesHead +='<th>Actions</th>';
      tableScatterCoursesHead +='</tr>';
      tableScatterCoursesHead +='</thead>';

      tableScoreCoursesHead = '';
      tableScoreCoursesHead +='<thead>';
      tableScoreCoursesHead +='<tr>';
      tableScoreCoursesHead +='<th>Name</th>';
      //tableScoreCoursesHead +='<th>Type</th>';
      tableScoreCoursesHead +='<th>Sub Type</th>';
      tableScoreCoursesHead +='<th>Location</th>';
      tableScoreCoursesHead +='<th>Date</th>';
      tableScoreCoursesHead +='<th>Start Time</th>';
      tableScoreCoursesHead +='<th>End Time</th>';
      tableScoreCoursesHead +='<th>Time Allocated</th>';
      /**********************REMOVED FOR DEMO
      tableScoreCoursesHead +='<th>Control Points</th>';
      //only show participants if user is admin
      if(localStorage.getItem("isAdmin")=="true"){
        tableScoreCoursesHead +='<th>Participants</th>';
      }
      ***************************/
      tableScoreCoursesHead +='<th>Actions</th>';
      tableScoreCoursesHead +='</tr>';
      tableScoreCoursesHead +='</thead>';

        tableLineCoursesBody = '';
        tableLineCoursesBody += '<tbody>';

        tableScatterCoursesBody = '';
        tableScatterCoursesBody += '<tbody>';

        tableScoreCoursesBody = '';
        tableScoreCoursesBody += '<tbody>';

        snapshot.forEach(function(data){
          var val = data.val();
		  var key = data.key;
          if(localStorage.getItem("isAdmin")=="false"){ //non-admin user
          //  if(isUserParticipatingInCourse(val)){ //check if user participating
              writeCoursesTable(val, key, "false");
            //}
          }
          else{
            writeCoursesTable(val, key, "true");
          }



        });
    }

});

// function getControlPointByKey(key){
//   var snapshotVal;
//   database.ref('/controlPoints/' + key).once('value', function(snapshot) {
//     snapshotVal =  snapshot.val();
//     return snapshotVal;
//   });
// }




//profile pic




//Users handling (users page)
usersRef.on('value', function(snapshot){
    if(snapshot.exists()){
            tableNonAdminUsersHead = '';
            tableNonAdminUsersHead +='<thead>';
            tableNonAdminUsersHead +='<tr>';
            tableNonAdminUsersHead +='<th>Name</th>';
            tableNonAdminUsersHead +='<th>Date of Birth</th>';
            tableNonAdminUsersHead +='<th>Phone</th>';
            tableNonAdminUsersHead +='</tr>';
            tableNonAdminUsersHead +='</thead>';

            tableAdminUsersHead = '';
            tableAdminUsersHead +='<thead>';
            tableAdminUsersHead +='<tr>';
            tableAdminUsersHead +='<th>Name</th>';
            tableAdminUsersHead +='<th>Date of Birth</th>';
            tableAdminUsersHead +='<th>Phone</th>';
            tableAdminUsersHead +='</tr>';
            tableAdminUsersHead +='</thead>';

            snapshot.forEach(function(data){
              var val = data.val();
    		      var pKey = data.key;

              var isUserAdmin = false;

              adminsRef.on('value', function(snapshot){
                if(snapshot.exists()){
                  console.log(snapshot.val()[pKey]);
                    if(snapshot.val()[pKey]=="true"){
                      isUserAdmin = true;
                    }
                }
              });


              if(isUserAdmin){
                tableAdminUsersBody += '<tr>';
                tableAdminUsersBody += '<td>' + val.firstName + " " +
                                    val.lastName + '</td>';
                tableAdminUsersBody += '<td>' + val.dob + '</td>';
                tableAdminUsersBody += '<td>' + val.phone + '</td>';
                tableAdminUsersBody += '</tr>';
                tableAdminUsersBody += '</tbody>';

              }
              else{
                tableNonAdminUsersBody += '<tr>';
                tableNonAdminUsersBody += '<td>' + val.firstName + " " +
                                    val.lastName + '</td>';
                tableNonAdminUsersBody += '<td>' + val.dob + '</td>';
                tableNonAdminUsersBody += '<td>' + val.phone + '</td>';
                tableNonAdminUsersBody += '</tr>';
                tableNonAdminUsersBody += '</tbody>';
              }

              $('#tableAdminUsers').html(tableAdminUsersHead + tableAdminUsersBody);
              $('#tableNonAdminUsers').html(tableNonAdminUsersHead + tableNonAdminUsersBody);

            });
    }
});



function isUserAdmin(pKey){
    adminsRef.on('value', function(snapshot){
      if(snapshot.exists()){
          snapshot.forEach(function(data){
            var val = data.val();
            var key = data.key;

            if(pKey==key && val=="true"){
              return true;
            }

         });
      }
    });

    return false;
}

function writeCoursesTable(val, courseID, isAdmin){
	var key = "'" + courseID + "'";
  //if type is line
    if(val.type=="line"){
      tableLineCoursesBody += '<tr>';
      tableLineCoursesBody += '<td>' + val.name + '</td>';
    //  tableLineCoursesBody += '<td>' + val.type + '</td>';
      tableLineCoursesBody += '<td>' + val.location + '</td>';
      tableLineCoursesBody += '<td>' + val.date + '</td>';
      tableLineCoursesBody += '<td>' + val.startTime + '</td>';
      tableLineCoursesBody += '<td>' + val.endTime + '</td>';

/**********************REMOVED FOR DEMO
      //loop through the control points
      tableLineCoursesBody += '<td>';
      for(var cpKey in val.ctrlpts){
        if (val.ctrlpts.hasOwnProperty(cpKey)) {
          //if course is set to true
          if(val.ctrlpts[cpKey]==true){
            //------>show names database.ref('/controlPoints/' + cpKey).once('value', function(snapshot) {
               //tableLineCoursesBody += snapshot.val().name + ", ";
             // console.log(tableLineCoursesBody);
            //});

           tableLineCoursesBody += cpKey + ", ";
          }
        }
      }
      //remove the last comma from control points list
      tableLineCoursesBody = tableLineCoursesBody.substring(0, tableLineCoursesBody.length-2);
      tableLineCoursesBody += '</td>';

      //only show participants if user is admin
      if(localStorage.getItem("isAdmin")=="true"){
        //loop through the participants
        tableLineCoursesBody += '<td>';
        var temp = '';
        for(var pKey in val.participants){
          if (val.participants.hasOwnProperty(pKey)) {
            //if course is set to true
            if(val.participants[pKey]==true){
              temp += pKey + ", ";
            }
          }
        }
        if(temp!=''){
          tableLineCoursesBody += temp;
          //remove the last comma from participants list
          tableLineCoursesBody = tableLineCoursesBody.substring(0, tableLineCoursesBody.length-2);
        }
        tableLineCoursesBody += '</td>';
      }

      *************************************************/
      tableLineCoursesBody += '<td>';
      if(localStorage.getItem("isAdmin")=="true"){
        tableLineCoursesBody += '<button type=\"button\" class=\"btn btn-theme02\" data-toggle="modal" data-target="#editModal" onclick="getCurrentCourse('+key+')">Edit</button>';
      }
      console.log(val.name);

      var today = new Date();
      var courseDate = new Date(val.date);
      if((Date.parse(courseDate.toDateString())-Date.parse(today.toDateString())>0) || (Date.parse(courseDate.toDateString())-Date.parse(today.toDateString())==0)) {
        tableLineCoursesBody += ' <button id="'+courseID+'" type=\"button\" class=\"btn btn-theme03\" onclick="participate('+key+')">Participate</button>';
        tableLineCoursesBody += ' <button id="'+'btn'+courseID+'startRace'+'" type=\"button\" class=\"btn btn-theme\" onclick="showJoin('+ key +')">Start Race</button>';
      }

      tableLineCoursesBody += '</td>';

    }
    tableLineCoursesBody += '</tbody>';
    /************************************************************/

    //if type is scatter
    if(val.type=="scatter"){
      tableScatterCoursesBody += '<tr>';
      tableScatterCoursesBody += '<td>' + val.name + '</td>';
    //  tableScatterCoursesBody += '<td>' + val.type + '</td>';
      tableScatterCoursesBody += '<td>' + val.location + '</td>';
      tableScatterCoursesBody += '<td>' + val.date + '</td>';
      tableScatterCoursesBody += '<td>' + val.startTime + '</td>';
      tableScatterCoursesBody += '<td>' + val.endTime + '</td>';
      /**********************REMOVED FOR DEMO
      //loop through the control points
      tableScatterCoursesBody += '<td>';
      for(var cpKey in val.ctrlpts){
        if (val.ctrlpts.hasOwnProperty(cpKey)) {
          //if course is set to true
          if(val.ctrlpts[cpKey]==true){
            tableScatterCoursesBody += cpKey + ", ";
          }
        }
      }

      //TODO------------------------------SORT CONTROL POINTS IN ORDER FOR SCATTER
      //remove the last comma from control points list
      tableScatterCoursesBody = tableScatterCoursesBody.substring(0, tableScatterCoursesBody.length-2);
      tableScatterCoursesBody += '</td>';

      //only show participants if user is admin
      if(localStorage.getItem("isAdmin")=="true"){
        //loop through the participants
        tableScatterCoursesBody += '<td>';
        var temp = '';
        for(var pKey in val.participants){
          if (val.participants.hasOwnProperty(pKey)) {
            //if course is set to true
            if(val.participants[pKey]==true){
              temp += pKey + ", ";
            }
          }
        }
        if(temp!=''){
          tableScatterCoursesBody += temp;
          //remove the last comma from participants list
          tableScatterCoursesBody = tableScatterCoursesBody.substring(0, tableScatterCoursesBody.length-2);
        }
        tableScatterCoursesBody += '</td>';
      }
      **********************************************/
      tableScatterCoursesBody += '<td>';
      if(localStorage.getItem("isAdmin")=="true"){
        tableScatterCoursesBody += '<button type=\"button\" class=\"btn btn-theme02\" data-toggle="modal" data-target="#editModal" onclick="getCurrentCourse('+key+')">Edit</button>';
      }
      var today = new Date();
      var courseDate = new Date(val.date);
      if((Date.parse(courseDate.toDateString())-Date.parse(today.toDateString())>0) || (Date.parse(courseDate.toDateString())-Date.parse(today.toDateString())==0)) {
        tableScatterCoursesBody += ' <button id="'+courseID+'" type=\"button\" class=\"btn btn-theme03\" onclick="participate('+key+')">Participate</button>';
        tableScatterCoursesBody += ' <button id="'+'btn'+courseID+'startRace'+'" type=\"button\" class=\"btn btn-theme\" onclick="showJoin('+ key +')">Start Race</button>';
      }
      tableScatterCoursesBody += '</td>';

    }
    tableScatterCoursesBody += '</tbody>';
    /************************************************************/

    //if type is score
    if(val.type=="score"){
      tableScoreCoursesBody += '<tr>';
      tableScoreCoursesBody += '<td>' + val.name + '</td>';
      //tableScoreCoursesBody += '<td>' + val.type + '</td>';
      tableScoreCoursesBody += '<td>' + val.subType + '</td>';
      tableScoreCoursesBody += '<td>' + val.location + '</td>';
      tableScoreCoursesBody += '<td>' + val.date + '</td>';
      tableScoreCoursesBody += '<td>' + val.startTime + '</td>';
      tableScoreCoursesBody += '<td>' + val.endTime + '</td>';
      tableScoreCoursesBody += '<td>' + val.timeAllocated + '</td>';

      /**********************REMOVED FOR DEMO
      //loop through the control points
      tableScoreCoursesBody += '<td>';
      for(var cpKey in val.ctrlpts){
        if (val.ctrlpts.hasOwnProperty(cpKey)) {
          //if course is set to true
          if(val.ctrlpts[cpKey]==true){
            tableScoreCoursesBody += cpKey + ", ";
          }
        }
      }

      //remove the last comma from control points list
      tableScoreCoursesBody = tableScoreCoursesBody.substring(0, tableScoreCoursesBody.length-2);
      tableScoreCoursesBody += '</td>';

      //only show participants if user is admin
      if(localStorage.getItem("isAdmin")=="true"){
        //loop through the participants
        tableScoreCoursesBody += '<td>';
        var temp = '';
        for(var pKey in val.participants){
          if (val.participants.hasOwnProperty(pKey)) {
            //if course is set to true
            if(val.participants[pKey]==true){
              temp += pKey + ", ";
            }
          }
        }
        if(temp!=''){
          tableScoreCoursesBody += temp;
          //remove the last comma from courses list
          tableScoreCoursesBody = tableScoreCoursesBody.substring(0, tableScoreCoursesBody.length-2);

        }
        tableScoreCoursesBody += '</td>';
        console.log(tableScoreCoursesBody);
      }
      *****************************************/
      tableScoreCoursesBody += '<td>';
      if(localStorage.getItem("isAdmin")=="true"){
        tableScoreCoursesBody += '<button type=\"button\" class=\"btn btn-theme02\" data-toggle="modal" data-target="#editModal" onclick="getCurrentCourse('+key+')">Edit</button>';
      }
      var today = new Date();
      var courseDate = new Date(val.date);
      if((Date.parse(courseDate.toDateString())-Date.parse(today.toDateString())>0) || (Date.parse(courseDate.toDateString())-Date.parse(today.toDateString())==0)) {
        tableScoreCoursesBody += ' <button id="'+courseID+'" type=\"button\" class=\"btn btn-theme03\" onclick="participate('+key+')">Participate</button>';
        tableScoreCoursesBody += ' <button id="'+'btn'+courseID+'startRace'+'" "type=\"button\" class=\"btn btn-theme\" onclick="showJoin('+ key +')">Start Race</button>';
      }
      tableScoreCoursesBody += '</td>';


    }
    tableScoreCoursesBody += '</tbody>';
    //write data to tables
    $('#tableLineCourses').html(tableLineCoursesHead + tableLineCoursesBody);
    $('#tableScatterCourses').html(tableScatterCoursesHead + tableScatterCoursesBody);
    $('#tableScoreCourses').html(tableScoreCoursesHead + tableScoreCoursesBody);


}

coursesRef.on('value', function(snapshot){
    snapshot.forEach(function(data){
    var val = data.val();
    var key = data.key;

    if(isUserParticipatingInCourse(val)){
      if(document.getElementById(key)!=null){
        document.getElementById(key).innerHTML = "Participated";
        document.getElementById(key).disabled = true;

        //enable start race button
        document.getElementById('btn'+key+'startRace').disabled = false;
        $("#btn"+key+"startRace").show();


      }
    }else{
      if(document.getElementById(key)!=null){
        //disable start race button
        document.getElementById('btn'+key+'startRace').disabled = true;
        $("#btn"+key+"startRace").hide();

      }
    }
  });
});






//display user info on profile page
if($('body').is('.profilePage')){
  console.log(additionalUserData.firstName);
  $('#txtProfileFirstName').val(additionalUserData.firstName);
  $('#txtProfileLastName').val(additionalUserData.lastName);
  $('#txtProfileDob').val(additionalUserData.dob);
  $('#txtProfilePhone').val(additionalUserData.phone);
  $('#txtProfileEmail').html(user.email);
}

//show create course button if user is admin
if(localStorage.getItem("isAdmin")=="true"){
  $("#createCourseButtonLi").html("<a class=\"logout\" data-toggle=\"modal\" data-target=\"#createModal\">Create Course</a>");
}
//show create event button if user is admin
if(localStorage.getItem("isAdmin")=="true"){
  $("#createEventButtonLi").html("<a class=\"logout\" data-toggle=\"modal\" onclick=\"loadCourses()\" data-target=\"#createModal\">Create Event</a>");
}

function isUserParticipatingInCourse(val) {
  //loop through the participants
  for(var pKey in val.participants){
    if (val.participants.hasOwnProperty(pKey)) {
      //if course is set to true for the player
      if(pKey==currentUser.uid && val.participants[pKey]==true){
        return true;
      }
    }
  }
  return false;
}

function isCourseUpcomingOrCurrent(val){
  //TODO --------------------------check if the course is upcoming
  //or current (to display when a non admin logs in)

}

function displayTime(dateElement, timeElement){
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday",
    "Friday","Saturday"];
    var months = ["Jan","Feb","Mar","Apr","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"];
    // add a zero in front of numbers<10
    m=checkTime(m);
    s=checkTime(s);
    if(document.getElementById(dateElement)!==null
       && document.getElementById(timeElement)!==null){

      document.getElementById(dateElement).innerHTML=
      days[today.getDay()] + " " + today.getDate() + " " + months[today.getMonth()]
      + " " + today.getFullYear();
      document.getElementById(timeElement).innerHTML=h+":"+m+":"+s;
      t=setTimeout(function(){displayTime(dateElement, timeElement)},500);

    }
}

function checkTime(i){
    if (i<10)
    {
        i="0" + i;
    }
    return i;
}
function showJoin(courseID){
	localStorage.setItem("courseID", courseID);
	window.open("race.html", "_self");
}

/*-----------------------------Add events ----------------------------------------*/
function loadCourses(){
	database.ref('/courses').on('value', function(snap){
		var display='<option style="font-style: italic">Select Course</option>';
		var res = snap.val();
		var keys = Object.keys(res);
		var x;
		for(x in res){
			display += '<option>' + res[x].name + "</option>";
		}
		document.getElementById("chooseCourses").innerHTML = display;
	});
}
var courses = {};
var coursesName={};

function addEvents(){
	var val = document.getElementsByClassName("form-control");
	var name = val[0].value;

	var eventId = database.ref('events').push().key;

	var events = {
		name: name,
		courses: courses
	};
	console.log(events);
	database.ref('events').child(eventId).set(events);
	resetEInput();
}
/*---------Reset data when click on close or create-------*/
function resetEInput(){
	courses = {};
	coursesName = {};
	var val = document.getElementsByClassName("form-control");
	val[0].value ="";
	$("#showCourses").html("");
}
/*------set random background color for course list-----*/
function randomBackground(){

	return ''+Math.round((Math.random())*255)+','
			+Math.round((Math.random())*255) + ','
			+Math.round((Math.random())*255);
}
/*----------Add courses to event-----------------*/
function addCourse(cName){
	console.log(courses);
	console.log(coursesName);
	if(cName != "Select Course"){
		database.ref('courses/').on('value', function(snap){
			var res = snap.val();
			var x;
			for (x in res){
				if(res[x].name == cName){
					var t = document.getElementById("showCourses").innerHTML;
					if(t == ""){
						courses[x] = true;
						coursesName[x] = cName;
						var index = "'"+x+"'";
						var courseName = "'"+cName+"'";
						document.getElementById("showCourses").innerHTML += '<em><b>Selected Courses:</b></em><button style="border:none;margin: 3px;" onclick="removeCourse('+index+','+courseName+')">' + cName + '</button>';
					} else if(!t.includes(cName)){
						courses[x] = true;
						coursesName[x] = cName;
						var index = "'"+x+"'";
						var courseName = "'"+cName+"'";
						document.getElementById("showCourses").innerHTML += '<button style="border:none;background-color: rgba('+randomBackground()+',0.7);color:black; margin:3px;" onclick="removeCourse('+index+','+courseName+')">' + cName + '</button>';
					}
				}
			}
		});
	}
}
/*remove course from couse list ---*/
function removeCourse(index, cName){
	delete courses[index];
	delete coursesName[index];
	var display = '<em><b>Selected Courses:</b></em>';
	var x;
	for(x in courses){
		var k = "'"+x+"'";
		var courseName = "'"+coursesName[x]+"'";
		display += '<button style="border:none;background-color: rgba('+randomBackground()+',0.7);color:black; margin:3px;" onclick="removeCourse('+k+','+courseName+')">' + coursesName[x] + '</button>';
	}
	document.getElementById("showCourses").innerHTML = display;
}


/*-----------------------------------Add Courses-----------------------------*/
var controlPoints = {};
var ctrlPointLocation = {};
function resetCInput(){
	var val = document.getElementsByClassName("create");
	console.log(val);
	for (var x in val){
		val[x].value ="";
		val[2].style.display = "none";
		$("#showCtrl").html("");
	}
	controlPoints = {};
	ctrlRank = 1;
}

function addCourses(){
	var val = document.getElementsByClassName("create");

	var name = val[0].value;
	var type = val[1].value.toLowerCase();
	var subType;
	if(type == "Score"){
		subType = val[2].value;
	} else{
		subType = "";
	}
	var location = val[3].value;
	var date = val[4].value;
	var startTime = val[5].value;
	var endTime = val[6].value;
	var status = "coming soon...";
	var courseId = database.ref('courses').push().key;

	var course = {
		name: name,
		type: type,
		subType: subType,
		location: location,
		date: date,
		startTime: startTime,
		endTime: endTime,
		status: status,
		ctrlpts: controlPoints
	};
	console.log(course);
		//stations[sName] = true;
		database.ref('courses').child(courseId).set(course);
		database.ref('/courses').on('value', function(snap){
			console.log(snap.val());
		});
		resetCInput();
}

function showSubType(){
	var type = document.getElementsByClassName("create")[1].value;

	if(type == "Score"){
		document.getElementById("subType").style.display = "block";
	} else{
		document.getElementById("subType").style.display = "none";
	}
}
var ctrlRank = 1;
function addCtrP(ctrlName){
	database.ref('/controlPoints').on('value', function(snap){
		var display="";
		var res = snap.val();
		var keys = Object.keys(res);
		var ctrl="";
		var ctrlID = "";
		var content = document.getElementById("showCtrl").innerHTML;
		var lo = document.getElementById("showStations").innerHTML;
		for(var i = 0; i < keys.length; i++){
			k = keys[i];

			if(ctrlName == res[k].location){
				ctrl = res[k];
				ctrlID = k;
				break;
			}
		}
		console.log(ctrl);

		if(ctrl == ""){
			return false;
		} else{
			if(!(content.includes(ctrl.location))){
				var type = document.getElementsByClassName("create")[1].value.toLowerCase();
				var id = "'" + ctrlID + "'";
				var ctrlLocation = "'"+ctrl.location+"'";
				if(type == "line"){
					controlPoints[ctrlID] = ctrlRank;
					ctrlPointLocation[ctrlID] = ctrl.location;
					display += '<div id="'+ctrlID+'" onclick="removeCtrl('+id+ ',' +ctrlLocation+')">' + ctrl.location + " (Rank: "+ctrlRank+")</div> ";
					ctrlRank ++;
				} else {
					controlPoints[ctrlID] = true;
					ctrlPointLocation[ctrlID] = ctrl.location;
					display += '<div id="'+ctrlID+'" onclick="removeCtrl('+id+ ',' +ctrlLocation+')">' + ctrl.location + "</div> ";
				}


				document.getElementById("showCtrl").innerHTML += display;
				document.getElementById("showStations").innerHTML += display;
				document.getElementById("txtControlPoints").value = "";
				//console.log(controlPoints);
				document.getElementById("sSuggest").innerHTML = "";
				document.getElementById("suggest").innerHTML = "";
			}
		}
	});
}


function removeCtrl(ctrl, ctrlLocation){
	console.log(controlPoints);
	delete controlPoints[ctrl];
	delete ctrlPointLocation[ctrl];
	var display ="";
	var type = document.getElementsByClassName("create")[1].value.toLowerCase();
	if(type == "line"){
		ctrlRank = 1;
	}
	var location = "'"+ctrlLocation+"'";
	for(x in controlPoints){
		var id = "'" + x + "'";
		var ctrlLocation = "'"+ctrlPointLocation[x]+"'";
		if(type == "line"){
			console.log(ctrlPointLocation);
			controlPoints[x] = ctrlRank;
			display += '<div id="'+x+'" onclick="removeCtrl('+id+ ',' +ctrlLocation+')">' + ctrlPointLocation[x] + " (Rank: "+ctrlRank+")</div> ";
			ctrlRank ++;
		} else{
			display += '<div id="'+x+'" onclick="removeCtrl('+id+ ',' +ctrlLocation+')">' + ctrlPointLocation[x] + "</div> ";
		}
	}
	document.getElementById("showCtrl").innerHTML = display;
	document.getElementById("showStations").innerHTML = display;
	document.getElementById("txtControlPoints").value = "";
	//console.log(controlPoints);
	document.getElementById("sSuggest").innerHTML = "";
	document.getElementById("suggest").innerHTML = "";
}

function sSuggestion(input){
	database.ref('/controlPoints').on('value', function(snap){
		var display="";
		var res = snap.val();
		var keys = Object.keys(res);
		var ctrl="";

		for(var i = 0; i < keys.length; i++){
			k = keys[i];
			if(res[k].location.includes(input) && input.trim() != ""){
				ctrl = res[k];
				var ctrlLocation = "'" + ctrl.location + "'";
				display += '<p onclick= "addCtrP('+ ctrlLocation +')">' + ctrl.location + '</p>';
				console.log(ctrl.location);
			}
		}
		document.getElementById("sSuggest").innerHTML = display;
		//document.getElementById("suggest").innerHTML = display;
		console.log(display);
	});
}

/*-------------------------Edit Course --------------------------*/
var cID;
function getCurrentCourse(courseID){
	database.ref('courses').on('value', function(snap){
		var res = snap.val();
		console.log(res[courseID]);
		var val = document.getElementsByClassName("edit");

		val[0].value = res[courseID].name;
		console.log(res[courseID].name);
		val[1].value = res[courseID].type;
		val[1].value.selected = true;
		console.log(val[1].value);
		var subType;
		console.log(res[courseID].type);
		if(res[courseID].type == "score"){
			document.getElementById("subtype").style.display = "block";
			val[2].value = res[courseID].subType;
		}
		val[3].value = res[courseID].location;
		val[4].value = res[courseID].date;
		val[5].value = res[courseID].startTime;
		val[6].value = res[courseID].endTime;
		var stations;
		database.ref('controlPoints').on('value', function(ctrlP){
			stations = ctrlP.val();
		});
		var show = "";
		for(var x in res[courseID].ctrlpts){
			var ctrl = "'"+x+"'";
			var lo = "'"+stations[x].location+"'";
			if(res[courseID].type == "line"){
				controlPoints[x] = res[courseID].ctrlpts[x];
				ctrlPointLocation[x] = stations[x].location;
				show += '<div id="'+x+'" onclick="removeCtrlEdit('+ctrl+','+lo+')">' + stations[x].location +' (Rank: '+res[courseID].ctrlpts[x]+')</div>';
			} else{
				controlPoints[x] = res[courseID].ctrlpts[x];
				ctrlPointLocation[x] = stations[x].location;
				show += '<div id="'+x+'" onclick="removeCtrlEdit('+ctrl+','+lo+')">' + stations[x].location +'</div>';
			}
		}
		document.getElementById("showStations").innerHTML = show;
	});
	cID = courseID;
}

function addCtrPEdit(ctrlName){
	database.ref('/controlPoints').on('value', function(snap){
		var display="";
		var res = snap.val();
		var keys = Object.keys(res);
		var ctrl="";
		var ctrlID = "";
		var content = document.getElementById("showCtrl").innerHTML;
		var lo = document.getElementById("showStations").innerHTML;
		for(var i = 0; i < keys.length; i++){
			k = keys[i];

			if(ctrlName == res[k].location){
				ctrl = res[k];
				ctrlID = k;
				break;
			}
		}
		console.log(ctrl);

		if(ctrl == ""){
			return false;
		} else{
			if(!(content.includes(ctrl.location))){
				var type = document.getElementsByClassName("edit")[1].value.toLowerCase();
				var id = "'" + ctrlID + "'";
				var ctrlLocation = "'"+ctrl.location+"'";
				if(type == "line"){
					controlPoints[ctrlID] = ctrlRank;
					ctrlPointLocation[ctrlID] = ctrl.location;
					display += '<div id="'+ctrlID+'" onclick="removeCtrlEdit('+id+ ',' +ctrlLocation+')">' + ctrl.location + " (Rank: "+ctrlRank+")</div> ";
					ctrlRank ++;
				} else {
					controlPoints[ctrlID] = true;
					ctrlPointLocation[ctrlID] = ctrl.location;
					display += '<div id="'+ctrlID+'" onclick="removeCtrlEdit('+id+ ',' +ctrlLocation+')">' + ctrl.location + "</div> ";
				}


				document.getElementById("showCtrl").innerHTML += display;
				document.getElementById("showStations").innerHTML += display;
				document.getElementById("txtControlPoints").value = "";
				//console.log(controlPoints);
				document.getElementById("sSuggest").innerHTML = "";
				document.getElementById("suggest").innerHTML = "";
			}
		}
	});
}

function editCourses(){
	var val = document.getElementsByClassName("edit");

	var name = val[0].value;
	var type = val[1].value.toLowerCase();
	var subType;
	if(type == "score"){
		subType = val[2].value;
	} else{
		subType = "";
	}
	var location = val[3].value;
	var date = val[4].value;
	var startTime = val[5].value;
	var endTime = val[6].value;
	var status = "coming soon...";

	var course = {
		name: name,
		type: type,
		subType: subType,
		location: location,
		date: date,
		startTime: startTime,
		endTime: endTime,
		status: status,
		ctrlpts: controlPoints
	};
	console.log(course);
	database.ref('courses').child(cID).update(course);
	database.ref('/courses').on('value', function(snap){
		console.log(snap.val());
	});
}

function removeCtrlEdit(ctrl, ctrlLocation){
	console.log(controlPoints);
	delete controlPoints[ctrl];
	delete ctrlPointLocation[ctrl];
	var display ="";
	var type = document.getElementsByClassName("edit")[1].value.toLowerCase();
	if(type == "line"){
		ctrlRank = 1;
	}
	var location = "'"+ctrlLocation+"'";
	for(x in controlPoints){
		var id = "'" + x + "'";
		var ctrlLocation = "'"+ctrlPointLocation[x]+"'";
		if(type == "line"){
			console.log(ctrlPointLocation);
			controlPoints[x] = ctrlRank;
			display += '<div id="'+x+'" onclick="removeCtrlEdit('+id+ ',' +ctrlLocation+')">' + ctrlPointLocation[x] + " (Rank: "+ctrlRank+")</div> ";
			ctrlRank ++;
		} else{
			display += '<div id="'+x+'" onclick="removeCtrlEdit('+id+ ',' +ctrlLocation+')">' + ctrlPointLocation[x] + "</div> ";
		}
	}
	//document.getElementById("showCtrl").innerHTML = display;
	document.getElementById("showStations").innerHTML = display;
	document.getElementById("txtControlPoints").value = "";
	//console.log(controlPoints);
	document.getElementById("sSuggest").innerHTML = "";
	document.getElementById("suggest").innerHTML = "";
}
function eSuggestion(input){
	database.ref('/controlPoints').on('value', function(snap){
		var display="";
		var res = snap.val();
		var keys = Object.keys(res);
		var ctrl="";

		for(var i = 0; i < keys.length; i++){
			k = keys[i];
			if(res[k].location.includes(input) && input.trim() != ""){
				ctrl = res[k];
				var ctrlLocation = "'" + ctrl.location + "'";
				display += '<p onclick= "addCtrPEdit('+ ctrlLocation +')">' + ctrl.location + '</p>';
				console.log(ctrl.location);
			}
		}
		//document.getElementById("sSuggest").innerHTML = display;
		document.getElementById("suggest").innerHTML = display;
		console.log(display);
	});
}
/*----------------------------------Participate button---------------------*/

function participate(courseID){
	var x = localStorage.getItem("currentUser");
	var user = localStorage.getItem("currentUser");
	var userID = JSON.parse(user).uid;
	console.log(courseID);
	database.ref('courses/'+courseID+'/participants/').child(userID).set(true);

	document.getElementById(courseID).innerHTML = "Participated";
	document.getElementById(courseID).disabled = true;
	//localStorage.setItem("selectedCourse", courseID);
}

/*function checkParticipated(){
	var courseID = localStorage.getItem("selectedCourse");
	console.log("___"+courseID);
	if(courseID != null){
		document.getElementById(courseID).innerHTML = "Participated";
		document.getElementById(courseID).disabled = true;
	}
}*/
/*---------------------------Add Station----------------------*/
//function showStations(){
	database.ref('controlPoints').on('value', function(snap){
    if(snap.exists()){
  		console.log(snap.val());
  		var display = "";
  		var res = snap.val();
  		var keys = Object.keys(res);
  		console.log(res);
  		for(var i = 0; i < keys.length; i++){
  			k = keys[i];
  			var passData = "'" + k + "'";
  			display += "<tr>"
  				+ "<td>" + res[k].location + "</td>"
  				+ "<td>" + res[k].point + "</td>"
  				+ '<td class="qrCode" style="text-align:center;" onclick="changeSize(this.id)" data-toggle="modal" data-target="#abc"></td>'
  				+ '<td style="text-align:center;vertical-align:middle">'
                  +     '<a class="btn btn-danger">'
                  +     '<span class="glyphicon glyphicon glyphicon-trash" title="Delete" onclick="removeStation('+passData+')"></span>'
                  +     '</a>'
                  + '</td>'
  				+ "</tr>";
  		}
  		//console.log(display);
      if(document.getElementById("sInfo")!=null){
  		    document.getElementById("sInfo").innerHTML = display;
      }
  		ren(res);
    }
    else{
      if(document.getElementById("sInfo")!=null){
        document.getElementById("sInfo").innerHTML = "";
      }
    }
	});
//}

function ren(res){
	var keys = Object.keys(res);
	var w = document.getElementsByClassName("qrCode");
	for(var i = 0; i < w.length; i++){
		var z = ".qrCode:eq(" + i + ")";
		var k = keys[i];
		var y = k;
		console.log(y);
		$(z).qrcode({
			text: y,
			width: 50,
			height: 50
		});
		$(z).attr({"id": y});
	}
}

function changeSize(id){
	$("#showCode").qrcode({
		text : id

	});
	console.log(id);
	//test();
}

function addStations(){
	var val = document.getElementsByClassName("form-control");
	var name = val[0].value;
	var location = val[1].value;
	var point = val[2].value;
	var code = database.ref('controlPoints').push().key;

	var station = {
		name: name,
		location: location,
		point: point,
		code: code
	};
		//stations[sName] = true;
		database.ref('controlPoints').child(code).set(station);
}

function removeStation(key){
	database.ref('/controlPoints/' + key).once('value', function(snap){
    if(snap.exists()){
        database.ref('/controlPoints/'+ key).remove();
    }
	});
}

function changeSize(id){
	document.getElementById("showQrCode").innerHTML = "";
	$("#showQrCode").qrcode({
		text : id,
		width:350,
		height:350
	});
	console.log(id);
	//test();
}
