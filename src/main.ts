import "./style.css";
import {point} from "./model/position.ts";
import {Diagrama} from "./vistas/diagrama.ts";

const diagrama = new Diagrama();

const r1 = diagrama.agregarCajitaEn(point(10, 10));
const r2 = diagrama.agregarCajitaEn(point(150, 50));
diagrama.unir(r1, r2);
diagrama.agregarCajitaEn(point(300, 50));

document.body.appendChild(diagrama.elemento());


