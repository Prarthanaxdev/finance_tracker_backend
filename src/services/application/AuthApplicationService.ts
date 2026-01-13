import jwt from 'jsonwebtoken';
import { JWTPayload } from '@auth/types';
import { AuthDomainService } from '@services/domain/AuthDomainService';

export class AuthApplicationService {
  private authDomainService: AuthDomainService;

  constructor() {
    this.authDomainService = new AuthDomainService();
  }

  /**
   * Generates JWT token for user
   */
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId } as JWTPayload, process.env.JWT_SECRET as string, {
      expiresIn: '2d',
    });
  }

  /**
   * user registration workflow
   * 1. Validate data
   * 2. Create user (domain logic)
   * 3. Generate token (application concern)
   * 4. Return formatted response
   */
  async registerUser(email: string, password: string) {
    this.authDomainService.validateRegistrationData(email, password);

    const user = await this.authDomainService.createUser(email, password);

    const token = this.generateToken(user._id.toString());

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token,
    };
  }

  /**
   * login workflow
   * 1. Validate data
   * 2. Verify credentials (domain logic)
   * 3. Generate token (application concern)
   * 4. Return formatted response
   */
  async loginUser(email: string, password: string) {
    this.authDomainService.validateLoginData(email, password);
    const user = await this.authDomainService.verifyCredentials(email, password);
    const token = this.generateToken(user._id.toString());
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token,
    };
  }
}
