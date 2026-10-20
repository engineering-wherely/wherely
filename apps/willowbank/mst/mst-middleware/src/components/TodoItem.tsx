import { observer } from "mobx-react";
import { Todo } from "../models/TodoStore";
import type { Instance } from "mobx-state-tree";

export const TodoItem = observer(
  ({ todo }: { todo: Instance<typeof Todo> }) => (
    <li>
      <input
        type="checkbox"
        checked={todo.finished}
        onChange={() => todo.toggle()}
      />
      {todo.title}
    </li>
  ),
);
