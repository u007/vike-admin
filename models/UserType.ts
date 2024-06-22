import type { PhotoURL } from '@prisma/client';

export type ACLUserType = {
  email?: string | null;
  firstName: string | null;
  lastName?: string | null;
  photoURL?: PhotoURL | null;
  country: string;
  username?: string | null;
};
