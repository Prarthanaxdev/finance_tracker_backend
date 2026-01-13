import { UserRepository } from '../../repositories/UserRepository';
import { ValidationError, ConflictError, UnauthorizedError } from '../../utils/errors';

export class AuthDomainService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Validates user registration data
   */
  validateRegistrationData(email: string, password: string): void {
    if (!email || !password) {
      throw new ValidationError('Please provide email and password');
    }

    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }
  }

  /**
   * Validates login credentials data
   */
  validateLoginData(email: string, password: string): void {
    if (!email || !password) {
      throw new ValidationError('Please provide email and password');
    }
  }

  /**
   * Checks if user exists by email
   */
  async checkUserExists(email: string): Promise<boolean> {
    return await this.userRepository.exists(email);
  }

  /**
   * Creates a new user in the database
   */
  async createUser(email: string, password: string) {
    const userExists = await this.checkUserExists(email);
    if (userExists) {
      throw new ConflictError('User already exists with this email');
    }

    const user = await this.userRepository.create({ email, password });
    return user;
  }

  /**
   * Verifies user credentials and returns user if valid
   */
  async verifyCredentials(email: string, password: string) {
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return user;
  }
}
