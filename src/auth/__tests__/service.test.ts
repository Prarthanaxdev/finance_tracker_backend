import { registerUser, loginUser } from '../../services/index';
import { ValidationError } from '@utils/errors';


jest.mock('jsonwebtoken');

/* -------------------------------------------------------------------------- */

// JWT secret for tests
process.env.JWT_SECRET = 'test-secret';

describe('Auth Service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  /* ------------------------------------------------------------------------ */
  /*                              REGISTER USER                               */
  /* ------------------------------------------------------------------------ */

  describe('registerUser', () => {
    test('should throw ValidationError if email or password is missing', async () => {
      await expect(registerUser('', 'password')).rejects.toThrow(ValidationError);
      await expect(registerUser('test@example.com', '')).rejects.toThrow(ValidationError);
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                                LOGIN USER                                */
  /* ------------------------------------------------------------------------ */

  describe('loginUser', () => {
    test('should throw ValidationError if email or password is missing', async () => {
      await expect(loginUser('', 'password')).rejects.toThrow(ValidationError);
      await expect(loginUser('test@example.com', '')).rejects.toThrow(ValidationError);
    });
  });
});
