import { auth, firestore } from 'firebase-admin';
import { User, UserWithoutID } from '../types/User';

const db = firestore();
db.settings({ ignoreUndefinedProperties: true });

export class UserExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists.`);
  }
}

export class UserDoesNotExistError extends Error {
  constructor(uid: string) {
    super(`User with UID ${uid} does not exist.`);
  }
}

export const createUser = async (user: UserWithoutID): Promise<User> => {
  try {
    console.debug(user);
    // if (await auth().getUserByEmail(user.email)) {
    //   throw new UserExistsError(user.email);
    // }

    const newUser = await auth().createUser({
      uid: user.ticketSlug,
      email: user.email,
      emailVerified: true,
      displayName: user.fullName,
      phoneNumber: user.phoneNumber,
    });

    await db
      .collection('users')
      .doc(newUser.uid)
      .set({
        ...user,
        uid: newUser.uid,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      });

    return {
      ...user,
      uid: newUser.uid,
      email: newUser.email as string,
      phoneNumber: newUser.phoneNumber as string,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getUser = async (uid: string): Promise<User> => {
  try {
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists || !userDoc.data) {
      throw new UserDoesNotExistError(uid);
    }

    const user = (userDoc.data as unknown) as User;

    return user;
  } catch (e) {
    throw e;
  }
};

export const updateUser = async (uid: string, partialUser: Partial<User>): Promise<User> => {
  try {
    const userDoc = db.collection('users').doc(uid);

    if (!(await userDoc.get()).exists) {
      throw new UserDoesNotExistError(uid);
    }

    await userDoc.update(partialUser);

    const updatedUser = ((await userDoc.get()).data() as unknown) as User;

    return updatedUser;
  } catch (e) {
    throw e;
  }
};
