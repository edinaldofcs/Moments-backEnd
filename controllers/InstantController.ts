"use strict";

import { db as firebase } from "../db/db";
import { Request, Response } from "express";

const checkToken = require("../helper/checkToken");
const Instant = require("../models/Instant");
const firestore = firebase.firestore();

export interface instantProps {
  id: string | "";
  title: string;
  author: string;
  description: string;
  image: string;
  like: number;
}

module.exports = class InstantController {

  static async listAllCollections(req: Request, res: Response) {
    const admin = require("firebase-admin");
    const db = admin.firestore();
    const collections = await db.listCollections();
    const rooms: string[] = [];

    collections.forEach((collection: any) => {
      rooms.push(collection["_queryOptions"].collectionId);
    });

    res.status(200).json({ rooms });
  }

  static async listAll(req: Request, res: Response) {
    const { collection } = req.params;

    try {
      const instants = await firestore.collection(collection);
      const data = await instants.get();
      const momentArray: instantProps[] = [];
      if (!data) {
        return res.status(404).json({ message: "No instants found" });
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
      res.status(200).json(momentArray);
    } catch (error) {
      res.status(400).json({ message: "Não foi possível obter as mensagens" });
    }
  }
  static async insert(req: Request, res: Response) {
    const user = await checkToken(req);
    const { collection } = req.params;

    if (!user) {
      return res.json({ message: "Usuário inválido" });
    }

    const { title, image, description } = req.body;
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
      res.status(201).json({ message: "erro " + error });
    }
  }

  static async updateInstant(req: Request, res: Response) {
    const user = await checkToken(req);
    const { collection } = req.params;  
    
    if (!user) {
      return res.json({ message: "Usuário inválido" });
    }

    try {
      const { id } = req.params;
      const data = req.body;
      const instant = await firestore.collection(collection).doc(id);
      await instant.update(data);
      res.status(200).json("Momento Atualizado com sucesso!!");
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async addLike(req: Request, res: Response) {
    
    const user = await checkToken(req);
    const { collection } = req.params;

    if (!user) {
      return res.json({ message: "Usuário inválido" });
    }

    try {
      const { id } = req.params;
      const instant = await firestore.collection(collection).doc(id);
      const updateInstant = await instant.get();
      const likes = Number(updateInstant.data().like) + 1;
      await instant.update({
        like: likes,
      });
      res.status(200).json("Like Adicionado");
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async deleteInstant(req: Request, res: Response) {
    const user = await checkToken(req);
    const { collection } = req.params;

    if (!user) {
      return res.json({ message: "Usuário inválido" });
    }

    try {
      const { id } = req.params;
      const instant = await firestore.collection(collection).doc(id);
      const myDoc = await instant.get();
      if (!myDoc.exists) {
        return res.status(404).json({ message: "Mensagem não encontrada" });
      }
      await instant.delete();
      res.status(200).json({ message: "Momento excluido com sucesso" });
    } catch (error) {
      res.status(400).send(error);
    }
  }
};
