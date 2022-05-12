import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../../shared/errors/AppError";

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

interface IStatement extends ICreateUserDTO {
  id?: string;
}

let createdUser: IStatement;

describe("CreateStatementUseCase", () => {
  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    createdUser = await createUserUseCase.execute({
      email: "email@test.com",
      name: "name test",
      password: "password test"
    })
  })

  it("Should be able to make a statement of a deposit", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id!,
      amount: 500,
      description: "statement teste",
      type: "deposit"
    })

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toBe(500);
  })

  it("Should be able to make a statement of a withdraw", async () => {
    await createStatementUseCase.execute({
      user_id: createdUser.id!,
      amount: 500,
      description: "statement teste",
      type: "deposit"
    })

    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id!,
      amount: 500,
      description: "statement teste",
      type: "withdraw"
    })

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toBe(500);
  })

  it("Should not be able to make a statement of a withdraw with insufficient funds", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: createdUser.id!,
        amount: 499,
        description: "statement teste",
        type: "deposit"
      })

      await createStatementUseCase.execute({
        user_id: createdUser.id!,
        amount: 500,
        description: "statement teste",
        type: "withdraw"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to make a statement of a non-existent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "id-teste-123",
        amount: 499,
        description: "statement teste",
        type: "deposit"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
