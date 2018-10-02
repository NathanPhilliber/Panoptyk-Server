
function Trade(agent, id) {
  this.trade_id = id;
  this.agent = agent;

  this.draw();

  console.log("Trade " + this.trade_id + " initialized");
}

Trade.prototype.draw = function() {
  var container = document.getElementById("i_div_tradeAreaAll");
  var node = document.createElement('div');
  node.id = "activeTrade_" + this.trade_id;
  node.style.outline = "solid black 1px";

  var title = document.createElement('h6');
  title.innerHTML = "Trade with " + this.agent.name;

  var trade_id = this.trade_id;
  var cancelButton = document.createElement("button");
  cancelButton.innerHTML = "Cancel Trade";
  cancelButton.addEventListener("click", function(){Client.send.cancelTrade(trade_id)});

  var table = document.createElement('table');
  table.style.width = "100%";

  var header = document.createElement("tr");
  var header1 = document.createElement("th");
  var header2 = document.createElement("th");
  header1.innerHTML = "You";
  header2.innerHTML = this.agent.name;
  header.appendChild(header1);
  header.appendChild(header2);
  table.appendChild(header);

  var tradeRow = document.createElement("tr");
  var tradeArea1 = document.createElement("td");
  var tradeArea2 = document.createElement("td");
  tradeRow.appendChild(tradeArea1);
  tradeRow.appendChild(tradeArea2);
  table.appendChild(tradeRow);


  node.appendChild(title);
  node.appendChild(cancelButton);
  node.appendChild(table);

  container.appendChild(node);
}

Trade.prototype.destroy = function() {
  var node = document.getElementById("activeTrade_" + this.trade_id);
  node.parentNode.removeChild(node);
}

Trade.get_trade_with_agent = function(agent) {
  console.log(Agent.my_agent.trades);

  for (var trade_id in Agent.my_agent.trades) {
    if (agent == Agent.my_agent.trades[trade_id].agent) {
      return Agent.my_agent.trades[trade_id];
    }
  }

  console.log("Could not find trade with agent " + agent.agent_id);
  return null;
}
