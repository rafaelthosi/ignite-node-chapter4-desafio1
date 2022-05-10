import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to create an user", async () => {
    const user = await createUserUseCase.execute({
      email: "user@teste.com",
      name: "teste teste",
      password: "teste"
    } as ICreateUserDTO);

    expect(user).toHaveProperty("id");
  })

  it("Should not be able to create an existing user", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "user@teste.com",
        name: "teste teste",
        password: "teste"
      } as ICreateUserDTO);

      await createUserUseCase.execute({
        email: "user@teste.com",
        name: "teste teste",
        password: "teste"
      } as ICreateUserDTO)
    }).rejects.toBeInstanceOf(AppError)
  })

  // Não foi feito esta regra
  // it("Should not be able to create an user without required informations", () => {
  //   expect(async () => {
  //     await createUserUseCase.execute({
  //       email: "",
  //       name: "",
  //       password: ""
  //     } as ICreateUserDTO)
  //   }).rejects.toBeInstanceOf(AppError)
  // })
})
