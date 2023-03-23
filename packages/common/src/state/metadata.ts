import { TypedObjectNode } from '..';
import { StaticObjectNode } from "../staticObject";

export interface Metadata {
  titleUnicode: string;
  title: string;
  artistUnicode: string;
  artist: string;
  difficulty: string;
}

export class MetadataState extends TypedObjectNode<Metadata>() {
  constructor() {
    super({
      titleUnicode: "",
      title: "",
      artistUnicode: "",
      artist: "",
      difficulty: "",
    } as Metadata);
  }

}
