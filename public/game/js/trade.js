Trade.objects = [];

function Trade(agent, id) {
  this.trade_id = id;
  this.agent = agent;

  Trade.objects.push(this);

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

  var itemRow = document.createElement("tr");
  var itemArea1 = document.createElement("td");
  var itemArea2 = document.createElement("td");
  itemRow.appendChild(itemArea1);
  itemRow.appendChild(itemArea2);
  table.appendChild(itemRow);

  var myItemDiv = document.createElement("div");
  var youItemDiv = document.createElement("div");
  myItemDiv.id = "myItemArea_" + trade_id;
  youItemDiv.id = "youItemArea_" + trade_id;
  itemArea1.appendChild(myItemDiv);
  itemArea2.appendChild(youItemDiv);

  var tradeRow = document.createElement("tr");
  var tradeArea1 = document.createElement("td");
  var tradeArea2 = document.createElement("td");
  tradeRow.appendChild(tradeArea1);
  tradeRow.appendChild(tradeArea2);
  table.appendChild(tradeRow);


  var itemSelectDiv = document.createElement("div");
  var itemSelect = document.createElement("select");
  var addItemButton = document.createElement("button");
  itemSelect.style.display = "inline-block";
  itemSelect.id = "select_" + trade_id;
  addItemButton.style.display = "inline-block";
  addItemButton.innerHTML = "add";
  addItemButton.addEventListener('click', function(){
    var e = document.getElementById("select_" + trade_id);
    Client.send.offerItemsTrade(trade_id, [parseInt(e.options[e.selectedIndex].value)]);
  });
  itemSelectDiv.appendChild(itemSelect);
  itemSelectDiv.appendChild(addItemButton);

  var options = Trade.get_available_options();
  for (let option of options) {
    itemSelect.add(option);
  }

  tradeArea1.appendChild(itemSelectDiv);

  node.appendChild(title);
  node.appendChild(cancelButton);
  node.appendChild(table);

  container.appendChild(node);
}

Trade.get_available_options = function() {
  var options = [];
  for (var item_id in inventory) {
    var option = document.createElement("option");
    option.value = item_id;
    option.text = inventory[item_id].item_name;
    options.push(option);
  }
  return options;

}

Trade.prototype.add_items = function(items_data, is_mine) {
  var container = is_mine ? document.getElementById("myItemArea_"+this.trade_id) : document.getElementById("youItemArea_"+this.trade_id);
  var trade_id = this.trade_id;

  for (let data of items_data) {
    var tradeItemDiv = document.createElement("div");
    tradeItemDiv.id = "tradeItem_" + this.trade_id + "_" + data.item_id;
    var itemTitle = document.createElement("p");
    itemTitle.innerHTML = data.item_name;
    itemTitle.style.display = "inline-block";
    tradeItemDiv.appendChild(itemTitle);

    if (is_mine) {
      var itemRemoveButton = document.createElement("button");
      itemRemoveButton.innerHTML = "Remove";
      itemRemoveButton.addEventListener('click', function(){
        Client.send.withdrawItemsTrade(trade_id, [data.item_id]);
      });
      tradeItemDiv.appendChild(itemRemoveButton);
    }


    container.appendChild(tradeItemDiv);
  }
}

Trade.prototype.remove_items = function(item_ids) {
  for (let item_id of item_ids) {
    var row = document.getElementById("tradeItem_" + this.trade_id + "_" + item_id);
    row.parentNode.removeChild(row);
  }
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

Trade.get_trade_by_id = function(trade_id) {
  for (let trade of Trade.objects) {
    if (trade.trade_id == trade_id) {
      return trade;
    }
  }
  console.log("Could not find trade with id " + trade_id);
}
