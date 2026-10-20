import { action, observable } from "mobx";
import { observer } from "mobx-react";
import type { Instance } from "mobx-state-tree";
import * as React from "react";
import { TodoStore } from "../models/TodoStore";
import { TodoItem } from "./TodoItem";

@observer
export class TodoList extends React.Component<{
  todoStore: Instance<typeof TodoStore>;
}> {
  @observable accessor newTodoTitle = "";

  render() {
    const { todoStore } = this.props;
    return (
      <div>
        <input value={this.newTodoTitle} onChange={this.handleChange} />
        <button onClick={this.handleNewTodoClick}>Add</button>
        <ul>
          {todoStore.todos.map((todo) => (
            <TodoItem todo={todo} key={todo.id} />
          ))}
        </ul>
        Tasks left: {todoStore.unfinishedTodoCount}
      </div>
    );
  }

  @action
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.newTodoTitle = e.target.value;
  };

  @action
  handleNewTodoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    this.props.todoStore.addTodo(this.newTodoTitle);
    this.newTodoTitle = "";
  };
}
