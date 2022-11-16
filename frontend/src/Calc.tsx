import { KeyboardEventHandler, useReducer, useEffect } from "react";
import "./Calc.css";

type Action = {
  type: "Number" | "." | "Enter" | "Backspace" | "Op";
  key?: string;
  operation?: Function;
};

type State = number[];

function reducer(state: State, action: Action): State {
  const newState = [...state];
  const last = newState.length - 1;
  const key = action.key ?? "";

  // console.log(`state: [${state.join(",")}]`);
  // console.log(`action  type: ${action.type}  key: ${action.key}`);

  switch (action.type) {
    case "Number":
      newState[last] = parseFloat(newState[last] + key);
      break;
    case ".":
      newState[last] = parseFloat(newState[last] + key + "0");
      break;
    case "Op":
      const b = newState.pop() ?? 0;
      const a = newState.pop() ?? 0;
      if (action.operation) newState.push(action.operation(a, b));
      break;
    case "Backspace":
      const curValue = String(newState.pop() ?? "");
      newState.push(
        parseFloat(curValue.length > 1 ? curValue.slice(0, -1) : "0")
      );
      break;
    case "Enter":
      newState.push(0);
      break;
  }

  // console.log(`new: [${newState.join(",")}]`);
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
  const [stack, dispatch] = useReducer(reducer, [3, 2, 1]);
  const last = stack.length - 1;

  const handleKey = (e: KeyboardEvent) => {
    e.preventDefault();
    const key = e.key;
    // console.log({ e });

    if (isNumeric(key)) {
      dispatch({ type: "Number", key });
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

  useEffect(() => {
    document.addEventListener("keyup", handleKey, false);
    return () => {
      document.removeEventListener("keyup", handleKey, false);
    };
  }, []);

  // console.log({ stack });

  const t = formatNum(stack.at(-4));
  const z = formatNum(stack.at(-3));
  const y = formatNum(stack.at(-2));
  const v = formatNum(stack.at(-1));

  return (
    <main id="main">
      <ul>
        <li>T: {t}</li>
        <li>Z: {z}</li>
        <li>Y: {y}</li>
        <li>V: {v}</li>
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
