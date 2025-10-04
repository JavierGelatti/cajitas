import "./style.css";
import {vector} from "./model/vector2D.ts";
import {Diagrama} from "./vistas/diagrama.ts";

const diagrama = new Diagrama();

const r1 = diagrama.agregarCajitaEn(vector(10, 10));
const r2 = diagrama.agregarCajitaEn(vector(150, 50));
diagrama.unir(r1, r2);
diagrama.agregarCajitaEn(vector(300, 50));

document.body.appendChild(diagrama.elemento());


