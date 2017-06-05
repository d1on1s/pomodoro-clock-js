$(function() {
  var countdown;

  function Timer() {
    this.timeLeft = 0;
    this.timeType = "session";
    this.sessionLen = 0;
    this.breakLen = 0;

    function getTime(element) {
      var timeSecs = $(element).html().split(" ")[2];
      if (timeSecs.charAt(timeSecs.length - 1) == "s") {
        return parseInt(timeSecs.slice(0, -1));
      }
      if (timeSecs.charAt(timeSecs.length - 1) == "m") {
        return parseInt(timeSecs.slice(0, -1)) * 60;
      }
      if (timeSecs.charAt(timeSecs.length - 1) == "h") {
        return parseInt(timeSecs.slice(0, -1)) * 3600;
      }           
    };

    function showTime(sec) {
      var hours = parseInt(sec / 3600);
      var minutes = parseInt((sec - (hours * 3600)) / 60);
      var seconds = sec - (hours * 3600) - (minutes * 60);
      var output = "0" + hours.toString() + ":";
      if (minutes.toString().length == 1) {
        output += "0" + minutes.toString() + ":";
      } else {
        output += minutes.toString() + ":";
      }
      if (seconds.toString().length == 1) {
        output += "0" + seconds.toString();
      } else {
        output += seconds.toString();
      }
      return output;
    };

    this.getInfo = function() {
      this.sessionLen = getTime("#session");
      this.breakLen = getTime("#break");
      this.timeLeft = this.sessionLen;
      $("#timeLeft").html(showTime(this.timeLeft));      
      $(".time").removeClass("current");
      $("#session").addClass("current");
    };

    this.switch = function() {
      if (this.timeType == "session") {
        this.timeType = "break";
        this.timeLeft = this.breakLen;
        $(".drop").hide();
      } else {
        this.timeType = "session";
        this.timeLeft = this.sessionLen;
        $(".drop").hide();
      }
      $(".time").show();
      $(".time").toggleClass("current");
    };

    this.coffee = function() {
      var delta = 0;
      if (this.timeType == "session") {
        delta = parseInt((this.sessionLen - this.timeLeft) / this.sessionLen * 300) + 48;
      } else {
        delta = parseInt(300 - ((this.breakLen - this.timeLeft) / this.breakLen * 300)) + 48;
      }
      delta = delta.toString() + "px";
      $(".coffee").css("height", delta);
    };

    this.countDown = function() {
      this.timeLeft--;
      this.coffee();
      $("#timeLeft").html(showTime(this.timeLeft));
      $(".current").toggle();
      if (this.timeLeft === 0) {
        this.switch();
        this.start();
      }
    };

    this.getInfo();
  };

  var sessionDrag = Draggable.create("#spin1", {type: "rotation", throwProps: true, onDrag: function() {
    var time = 0;
    var timeProp = "";
    if (this.x < -590) {
      time = 1;
      timeProp = "s";
    }
    if (this.x >= -590 && this.x < 0) {
      time = parseInt((this.x + 600) / 10);
      timeProp = "s";
    }
    if (this.x >= 0 && this.x < 10) {
      time = 1;
      timeProp = "m";
    }
    if (this.x >= 10 && this.x < 590) {
      time = parseInt((this.x + 10) / 10);
      timeProp = "m";
    }
    if (this.x >= 590) {
      time = 1;
      timeProp = "h";
    }
    $("#session").html("session time: " + time + timeProp);
  }});
  var breakDrag = Draggable.create("#spin2", {type: "rotation", throwProps: true, onDrag: function() {
    var time = 0;
    var timeProp = "";
    if (this.x < -590) {
      time = 1;
      timeProp = "s";
    }
    if (this.x >= -590 && this.x < 0) {
      time = parseInt((this.x + 600) / 10);
      timeProp = "s";
    }
    if (this.x >= 0 && this.x < 10) {
      time = 1;
      timeProp = "m";
    }
    if (this.x >= 10 && this.x < 590) {
      time = parseInt((this.x + 10) / 10);
      timeProp = "m";
    }
    if (this.x >= 590) {
      time = 1;
      timeProp = "h";
    }
    $("#break").html("break time: " + time + timeProp);
  }});

  $(".drop").hide();

  $("#toggle").click(function() {
    if ($("#toggle").html() == "start") {
      $("#toggle").html("stop");
      sessionDrag[0].disable();
      breakDrag[0].disable();
      $(".drop").show();      
      var timer = new Timer();
      countdown = setInterval(function() {timer.countDown()}, 1000);
    } else {
      $("#toggle").html("start");
      sessionDrag[0].enable();
      breakDrag[0].enable();     
      $(".drop").hide();
      $(".current").show();
      $("#timeLeft").html("00:00:00");
      $(".coffee").css("height", "48px");      
      clearInterval(countdown);
    }
  });


});