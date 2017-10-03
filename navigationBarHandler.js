/*
Author: Hiruna Wijesinghe
Last Modified: 17/08/2017


*/


//nav bar

//admin
const adminDashboardMenu = "<li id=\"adminDashboardMenu\" class=\"mt\">" +
    "<a id=\"navDashboardLinkItem\" href=\"index.html\">" +
        "<i class=\"fa fa-dashboard\"></i>" +
        "<span>Dashboard</span>" +
    "</a></li>";

const adminUserManagementMenu = "<li id=\"adminUserManagementMenu\" class=\"sub-menu\">" +
    "<a href=\"javascript:;\" >" +
        "<i class=\"fa fa-desktop\"></i>" +
        "<span>Users</span>" +
    "</a>" +
    "<ul class=\"sub\">" +
        "<li id=\"navPlayersLinkItem\"><a href=\"#\">Players</a></li>" +
        "<li id=\"navAdminsLinkItem\"><a href=\"#\">Admins</a></li>" +
        "<li id=\"navGroupsLinkItem\"><a href=\"#\">Groups</a></li>" +
    "</ul>" +
"</li>";

const adminEventManagementMenu = "<li id=\"navEventManagementMenu\" class=\"sub-menu\">" +
    "<a id=\"navEventManagementLinkItem\" href=\"javascript:;\">" +
        "<i class=\"fa fa-cogs\"></i>" +
        "<span>Event Management</span>" +
    "</a>" +
    "<ul class=\"sub\">" +
        "<li id=\"navEventsLinkItem\"><a href=\"events.html\">Events</a></li>" +
        "<li id=\"navCoursesLinkItem\"><a href=\"courses.html\">Courses</a></li>" +
        "<li id=\"navControlPointsLinkItem\"><a href=\"control_points.html\">Control Points</a></li>" +
        "<li id=\"navResultsLinkItem\"><a href=\"results.html\">Results</a></li>" +
    "</ul></li>";

    //player
    const playerDashboardMenu = "<li id=\"playerDashboardMenu\" class=\"mt\">" +
        "<a id=\"navDashboardLinkItem\" href=\"index.html\">" +
            "<i class=\"fa fa-dashboard\"></i>" +
            "<span>Dashboard</span>" + "</a></li>";

    const playerEventManagementMenu = "<li id=\"navEventManagementMenu\" class=\"sub-menu\">" +
        "<a href=\"javascript:;\">" +
            "<i navGroupsLinkItemclass=\"fa fa-cogs\"></i>" +
            "<span>Event Management</span>" +
        "</a>" +
        "<ul class=\"sub\">" +
            "<li id=\"navEventsLinkItem\"><a href=\"events.html\">Events</a></li>" +
            "<li id=\"navCoursesLinkItem\"><a href=\"courses.html\">Courses</a></li>" +
            "<li id=\"navResultsLinkItem\"><a href=\"results.html\">Results</a></li>" +
        "</ul></li>";


console.log(localStorage.getItem("isAdmin"));
if(localStorage.getItem("isAdmin")=="true"){
  showAdminNavBar();
}
else{
  showPlayerNavBar();
}


function showAdminNavBar(){
  document.getElementById("navBarItems").innerHTML =
    adminDashboardMenu + adminUserManagementMenu + adminEventManagementMenu;
}

function showPlayerNavBar(){
  document.getElementById("navBarItems").innerHTML =
    playerDashboardMenu + playerEventManagementMenu;

}


//change active class for selected nav bar item
if($('body').is('.dashboardPage')){
  resetNavBarActiveItems();
  $("#navDashboardLinkItem").addClass("active");
}
else if($('body').is('.playersPage')){
  resetNavBarActiveItems();
  $("#navPlayersLinkItem").addClass("active");
  $("#adminUserManagementMenu").addClass("active");
}
else if($('body').is('.adminsPage')){
  resetNavBarActiveItems();
  $("#navAdminsLinkItem").addClass("active");
  $("#adminUserManagementMenu").addClass("active");

}
else if($('body').is('.groupsPage')){
  resetNavBarActiveItems();
  $("#navGroupsLinkItem").addClass("active");
  $("#adminUserManagementMenu").addClass("active");
}
else if($('body').is('.eventsPage')){
  $("#navEventManagementLinkItem").addClass("active");
  $("navEventManagementMenu").addClass("active");
}
else if($('body').is('.coursesPage')){
  resetNavBarActiveItems();
  $("#navCoursesLinkItem").addClass("active");
  $("#navEventManagementMenu").addClass("active");
}
else if($('body').is('.resultsPage')){
  resetNavBarActiveItems();
  $("#navResultsLinkItem").addClass("active");
  $("#navEventManagementMenu").addClass("active");
}


//reset active classes for nav items
function resetNavBarActiveItems(){
  $("#navDashboardLinkItem").removeClass("active");
  $("#navPlayersLinkItem").removeClass("active");
  $("#navAdminsLinkItem").removeClass("active");
  $("#navGroupsLinkItem").removeClass("active");
  $("#navEventsLinkItem").removeClass("active");
  $("#navCoursesLinkItem").removeClass("active");
  $("#navResultsLinkItem").removeClass("active");
}


/*






*/

// function reloadNavVariables(){
//   adminDashboardMenu = document.getElementById('adminDashboardMenu');
//   playerDashboardMenu = document.getElementById('playerDashboardMenu');
//   adminUserManagementMenu = document.getElementById('adminUserManagementMenu');
//   adminEventManagementMenu = document.getElementById('adminEventManagementMenu');
//   playerEventManagementMenu = document.getElementById('playerEventManagementMenu');
// }
