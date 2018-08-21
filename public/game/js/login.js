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

function updateInventoryAddItem(item) {
  var node = document.createElement('p');
  node.innerHTML = "Name: " + item.item_name + ", ID: " + item.item_id + ", Type: " + item.item_type;
  node.style.outline = '1px solid black';
  node.id = 'item_' + item.item_id;
  document.getElementById('i_div_inventory').appendChild(node);
}

function updateInventoryRemoveItem(item_id) {
  var del = document.getElementyId('item_' + item_id);
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
