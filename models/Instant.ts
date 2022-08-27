import { instantProps } from "@controller/InstantController";

class Instant {
  id: string | "";
  title: string;
  author: string;
  description: string;
  image: string;
  like: number;

  constructor(
    id: string | "",
    title: string,
    author: string,
    description: string,
    image: string,
    like: number    
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.description = description;
    this.image = image;
    this.like = like;
  }
}

module.exports = Instant;
