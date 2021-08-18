let input = document.getElementById("expression");
// input.value = "((p→(~q))v(q→(~r)))";
// input.value = "~(~p→~q)";
// input.value = "~(p→q)v(~p^~q)";
// input.value = "(p→q^~q)→~p";
// input.value = "pv(p→q^r)";
input.value = "(pv(p→(~q^r)))";
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
