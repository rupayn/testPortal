interface Env {
  PORT: number;
  NODE_ENV: string;
}
export const envs: Env = {
  PORT: Number(process.env.PORT ?? "3001"),
  NODE_ENV: process.env.NODE_ENV ?? "development",
};
