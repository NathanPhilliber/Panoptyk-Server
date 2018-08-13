$(document).ready(function(){
  showLoginArea();
});

function submitLogin(parentNode) {
  var username = document.getElementById("i_input_username").value;
  var password = document.getElementById("i_input_password").value;

  Client.send.login(username, password);
}

function updateAgentInfo(username, id) {
  document.getElementById("i_p_agentName").innerHTML = username;
  document.getElementById("i_p_agentID").innerHTML = id;
}

function showLoginArea() {
  document.getElementById("i_div_loginArea").style.display = "block";
  document.getElementById("i_div_game").style.display = "none";
  document.getElementById("i_div_sidebar").style.display = "none";
}

function showGameArea() {
  document.getElementById("i_div_loginArea").style.display = "none";
  document.getElementById("i_div_game").style.display = "inline-block";
  document.getElementById("i_div_sidebar").style.display = "inline-block";
}
