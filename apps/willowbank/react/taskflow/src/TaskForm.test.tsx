import userEvent from "@testing-library/user-event"
import { test, expect } from 'vitest'
import {render, screen} from '@testing-library/react'
import { TaskForm } from "./TaskForm"

test("update the task title", async () => {
  const user = userEvent.setup()

  render(<TaskForm />)

  const input = screen.getByLabelText("Task title")

  await user.type(input, "Write unit tests")

  expect(screen.getByText("Write unit tests")).toBeTruthy()
})