const { admin } = require("../config/firebase-admin");
import { Request } from "express";

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const checkToken = async (req: Request) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return null;

  try {
    const decodedValue = await admin.auth().verifyIdToken(token);
    if (decodedValue) {
      const user: User = {
        name: decodedValue.name,
        email: decodedValue.email,
        picture: decodedValue.picture,
        id: decodedValue.uid,
      };

      return user;
    }
  } catch (error) {
    return null;
  }
};
