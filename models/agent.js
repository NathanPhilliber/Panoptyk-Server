
function Agent(socket, username) {
  this.agent_id = null;
  this.username = username;
  this.room = null;
  this.socket = socket;

  (Agent.objects = Agent.objects || []).push(this);
  server.logger.log("Agent Initialized");
}

module.exports = Agent;
