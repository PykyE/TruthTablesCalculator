let input = document.getElementById("expression");
// input.value = "(p→~q)v(q→~r)";
// input.value = "~(~p→~q)";
// input.value = "~(p→q)v(~p^~q)";
// input.value = "(p→q^~q)→~p";
// input.value = "pv(p→q^r)";
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
  let count = 0;
  usedVars = [];
  let var_arr = ["p", "q", "r"];

  for (let i = 0; i < exp.length; i++) {
    var_arr.forEach((element) => {
      if (exp.charAt(i) === element) {
        count++;
        usedVars.push(element.toUpperCase());
        var_arr = var_arr.filter((item) => {
          return item !== element;
        });
      }
    });
  }

  return count;
}

function createTable() {
  let variableCount = getNumberOfVariables();
  let container = document.getElementById("container");
  let grid = document.createElement("div");
  let oldGrid = document.getElementById("resultGrid");
  if (oldGrid) {
    container.removeChild(oldGrid);
  }
  if (variableCount === 0) {
    return;
  }
  grid.className = "resultGrid";
  grid.id = "resultGrid";
  grid.style.gridTemplateColumns = "repeat(" + variableCount + ", 1fr)";
  grid.style.gridTemplateRows =
    "repeat(" + (Math.pow(2, usedVars.length) + 1) + ", 1fr)";

  let matrix = new Array(variableCount);
  const exponent = Math.pow(2, usedVars.length);
  let change = exponent / 2;

  for (let i = 0; i < usedVars.length; i++) {
    matrix[i] = new Array(Math.pow(2, usedVars.length) + 1);
    let value = true;
    for (let j = 0; j <= exponent; j++) {
      if (j === 0) {
        matrix[i][j] = usedVars[i];
        continue;
      }
      if ((j - 1) % change === 0 && j - 1 !== 0) {
        value = !value;
      }
      matrix[i][j] = value ? "V" : "F";
    }
    change /= 2;
  }

  console.log(matrix);

  fillGrid(grid, matrix);
}

function fillGrid(grid, matrix) {
  for (let j = 0; j < matrix[0].length; j++) {
    for (let i = 0; i < matrix.length; i++) {
      let newChild = document.createElement("h3");
      newChild.innerText = matrix[i][j];
      grid.appendChild(newChild);
    }
  }
  container.appendChild(grid);
}
