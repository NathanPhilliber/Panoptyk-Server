server.clock = {};

// In the future you will want to change this to fake "Panoptyk" time.
server.clock.get_datetime = function() {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + ' ' + time;
}
