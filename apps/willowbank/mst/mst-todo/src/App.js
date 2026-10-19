import { observer } from "mobx-react-lite";
import { types } from "mobx-state-tree";

let id = 1;
const randomId = () => ++id;

const Todo = types
  .model({
    id: types.identifierNumber,
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false),
  })
  .actions((self) => {
    function setName(newName) {
      self.name = newName;
    }

    function toggle() {
      self.done = !self.done;
    }

    return { setName, toggle };
  });

const User = types.model({
  name: types.optional(types.string, ""),
});

const RootStore = types
  .model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {}),
  })
  .actions((self) => {
    function addTodo(id, name) {
      self.todos.set(id, Todo.create({ id, name }));
    }

    return { addTodo };
  });

const store = RootStore.create({
  users: {},
  todos: {
    1: {
      id: id,
      name: "Eat a cake",
      done: true,
    },
  },
});

const TodoView = observer((props) => (
  <div>
    <input
      type="checkbox"
      checked={props.todo.done}
      onChange={(e) => props.todo.toggle()}
    />
    <input
      type="text"
      value={props.todo.name}
      onChange={(e) => props.todo.setName(e.target.value)}
    />
  </div>
));

const AppInternal = observer((props) => (
  <div>
    <button onClick={(e) => props.store.addTodo(randomId(), "New Task")}>
      Add Task
    </button>
    {Array.from(props.store.todos.values()).map((todo) => (
      <TodoView key={todo.id} todo={todo} />
    ))}
  </div>
));

export default function App() {
  return <AppInternal store={store} />;
}
