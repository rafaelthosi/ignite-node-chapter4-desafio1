import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../../shared/errors/AppError";

let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
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
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)

    createdUser = await createUserUseCase.execute({
      email: "email@test.com",
      name: "name test",
      password: "password test"
    })
  })

  it("Should be able to get the information of a statement", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id!,
      amount: 500,
      description: "statement teste",
      type: "deposit"
    })

    const statementInformation = await getStatementOperationUseCase.execute({
      statement_id: statement.id!,
      user_id: createdUser.id!,
    })

    expect(statementInformation).toHaveProperty("id");
    expect(statementInformation).toHaveProperty("type");
    expect(statementInformation).toHaveProperty("amount");
    expect(statement.type).toBe("deposit");
    expect(statement.amount).toBe(500);
  })

  it("Should not be able to get the information of a statement if user doesn't exist", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id!,
      amount: 500,
      description: "statement teste",
      type: "deposit"
    })

    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: statement.id!,
        user_id: "12345-idteste-67890-teste",
      })
    }).rejects.toBeInstanceOf(AppError);
  })

  it("Should not be able to get the information of a non-existent statement", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: "12345-idteste-67890-teste",
        user_id: createdUser.id!,
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
