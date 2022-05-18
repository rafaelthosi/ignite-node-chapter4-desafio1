import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../../shared/errors/AppError";

let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

interface IStatement extends ICreateUserDTO {
  id?: string;
}

let createdUser: IStatement;

describe("GetBalanceUseCase", () => {
  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    createdUser = await createUserUseCase.execute({
      email: "email@test.com",
      name: "name test",
      password: "password test"
    })
  })

  it("Should be able to get the user's balance", async () => {
    await createStatementUseCase.execute({
      user_id: createdUser.id!,
      amount: 500,
      description: "statement teste",
      type: "deposit"
    })

    await createStatementUseCase.execute({
      user_id: createdUser.id!,
      amount: 450,
      description: "statement teste",
      type: "withdraw"
    })

    const balance = await getBalanceUseCase.execute({
      user_id: createdUser.id!
    })

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
    expect(balance.statement).toHaveLength(2);
    expect(balance.balance).toEqual(50);
  })
})
