import dialogEngine, { ResponseEvent } from "./engine";
import tree2 from "./tree1.json";
const prompt = require("prompt");

prompt.start();

const displayHandler = (message: string): void => {
  console.log(message);
};

const inputHandler = (responses: ResponseEvent[], cb: any): void => {
  responses.forEach((r: ResponseEvent, i: number) => {
    console.log(`${i}: ${r.mes}`);
  });
  prompt.get("res", (err: any, results: any) => {
    if (results.res) {
      console.log("calling cb with", results.res);
      cb(results.res);
    } else if (err) {
      throw err;
    }
  });
};

const de = new dialogEngine({
  displayHandler: displayHandler,
  inputHandler: inputHandler,
});
de.loadTree(tree2);
de.startTree();
