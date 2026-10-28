import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { TaskButton } from './TaskButton'

test("calls onToggle when the task is completed", async () => {
  const user = userEvent.setup()
  const onToggle = vi.fn();
  render(
    <TaskButton completed={false} onToggle={onToggle}/>
  )

  const button = screen.getByRole('button', { name: "Complete Task" })

  await user.click(button)

  expect(onToggle).toHaveBeenCalledOnce()
})