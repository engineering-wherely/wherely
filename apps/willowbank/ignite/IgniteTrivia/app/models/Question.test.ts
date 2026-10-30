import { QuestionModel } from "./Question"

test("can be created", () => {
  const instance = QuestionModel.create({
    id: "question-1",
    type: "multiple",
    difficulty: "easy",
  })

  expect(instance.id).toBe("question-1")
  expect(instance.type).toBe("multiple")
  expect(instance.difficulty).toBe("easy")
  expect(instance.incorrectAnswers).toHaveLength(0)
})
