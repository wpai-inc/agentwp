import AwpClient from '@/Services/AwpClient';

export default function useAwpClient(
  token?: string,
) {
  let tokenToUse;
  if (token) {
    tokenToUse = token;
  }
  return new AwpClient(tokenToUse);
}
