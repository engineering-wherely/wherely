import { observer } from "mobx-react";

export const Todo = observer(({ todo }) => (
  <li>
    <input
      type="checkbox"
      checked={todo.finished}
      onChange={() => todo.toggle()}
    />
  </li>
));
