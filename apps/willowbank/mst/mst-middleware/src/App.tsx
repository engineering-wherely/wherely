import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { addMiddleware } from "mobx-state-tree";
import { TodoStore } from "./models/TodoStore";
import { TodoList } from "./components/TodoList";

const store = TodoStore.create({
  todos: [
    {
      title: "Get Coffee",
    },
    {
      title: "Write simpler code",
    },
  ],
});

const loggedActions = observable.array([] as any[], { deep: false });

addMiddleware(store, (call, next, abort) => {
  if (call.name === "toggle" && call.context.finished === true) {
    abort(undefined);
  } else if (call.name === "addTodo") {
    console.log("In middleware before modifying addTodo call!");
    next({ ...call, args: [call.args[0].toUpperCase()] });
    console.log("In middleware after modifying addTodo call!");
  } else {
    next(call);
  }
});

addMiddleware(store, (call, next) => {
  loggedActions.unshift({ name: call.name, args: call.args });
  next(call);
});

const Logger = observer(() => (
  <ul>
    {loggedActions.map((act, idx) => (
      <li key={idx}>
        <pre>{JSON.stringify(act, null, 2)}</pre>
      </li>
    ))}
  </ul>
));

export default function App() {
  return (
    <div>
      <h1>MST Middleware Demo</h1>
      Middleware in this app logs the actions invoked on the tree, prevents
      tasks from being marked unfinished and makes sure new Todo's are created
      with an uppercased title.
      <br />
      <TodoList todoStore={store} />
      <Logger />
    </div>
  );
}
