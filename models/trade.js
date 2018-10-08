Trade.objects = [];
Trade.actives = [];

/**
 * Trade model.
 * @param {Object} agent_ini - initiating agent
 * @param {Object} agent_res - responding agent
 * @param {Object} cnode - cnode trade is happening in.
 * @param {int} id - id of trade. If null, one will be assigned.
 */
function Trade(agent_ini, agent_res, cnode, id=null, result_status=3) {
  this.agent_ini = agent_ini;
  this.agent_res = agent_res;
  this.cnode = cnode;
  this.result_status = result_status;

  this.items_ini = [];
  this.items_res = [];

  this.status_ini = false;
  this.status_res = false;

  (Trade.objects = Trade.objects || []).push(this);
  this.trade_id = id == null ? Trade.objects.length - 1 : id;

  if (this.result_status == 3) {
    Trade.actives.push(this);
  }

  server.log('Trade ' + this.trade_id + ' Initialized.', 2);
}


/**
 * Load a trade JSON into memory.
 * @param {JSON} data - serialized trade object.
 */
Trade.load = function(data) {
  new Trade(server.models.Agent.get_agent_by_id(data.agent_ini_id),
            server.models.Agent.get_agent_by_id(data.agent_res_id),
            server.models.Cnode.get_cnode_by_id(data.cnode_id),
            data.trade_id,
            data.result_status);

}


/**
 * Serialize this trade object into a JSON object.
 * @return {JSON}
 */
Trade.prototype.serialize = function() {
  var data = {
    trade_id: this.trade_id,
    agent_ini_id: this.agent_ini.agent_id,
    agent_res_id: this.agent_res.agent_id,
    cnode_id: this.cnode.cnode_id,
    result_status: this.result_status
  }

  return data;
}


/**
 * Serialize all trades and save them to files.
 */
Trade.save_all = function() {
  server.log("Saving trades...", 2);

  for (let trade of Trade.objects) {
    server.log("Saving trade " + trade.trade_id, 2);

    server.modules.fs.writeFileSync(server.settings.data_dir + '/trades/trade_'
      + trade.trade_id + '.json',
      JSON.stringify(trade.serialize()), 'utf8');
  }

  server.log("Trades saved.", 2);
}


/**
 * Load all trades from file into memory.
 */
Trade.load_all = function() {
  server.log("Loading trades...", 2);

  server.modules.fs.readdirSync(server.settings.data_dir + '/trades/').forEach(function(file) {
    server.modules.fs.readFile(server.settings.data_dir + '/trades/' + file, function read(err, data) {
      if (err) {
        server.log(err);
        return;
      }

      var json = JSON.parse(data);
      server.log("Loading trade " + json.trade_id, 2);
      Trade.load(json);
    });
  });
}


Trade.prototype.get_agent_items_data = function(agent) {
  data = [];

  if (agent == this.agent_ini || agent == this.agent_res) {
    for (let item of agent == this.agent_ini ? this.items_ini : this.items_res) {
      data.push(item.get_data());
    }
  }
  else {
    server.log("No matching agent for trade item data.", 0, 'trade.js');
  }

  return data;
}


/**
 * Get 'ready-to-send' data to send to client.
 * @returns {Object}
 */
Trade.prototype.get_data = function() {
  return {
    'trade_id': this.trade_id,
    'agent_ini_id': this.agent_ini.agent_id,
    'agent_res_id': this.agent_res.agent_id,
    'items_ini': this.get_agent_ini_items_data(),
    'items_res': this.get_agent_res_items_data(),
    'room_id': this.room.room_id,
    'cnode_id': this.cnode.cnode_id,
    'result_status': this.result_status
  }
}

Trade.prototype.set_status = function(stat) {
  this.result_status = stat;
}

Trade.prototype.set_agent_ready = function(agent, rstatus) {
  if (agent == this.agent_ini) {
    this.status_ini = rstatus;
  }
  else if(agent == this.agent_res) {
    this.status_res = rstatus;
  }

  return this.status_ini && this.status_res;
}

Trade.prototype.add_items = function(items, owner) {
  if (owner == this.agent_ini) {
    this.items_ini.push(...items);
  }
  else if (owner == this.agent_res) {
    this.items_res.push(...items);
  }
  else {
    server.log("Agent not in trade", 0, "trade.js");
    return;
  }

  for (let item of items) {
    item.in_transaction = true;
  }
}


Trade.prototype.remove_items = function(items, owner) {
  if (owner == this.agent_ini) {
    this.items_ini = this.items_ini.filter(function(x) {
      return items.indexOf(x) < 0;
    });
  }
  else if (owner == this.agent_res) {
    this.items_res = this.items_res.filter(function(x) {
      return items.indexOf(x) < 0;
    });
  }
  else {
    server.log("Agent not in trade", 0, "trade.js");
    return;
  }

  for (let item of items) {
    item.in_transaction = false;
  }
}

Trade.prototype.cleanup = function() {
  var unlocked = '';

  for (let item of this.items_ini) {
    item.in_transaction = false;
    unlocked += item.item_id + " ";
  }

  for (let item of this.items_res) {
    item.in_transaction = false;
    unlocked += item.item_id + " ";
  }

  Trade.actives.splice(Trade.actives.indexOf(this), 1);

  server.log("Unlocked trade " + this.trade_id + " items [ " + unlocked + "]", 2);
}

/**
 * Find a trade by its id.
 * @param {int} trade_id - trade id
 * @return {Object/null}
 */
Trade.get_trade_by_id = function(trade_id) {
  for (let trade of Trade.objects) {
    if (trade.trade_id == trade_id) {
      return trade;
    }
  }

  server.log('Could not find trade with id ' + trade_id + '.', 0, 'trade.js');
  return null;
}

Trade.get_active_trades_with_agent = function(agent) {
  trades = [];

  for (let trade of Trade.actives) {
    if (trade.agent_ini == agent || trade.agent_res == agent) {
      trades.push(trade);
    }
  }

  return trades;
}

module.exports = Trade;
