$(document).ready(function(){
  showLoginArea();
  document.getElementById("i_div_agentInfo_tab").click();
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

function updateInventoryAdd(items) {
  for (let item of items) {
    updateInventoryAddItem(item);
  }
}

function updateInventoryRemove(item_ids) {
  for (let item_id of item_ids) {
    updateInventoryRemoveItem(item_id);
  }
}

inventory = {};
function updateInventoryAddItem(item) {
  inventory[item.item_id] = item;
  var node = document.createElement('div');
  node.id = 'item_' + item.item_id;
  node.style.outline = '1px solid black';

  var dropButton = document.createElement('button');
  dropButton.innerHTML = "Drop";

  dropButton.addEventListener("click", function(){ Client.send.dropItems([item]) });

  var itemText = document.createElement('p');
  itemText.style.display = "inline-block";
  itemText.innerHTML = "Name: " + item.item_name + ", ID: " +
    item.item_id + ", Type: " + item.item_type;

  node.appendChild(dropButton);
  node.appendChild(itemText);

  document.getElementById('i_div_inventory').appendChild(node);
}

function updateInventoryRemoveItem(item_id) {
  delete inventory[item_id];
  var del = document.getElementById('item_' + item_id);
  del.parentNode.removeChild(del);
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

function loadTradeMeetingSpot(name, agents) {
  document.getElementById("i_h_meetingSpotName").innerHTML = name;
  var adiv = document.getElementById("i_div_meetingSpotAgents");

  for (let agent of agents) {
    if (agent != Agent.my_agent){
      adiv.appendChild(getAgentMeetingRow(agent));
    }
  }
}

function clearTradeMeetingSpot() {
  document.getElementById("i_h_meetingSpotName").innerHTML = "Not in a meeting location.";

  document.getElementById("i_div_meetingSpotAgents").innerHTML = "";
}

function getAgentMeetingRow(agent) {
  var node = document.createElement('div');
  node.id = 'tradeAgentDiv_' + agent.agent_id;

  var tradeButton = document.createElement('button');
  tradeButton.id = "tradeButton_" + agent.agent_id;
  tradeButton.innerHTML = "Trade";
  tradeButton.addEventListener("click", function(){Client.send.requestTrade(agent.agent_id)});

  var confirmButton = document.createElement("button");
  confirmButton.id = "tradeConfirm_" + agent.agent_id;
  confirmButton.innerHTML = "Accept Trade Request";
  confirmButton.addEventListener("click", function(){Client.send.acceptTrade(agent.last_trade_id)});
  confirmButton.style.display = "none";

  var agentText = document.createElement('p');
  agentText.style.display = 'inline-block';
  agentText.innerHTML = agent.name;

  node.appendChild(tradeButton);
  node.appendChild(confirmButton);
  node.appendChild(agentText);

  return node;
}

function removeAgentMeetingRow(agent_id) {
  var node = document.getElementById("tradeAgentDiv_" + agent_id);
  node.parentNode.removeChild(node);
}

function updateTradeRequest(trade_id, agent_id, show=true){
  document.getElementById("tradeButton_" + agent_id).style.display = show ? "none" : "inline-block";
  document.getElementById("tradeConfirm_" + agent_id).style.display = show ? "inline-block" : "none";
}

function changeTab(evt, tabID) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabID).style.display = "block";
    evt.currentTarget.className += " active";
}


