// <!-- 
// \*Yashodha Samarawickrama */
//  -->


function Calculator() {
  //private
  var result = 0;
  var previous = 0;
  var reset = false;

  //public
  this.opVals = ["+","-","*","/"];

  this.isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  this.convertExpression = function(s) {
    if (s.length === 0) return 0;

    var a = [];
    a = s.split(" ");
    for(var i = 0; i < a.length; i++) {
      if (this.isNumeric(a[i])) {
        a[i] = Number(a[i]);
      }
    }

    return a;
  }

  this.multiplyOrDivide = function(a) {
    var total = 0;
    if (a.indexOf('*') !== -1 || a.indexOf('/') !== -1) {
      for (var i = 0; i < a.length; i++) {
        try {
          switch(a[i]) {
            case '*':
              total = a[i-1] * a[i+1];
              a.splice(i-1,3,total);
              i--;
              break;
            case '/':
              if (a[i+1] === 0) {
                throw new Error("dividing by zero");
              } else {
                total = a[i-1] / a[i+1];
              }
              a.splice(i-1,3,total);
              i--;
              break;
            default:
              break;
          }
        } catch(e) {
          console.log(e.name + ': ' + e.message);
        }
      }
    }
    return a;
  }

  this.addOrSubtract = function(a) {
    var total = 0;
    if (a.indexOf('+') !== -1 || a.indexOf('-') !== -1) {
      for (var i = 0; i < a.length; i++) {
        try {
          switch(a[i]) {
            case '+':
              total = a[i-1] + a[i+1];
              a.splice(i-1,3,total);
              i--;
              break;
            case '-':
              total = a[i-1] - a[i+1];
              a.splice(i-1,3,total);
              i--;
              break;
            default:
              break;
          }
        } catch (e) {
          console.log(e.name + ': ' + e.message);
        }
      }
    }
    return a;
  }

  this.equals = function(s) {
    if (s.length === 0) return "";

    var a = this.convertExpression(s);
    previous = result;
    if (a.length === 0)
      result = 0;
    
    //order of operations
    a = this.multiplyOrDivide(a);
    a = this.addOrSubtract(a);

    try {
      if ( a.length !== 1 || !Number(a[0]) ) {
        throw new Error("Order of operations incomplete");
      }
      result = a[0];
    } catch(e) {
      console.log(e.name + ': ' + e.message);
      result = "error";
    }
        
    return result;
  }

  this.setReset = function(val) {
    reset = val;
  }

  this.getReset = function() {
    return reset;
  }

  this.clearAll = function() {
    result = "";
    previous = "";
    return result;
  }

  //go back to last answer
  this.clearLast = function() {
    result = previous;
    previous = "";
    return result;
  }

}

var init = function() {
  var myCalc = new Calculator();
  var inputOutput = document.getElementById("inputOutput");
  
  //event handler
  var calculate = function(e) {
    var element = e.target || e.srcElement;
    var op = element.innerHTML;
    var opVals = myCalc.opVals;

    try {
      if (myCalc.isNumeric(op)) {

        if (myCalc.getReset()) {
          inputOutput.value = op;
        } else {
          inputOutput.value += op;
        }
        myCalc.setReset(false);

      } else if (op === ".") {

        if (myCalc.isNumeric(inputOutput.value.substr(-1))) {
          inputOutput.value += op;
          myCalc.setReset(false);
        }

      } else if (opVals.indexOf(op) !== -1) {

        if (opVals.indexOf(inputOutput.value.substr(-2,1)) === -1) {
          inputOutput.value += " " + op + " ";
          myCalc.setReset(false);
        }
          
      } else if (op === "=" && !myCalc.getReset()) {

        inputOutput.value = myCalc.equals(inputOutput.value);
        myCalc.setReset(true);

      } else if (op === "CE") {

        inputOutput.value = myCalc.clearLast();
        myCalc.setReset(true);

      } else if (op === "AC") {

        myCalc.clearAll();
        inputOutput.value = "";
        myCalc.setReset(true);

      } else {

        throw new Error("unknown entry");

      }
    } catch(e) {
      console.log(e.name + ': ' + e.message);
      inputOutput.value = "error";
    }
  };

  //add events
  (function(){
    var calc = document.getElementById("calculator");
    var buttons = calc.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) { 
      buttons[i].addEventListener("click", calculate);
    }
  })();

};

window.onload = init;
