import { signIn } from '../googleSignIn';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    signOut: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
  statusCodes: {
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

describe('Google Sign-In', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sign in successfully and navigate to /menu', async () => {
    const mockUserInfo = { data: { id: '123', email: 'test@example.com' } };

    (GoogleSignin.signIn as jest.Mock).mockResolvedValue(mockUserInfo);

    await signIn();

    expect(GoogleSignin.signOut).toHaveBeenCalled();
    expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
    expect(GoogleSignin.signIn).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/application');
  });

  it('should handle sign-in in progress error', async () => {
    const error = { code: statusCodes.IN_PROGRESS };

    (GoogleSignin.signIn as jest.Mock).mockResolvedValue(error);

    console.log = jest.fn();
    await signIn();

    expect(console.log).toHaveBeenCalledWith(error);
  });

  it('should handle play services not available error', async () => {
    const error = { code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE };

    (GoogleSignin.signIn as jest.Mock).mockResolvedValue(error);

    console.log = jest.fn();

    await signIn();

    expect(console.log).toHaveBeenCalledWith(error);
  });

  it('should handle unknown errors gracefully', async () => {
    const error = new Error('Unknown error');

    (GoogleSignin.signIn as jest.Mock).mockResolvedValue(error);

    console.log = jest.fn();

    await signIn();

    expect(console.log).toHaveBeenCalledWith(error);
  });

  it('should log the correct error message for known status codes', async () => {
    const error = { code: statusCodes.IN_PROGRESS };
  
    (GoogleSignin.signIn as jest.Mock).mockRejectedValue(error);
  
    console.log = jest.fn();
  
    await signIn();
  
    expect(console.log).toHaveBeenCalledWith('Sign in error:', error);
    expect(console.log).toHaveBeenCalledWith('Sign-in already in progress.');
  });
  
});
