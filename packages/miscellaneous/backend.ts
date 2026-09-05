import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
