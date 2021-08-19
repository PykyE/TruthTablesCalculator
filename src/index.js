let input = document.getElementById("expression");
// input.value = "((p→(~q))v(q→(~r)))";
// input.value = "~(~p→~q)";
// input.value = "~(p→q)v(~p^~q)";
// input.value = "(p→q^~q)→~p";
// input.value = "pv(p→q^r)";
input.value = "(pv~(~p→(~q^~r)))";
let usedVars = [];

function handleInput(event) {
  switch (event.target.innerText) {
    case "DEL":
      let length = input.value.length;
      let newString = input.value.substring(0, length - 1);
      input.value = newString;
      break;
    case "AC":
      input.value = "";
      break;
    default:
      let text = input.value;
      input.value = text + event.target.innerText;
      break;
  }
}

function getNumberOfVariables() {
  let exp = input.value;
  usedVars = [];
  let var_arr = ["p", "q", "r"];

  for (let i = 0; i < exp.length; i++) {
    var_arr.forEach((element) => {
      if (exp.charAt(i) === element) {
        usedVars.push(element.toUpperCase());
        var_arr = var_arr.filter((item) => {
          return item !== element;
        });
      }
    });
  }
}

function _not(arr) {
  return arr.map((item) => {
    return item === "V" ? "F" : "V";
  });
}

function _and(arr, arr2) {
  verifLengths(arr, arr2);
  return arr.map((item, index) => {
    return item === "V" && arr2[index] === "V" ? "V" : "F";
  });
}

function _or(arr, arr2) {
  verifLengths(arr, arr2);
  return arr.map((item, index) => {
    return item === "V" || arr2[index] === "V" ? "V" : "F";
  });
}

function _conditional(arr, arr2) {
  verifLengths(arr, arr2);
  return arr.map((item, index) => {
    return item === "V" && arr2[index] === "F" ? "F" : "V";
  });
}

function _biConditional(arr, arr2) {
  verifLengths(arr, arr2);
  return arr.map((item, index) => {
    return item === arr2[index] ? "V" : "F";
  });
}

function verifLengths(arr, arr2) {
  if (arr.length !== arr2.length) {
    throw new Error("Wrong sized arrays");
  }
}

