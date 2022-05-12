import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let showUserProfileUserCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

interface IUser extends ICreateUserDTO {
  id?: string;
}

let createdUser: IUser;

describe("ShowUserProfileUseCase", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUserCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createdUser = await createUserUseCase.execute({
      email: "email@test.com",
      name: "name test",
      password: "password test"
    });
  })

  it("Should be able to view user profile", async () => {
    const userProfile = await showUserProfileUserCase.execute(createdUser.id!);

    expect(userProfile).toHaveProperty("id");
  })

  it("Should not be able to view user profile from nonexistent user", () => {
    expect(async () => {
      await showUserProfileUserCase.execute("id-teste-123");
    }).rejects.toBeInstanceOf(AppError)
  })
})
