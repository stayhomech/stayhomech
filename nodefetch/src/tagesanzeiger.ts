import { TaMediaBase } from "./ta-media-base";

export class Tagesanzeiger extends TaMediaBase {
    constructor() {
        super('https://interaktiv.tagesanzeiger.ch/2020/zurich-liefert/');
    }
}