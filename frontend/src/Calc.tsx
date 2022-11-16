import { useReducer, KeyboardEventHandler, ChangeEventHandler } from "react";
import "./Calc.css";

type Action = {
  type: "Number" | "." | "Enter" | "Backspace" | "Op" | "Clear";
  key?: string;
  operation?: Function;
};

type State = {
  inputing: boolean;
  value: string;
  valueIsResult: boolean;
  stack: number[];
};

const defaultState = {
  inputing: false,
  value: "0.00",
  valueIsResult: false,
  stack: [0, 0, 0],
};

function reducer(state: State, action: Action): State {
  const key = action.key ?? "";
  let stack = [...state.stack];
  let inputing = state.inputing || false;
  let value = state.value || "";
  let valueIsResult = state.valueIsResult;

  // console.log(`state: [${state.join(",")}]`);
  // console.log(`action  type: ${action.type}  key: ${action.key}`);

  switch (action.type) {
    case "Number":
      if (inputing) {
        value = value + key;
      } else {
        if (valueIsResult) stack.push(parseFloat(value));
        value = key;
      }
      valueIsResult = false;
      inputing = true;
      break;
    case ".":
      if (inputing) {
        if (value.indexOf(".") < 0) value = value + key;
      } else {
        value = key;
      }
      if (valueIsResult) stack.push(parseFloat(value));
      valueIsResult = false;
      inputing = true;
      break;
    case "Op":
      const y = stack.pop() ?? 0;
      inputing = false;
      const x = parseFloat(value);
      valueIsResult = true;
      if (action.operation) value = action.operation(y, x);
      break;
    case "Backspace":
      if (inputing) {
        value = value.slice(0, -1);
        if ((value = "")) inputing = false;
      } else {
        value = "0";
      }
      valueIsResult = false;
      break;
    case "Enter":
      stack.push(parseFloat(value));
      valueIsResult = false;
      inputing = false;
      break;
    case "Clear":
      inputing = false;
      valueIsResult = false;
      value = "0";
      stack = [0, 0, 0];
      break;
  }

  // console.log(`new: [${stack.join(",")}]`);
  const newState = { inputing, value, valueIsResult, stack };
  return newState;
}

function add(a: number, b: number) {
  return a + b;
}
function subtract(a: number, b: number) {
  return a - b;
}
function multiply(a: number, b: number) {
  return a * b;
}
function divide(a: number, b: number) {
  return a / b;
}

function Calc() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const stack = state.stack;
  const inputing = state.inputing;
  const value = state.value;

  const handleChange: ChangeEventHandler = (e) => {
    e.preventDefault();
  };

  const handleKey: KeyboardEventHandler = (e) => {
    e.preventDefault();
    const key = e.key;
    // console.log({ e });

    if (isNumeric(key)) {
      dispatch({ type: "Number", key });
    } else if (key === "c") {
      dispatch({ type: "Clear" });
    } else if (key === ".") {
      dispatch({ type: ".", key });
    } else if (key === "Enter") {
      dispatch({ type: "Enter" });
    } else if (key === "Backspace") {
      dispatch({ type: "Backspace" });
    } else if (key === "+") {
      dispatch({ type: "Op", operation: add });
    } else if (key === "-") {
      dispatch({ type: "Op", operation: subtract });
    } else if (key === "*") {
      dispatch({ type: "Op", operation: multiply });
    } else if (key === "/") {
      dispatch({ type: "Op", operation: divide });
    }
  };

  const l = stack.length;
  const t = formatNum(stack[l - 3]);
  const z = formatNum(stack[l - 2]);
  const y = formatNum(stack[l - 1]);
  const x = inputing ? `${value}` : formatNum(parseFloat(value));

  return (
    <main id="main">
      <div>
        <input
          type="text"
          value={x}
          onKeyUp={handleKey}
          onChange={handleChange}
          autoFocus
        />
        {/* <div>inputing: {inputing ? "true" : "false"}</div> */}
        {/* <div>value: {value}</div> */}
      </div>
      <ul>
        <li>T: {t}</li>
        <li>Z: {z}</li>
        <li>Y: {y}</li>
      </ul>
    </main>
  );
}

function formatNum(n: number | undefined): string {
  const num = n ?? 0;
  const opts = { minimumFractionDigits: 2, maximumFractionDigits: 4 };
  return num.toLocaleString("en", opts);
}

function isNumeric(n: string): boolean {
  return !isNaN(parseInt(n));
}

export default Calc;
