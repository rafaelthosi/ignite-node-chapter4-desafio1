import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AppError } from "../../../../shared/errors/AppError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

let createdUser: ICreateUserDTO

describe("AuthenticateUserUseCase", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    createdUser = await createUserUseCase.execute({
      email: "email@test.com",
      name: "name test",
      password: "password test"
    })
  })

  it("Should be able to authenticate an user", async () => {
    const authenticateUser = await authenticateUserUseCase.execute({
      email: createdUser.email,
      password: "password test"
    })

    expect(authenticateUser).toHaveProperty("token")
  })

  it("Should not be able to authenticate a non-existing user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "teste@teste.com",
        password: "password test"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