function createMatrix() {
  getNumberOfVariables();
  let numberOfVariables = usedVars.length;
  const numberOfRows = Math.pow(2, numberOfVariables);
  const numberOfColumns = numberOfVariables + input.value.length;
  let dataMatrix = new Array(numberOfColumns);
  let swapBoolValue = numberOfRows / 2;

  //Fill used variables columns
  for (let i = 0; i < numberOfColumns; i++) {
    dataMatrix[i] = new Array(Math.pow(2, numberOfVariables));
    let value = true;
    for (let j = 0; j <= numberOfRows; j++) {
      if (j === 0) {
        if (i < numberOfVariables) {
          dataMatrix[i][j] = usedVars[i];
        } else {
          dataMatrix[i][j] = input.value.charAt(i - numberOfVariables);
        }
        continue;
      }
      if ((j - 1) % swapBoolValue === 0 && j - 1 !== 0) {
        value = !value;
      }
      if (i < numberOfVariables) {
        dataMatrix[i][j] = value ? "V" : "F";
      } else {
        dataMatrix[i][j] = "";
      }
    }
    swapBoolValue /= 2;
  }

  //Fill variables
  for (let i = 0; i < numberOfColumns; i++) {
    switch (dataMatrix[i][0]) {
      case "p":
        for (let a = 0; a < numberOfVariables; a++) {
          if (dataMatrix[a][0] === "P") {
            let slice = ["p"].concat(dataMatrix[a].slice(1));
            dataMatrix[i] = slice;
          }
        }
        break;
      case "q":
        for (let a = 0; a < numberOfVariables; a++) {
          if (dataMatrix[a][0] === "Q") {
            let slice = ["q"].concat(dataMatrix[a].slice(1));
            dataMatrix[i] = slice;
          }
        }
        break;
      case "r":
        for (let a = 0; a < numberOfVariables; a++) {
          if (dataMatrix[a][0] === "R") {
            let slice = ["r"].concat(dataMatrix[a].slice(1));
            dataMatrix[i] = slice;
          }
        }
        break;
    }
  }

  //Fill _not operations for variables
  for (let i = 0; i < numberOfColumns; i++) {
    switch (dataMatrix[i][0]) {
      case "~":
        if (
          dataMatrix[i + 1][0] === "q" ||
          dataMatrix[i + 1][0] === "p" ||
          dataMatrix[i + 1][0] === "r"
        ) {
          let slice = dataMatrix[i + 1].slice(1);
          slice = _not(slice);
          dataMatrix[i] = ["~"].concat(slice);
        }
        break;
    }
  }

  const symbols = ["P", "Q", "R", "(", ")", "~"];
  const variables = ["p", "q", "r"];

  function solveExpression(expression) {
    let arrReturn = [];
    let leftPart = expression.left;
    let rightPart = expression.right;
    let leftNot = expression.left_not;
    let rightNot = expression.right_not;
    if (variables.includes(leftPart) && variables.includes(rightPart)) {
      let firstVar = getColumn(dataMatrix, leftPart).slice(1);
      let firstParam = leftNot === true ? _not(firstVar) : firstVar;
      let secondVar = getColumn(dataMatrix, rightPart).slice(1);
      let secondParam = rightNot === true ? _not(secondVar) : secondVar;
      switch (expression.symbol) {
        case "^":
          arrReturn = [expression.symbol].concat(_and(firstParam, secondParam));
          break;
        case "v":
          arrReturn = [expression.symbol].concat(_or(firstParam, secondParam));
          break;
        case "→":
          arrReturn = [expression.symbol].concat(
            _conditional(firstParam, secondParam)
          );
          break;
        case "↔":
          arrReturn = [expression.symbol].concat(
            _biConditional(firstParam, secondParam)
          );
          break;
      }
    } else {
      //ugly stuff
    }
    return arrReturn;
  }

  //Create expressions
  let expressions = [];
  let usedIndexes = [];
  for (let i = 0; i < numberOfColumns; i++) {
    let symbol = dataMatrix[i][0];
    if (!symbols.concat(variables).includes(symbol)) {
      usedIndexes.push(i);
      let a = { symbol: symbol };
      //create left part
      let left = dataMatrix[i - 1][0];
      if (variables.includes(left)) {
        a.left = left;
        let notVerif = dataMatrix[i - 2][0];
        a.left_not = notVerif === "~" ? true : false;
      } else {

      }
      //create right part
      let notVerif = dataMatrix[i + 1][0];
      a.right_not = notVerif === "~" ? true : false;
      let right = a.right_not ? dataMatrix[i + 2][0] : dataMatrix[i + 1][0];
      if (variables.includes(right)) {
        a.right = right;
      } else {
        
      }
      expressions.push(a);
    }
  }

  createGrid(dataMatrix, numberOfVariables);
}

function getColumn(dataMatrix, str) {
  for (let i = 0; i < dataMatrix.length; i++) {
    if (dataMatrix[i][0] === str) {
      return dataMatrix[i];
    }
  }
  return null;
}

function createGrid(dataMatrix, numberOfVariables) {
  let container = document.getElementById("container");
  let grid = document.createElement("div");
  removeOldGrid();
  if (numberOfVariables === 0) {
    return;
  }
  grid.className = "resultGrid";
  grid.id = "resultGrid";
  grid.style.gridTemplateColumns = "repeat(" + dataMatrix.length + ", 1fr)";
  grid.style.gridTemplateRows = "repeat(" + dataMatrix[0].length + ", 1fr)";

  for (let j = 0; j < dataMatrix[0].length; j++) {
    for (let i = 0; i < dataMatrix.length; i++) {
      let newChild = document.createElement("h3");
      if (j === 0) {
        newChild.style.color = "#f5f5dc";
      }
      newChild.innerText = dataMatrix[i][j];
      grid.appendChild(newChild);
    }
  }
  container.appendChild(grid);
}

function removeOldGrid() {
  let oldGrid = document.getElementById("resultGrid");
  if (oldGrid) {
    container.removeChild(oldGrid);
  }
}
