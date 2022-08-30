"use strict";
import { db as firebase } from "../db/db";
import { Request, Response } from "express";
import { checkToken, User } from "../helper/checkToken";
import { Instant } from "../models/Instant";

const firestore = firebase.firestore();

export interface instantProps {
  id: string | "";
  title: string;
  author: string;
  description: string;
  image: string;
  like: number;
}

export class InstantController {
  static async listAllCollections(req: Request, res: Response) {
    const admin = require("firebase-admin");
    const db = admin.firestore();
    const collections = await db.listCollections();
    const rooms: string[] = [];

    collections.forEach((collection: any) => {
      rooms.push(collection["_queryOptions"].collectionId);
    });

    if (rooms.length == 0) {
      return res.status(404).json({ erro: "Nenhuma Sala encontrada" });
    }
    return res.status(200).json({ rooms });
  }

  static async listAll(req: Request, res: Response) {
    const { collection } = req.params;

    try {
      const instants = await firestore.collection(collection);
      const data = await instants.get();
      const momentArray: instantProps[] = [];

      if (data.empty) {
        return res.status(404).json({ erro: "Nenhuma Sala encontrada" });
      }

      data.forEach(
        (doc: {
          id: string | "";
          data(): {
            title: string;
            author: string;
            description: string;
            image: string;
            like: number | 0;
          };
        }) => {
          const { title, author, description, image, like } = doc.data();
          let instant: instantProps = new Instant(
            doc.id,
            title,
            author,
            description,
            image,
            like
          );
          momentArray.push(instant);
        }
      );
      return res.status(200).json(momentArray);
    } catch (error) {
      return res.status(504).json({
        erro: "Não foi possível obter as mensagens. Tente novamente dentro de alguns minutos!",
      });
    }
  }

  static async insert(req: Request, res: Response) {
    const user: User | null | undefined = await checkToken(req);

    if (!user) {
      return res.status(403).json({ erro: "Acesso restrito!" });
    }

    const { collection } = req.params;
    const { title, image, description } = req.body;

    const erro: string[] = [];
    if (!title || title === "") erro.push("O titulo não pode estar em branco");
    if (!image || image === "") erro.push("A imagem não pode estar em branco");
    if (!description || description === "")
      erro.push("A descrição não pode estar em branco");

    if (erro.length > 0) {
      return res.status(422).json({ erro: erro });
    }

    const instant = new Instant("", title, user.name, description, image, 0);

    try {
      await firestore
        .collection(collection)
        .doc()
        .set({ ...instant });
      return res
        .status(200)
        .json({ message: "Momento registrado com sucesso!" });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Não foi possível registrar Seu post :(" });
    }
  }

  static async updateInstant(req: Request, res: Response) {
    const user: User | null | undefined = await checkToken(req);
    const { collection } = req.params;

    if (!user) {
      return res.status(403).json({ erro: "Acesso restrito!" });
    }

    const { id } = req.params;
    const { title, image, description } = req.body;
    const erro: string[] = [];
    if (title === "") erro.push("O titulo não pode estar em branco");
    if (image === "") erro.push("A imagem não pode estar em branco");
    if (description === "") erro.push("A descrição não pode estar em branco");

    if (erro.length > 0) {
      return res.status(422).json({ erro: erro });
    }

    try {
      const data = { title, image, description };
      const instant = await firestore.collection(collection).doc(id);
      await instant.update(data);
      return res
        .status(200)
        .json({ message: "Momento Atualizado com sucesso!!" });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Não foi possível atualizar seu post :(" });
    }
  }

  static async addLike(req: Request, res: Response) {
    const user: User | null | undefined = await checkToken(req);
    const { collection } = req.params;

    if (!user) {
      return res.status(403).json({ erro: "Acesso restrito!" });
    }

    try {
      const { id } = req.params;
      const instant = await firestore.collection(collection).doc(id);
      const updateInstant = await instant.get();
      const likes = Number(updateInstant.data().like) + 1;
      await instant.update({
        like: likes,
      });
      return res.status(200).json({ message: "Você curtiu este post!" });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Não foi possível deixar o seu like :(" });
    }
  }

  static async deleteInstant(req: Request, res: Response) {
    const user: User | null | undefined = await checkToken(req);
    const { collection } = req.params;

    if (!user) {
      return res.status(403).json({ erro: "Acesso restrito!" });
    }

    const { id } = req.params;
    const instant = await firestore.collection(collection).doc(id);
    const myDoc = await instant.get();
    if (!myDoc.exists) {
      return res.status(404).json({ erro: "Post não encontrado" });
    }

    try {
      await instant.delete();
      return res.status(200).json({ message: "Momento excluido com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Não foi possível excluir o seu post :(" });
    }
  }
}
