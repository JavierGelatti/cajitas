import {Cajita} from "./cajita.ts";
import {createSvgElement} from "./basics/dom.ts";
import {Vector2D} from "../model/vector2D.ts";
import type {TranslationEvent} from "../model/events/translationEvent.ts";
import {Flechita} from "./flechita.ts";

export class Diagrama {
    private readonly _elemento: SVGSVGElement;
    private readonly _cajitas: Cajita[] = [];

    constructor() {
        this._elemento = createSvgElement("svg", {
            width: 900,
            height: 600,
        });
    }

    elemento() {
        return this._elemento;
    }

    agregarCajitaEn(unaPosicion: Vector2D) {
        const cajita = new Cajita(120, 100, unaPosicion);
        cajita.alMoverse(event => this._alMoverseUnaCajita(event));

        this._cajitas.push(cajita);
        this._elemento.appendChild(cajita.elemento());

        return cajita;
    }

    private _alMoverseUnaCajita(event: TranslationEvent) {
        const laCajaQueSeMovió = event.target;
        this._cajitas.forEach(cajita => {
            cajita.moverseSiChocóCon(laCajaQueSeMovió);
        });
    }

    unir(c1: Cajita, c2: Cajita) {
        const flechita = new Flechita(c1, c2);

        this._elemento.append(flechita.elemento());
    }
}
