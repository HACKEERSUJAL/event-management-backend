import bcrypt from "bcryptjs";

export const _hashPassword = async (password: string): Promise<string> => {
  const envRounds = process?.env?.BCRYPT_SALT_ROUNDS;
  const rounds: number = envRounds ? +envRounds : 10;
  const salt = await bcrypt.genSalt(rounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
export const _comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
