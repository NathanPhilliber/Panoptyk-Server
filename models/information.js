'use strict';

class Info {

  /**
   * Info model.
   * @param {int} id - id of item. If null, one will be assigned
   * @param {int} action - action occured as int code
   * @param {String} predicate - predicate contents see Info.PREDICATE Enum
   * @param {int} owner - Agent who owns this info
   * @param {long} time - Time information/event happened (possible predicate)
   * @param {bool} query - is this info just a query? 
   * @param {int} location - possible predicate of location event occured at
   * @param {int} agent - possible predicate about agent
   * @param {int} agent2 - possible predicate about another agent
   * @param {int} item - possible predicate of a tangible item type
   * @param {int} quantity - possible predicate about quantity of tangible item
   * @param {int} faction - possible predicate about faction group
   * @param {int} infoID - possible predicate pointing to other info needed 
   */
  constructor (id, owner, time, infoID) {
    if (id == null)
      this.id = Info.nextID++;
    else
      this.id = id;

    this.action = null;
    this.predicate = null;
    this.owner = owner;
    this.time = time;
    this.query = false;
    this.location = null;
    this.agent = null;
    this.agent2 = null;
    this.item = null;
    this.quantity = null;
    this.faction = null;
    this.infoID = infoID;    

    Info.objects[this.id] = this;

    //server.log('Item ' + this.type + ':' + this.name + ' Initialized.', 2);
  }

  testMethod() {
    console.log("I am test!");
  }

}

Info.objects = {};
Info.nextID = 1;

Info.PREDICATE = {
  TAL: {
    name: "TAL", // predicate(Time, Agent, Location)
    /**
     * Creates an action that uses this predicate formate
     * @param {*} owner - agent who owns this info
     * @param {*} v - object of predicate variables: {0: Time, 1: Agent, 2: Location}
     */
    create: function(owner, v) {
      var i = new Info(null, owner, v[0], null);
      i.predicate = Info.PREDICATE.TAL.name;

      i.agent = v[1];
      i.location = v[2];
      return i;
    }
  },
  TAF: {
    name: "TAF", // predicate(Time, Agent, Faction)
    /**
     * Creates an action that uses this predicate formate
     * @param {*} owner - agent who owns this info
     * @param {*} v - object of predicate variables: {0: Time, 1: Agent, 2: Faction}
     */
    create: function(owner, v) {
      var i = new Info(null, owner, v[0], null);
      i.predicate = Info.PREDICATE.TAF.name;

      i.agent = v[1];
      i.faction = v[2];
      return i;
    }
  },
  TAA: {
    name: "TAA", // predicate(Time, Agent, Agent)
    /**
     * Creates an action that uses this predicate formate
     * @param {*} owner - agent who owns this info
     * @param {*} v - object of predicate variables: {0: Time, 1: Agent, 2: Agent}
     */
    create: function(owner, v) {
      var i = new Info(null, owner, v[0], null);
      i.predicate = Info.PREDICATE.TAA.name;

      i.agent = v[1];
      i.agent2 = v[2];
      return i;
    }
  },
  TAK: "TAK", // predicate(Time, Agent, Location)
  TAAL: "TAAL", // predicate(Time, Agent, Agent, Location)
  TAALK: "TAALK", // predicate(Time, Agent, Agent, Location, Info-ID)
  TAILQ: "TAILQ", // predicate(Time, Agent, Tangible-Item, Location, Quantity)
  TAAILQ: "TAAILQ" // predicate(Time, Agent, Agent, Tangible-Item, Location, Quantity)
};

Info.ACTION = {
  ENTER: {code: 1, name: 'enter', create: Info.PREDICATE.TAL.create},
  DEPART: 2,
  PICKUP: 3,
  DROP: 4,
  KNOW: 5,
  STEAL: 6,
  KILL: 7, 
  WORKSFOR: 8, 
  BOSSOF: 9,
  CONVERSE: 10,
  GREET: 11,
  ASK: 12,
  TOLD: 13
};


var i = new Info(null, null, null, null, null);
console.log(Info.objects);
console.log(JSON.stringify(i));


module.exports = Info
