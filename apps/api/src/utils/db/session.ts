import { prismaSingleton, type SessionType } from "@repo/db/config";

export const createSession = async (data: SessionType) => {
  const session = await prismaSingleton.session.create({
    data,
  });

  return session;
};

interface sessionUpdateType {
  device_token?: string;
  ip_address?: string;
  refresh_token?: string;
  user_agent?: string;
  expires_at?: Date;
}
interface UpdateSessionParams {
  user_id: string;
  data: sessionUpdateType;
}

export const updateSession = async ({ user_id, data }: UpdateSessionParams) => {
  const session = await prismaSingleton.session.update({
    where: {
      user_id,
    },
    data,
  });
  return session;
};
