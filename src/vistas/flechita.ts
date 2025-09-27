import type {StraightConnector} from "../model/connector.ts";
import {Cajita} from "./cajita.ts";
import {createSvgElement} from "./basics/dom.ts";

export class Flechita {
    private readonly _elemento: SVGLineElement;
    private readonly _connector: StraightConnector;
    private _cajitaOrigen: Cajita;
    private _cajitaDestino: Cajita;

    constructor(cajitaOrigen: Cajita, cajitaDestino: Cajita) {
        this._cajitaOrigen = cajitaOrigen;
        this._cajitaDestino = cajitaDestino;
        this._connector = this._cajitaOrigen.box.straightConnectorTo(
            this._cajitaDestino.box,
            this._cajitaOrigen.box.nearestFixedAnchor(),
            this._cajitaDestino.box.nearestFixedAnchor(),
        );

        this._elemento = createSvgElement("line");
        this._connector.addEventListener("change", () => this._actualizar());
        this._actualizar();
    }

    elemento() {
        return this._elemento;
    }

    private _actualizar() {
        const p1 = this._connector.startPoint.round();
        const p2 = this._connector.endPoint.round();
        this._elemento.setAttribute("x1", String(p1.x));
        this._elemento.setAttribute("y1", String(p1.y));
        this._elemento.setAttribute("x2", String(p2.x));
        this._elemento.setAttribute("y2", String(p2.y));
    }
}
