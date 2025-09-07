import "./style.css";
import {createSvgElement, makeDraggable} from "./dom.ts";
import {point, Position} from "./position.ts";

class TranslationEvent extends Event {
  static readonly eventName = "translate";
  public readonly oldPosition: Position;
  public readonly newPosition: Position;
  declare target: SVGElement;

  constructor(oldPosition: Position, newPosition: Position) {
    super(TranslationEvent.eventName, {bubbles: true, composed: true});
    this.oldPosition = oldPosition;
    this.newPosition = newPosition;
  }

}

type Edge = "top" | "bottom" | "left" | "right";


const diagram = createSvgElement("svg", {
  width: 900,
  height: 600,
});
// diagram.style.position = 'absolute';
// diagram.style.top = '0';

class Cajita {
  private _posicion: Position;
  private _elemento: SVGRectElement;
  private _ancho: number;
  private _alto: number;

  constructor(ancho: number, alto: number, posicion: Position) {
    this._ancho = ancho;
    this._alto = alto;
    this._posicion = posicion;
    this._elemento = createSvgElement("rect", {
      width: ancho,
      height: alto,
      stroke: "black",
      fill: "white",
    });
    this._actualizarPosicion();

    makeDraggable(this._elemento, pageGrabPosition => ({
      grabbedElement: this._elemento,
      onDrag: (cursorPosition, delta) => {
        this.position = this._posicion.plus(delta);
      },
    }));
  }

  get box() {
    return new Box(this._ancho, this._alto, this._posicion);
  }

  get x() {
    return this._posicion.x;
  }

  set x(n: number) {
    this.position = point(n, this._posicion.y);
  }

  get y() {
    return this._posicion.y;
  }

  set y(n: number) {
    this.position = point(this._posicion.x, n);
  }

  get position() {
    return this._posicion;
  }

  set position(newPosition: Position) {
    const oldPosition = this._posicion;
    this._posicion = newPosition;
    this._actualizarPosicion();
    this._elemento.dispatchEvent(new TranslationEvent(
      oldPosition, this._posicion,
    ));
  }

  elemento() {
    return this._elemento;
  }

  private _actualizarPosicion() {
    this._elemento.setAttribute("transform",
      `translate(${this._posicion.x}, ${this._posicion.y})`,
    );
  }
}

const cajitas: Map<SVGElement, Cajita> = new Map();

function agregarCajitaEn(unaPosicion: Position) {
  const cajita = new Cajita(120, 100, unaPosicion);
  cajitas.set(cajita.elemento(), cajita);
  diagram.appendChild(cajita.elemento());
  return cajita;
}

class Box {
  public readonly width: number;
  public readonly height: number;
  private readonly _position: Position;

  constructor(width: number, height: number, position: Position) {
    this.width = width;
    this.height = height;
    this._position = position;
  }

  get x() {
    return this._position.x;
  }

  get y() {
    return this._position.y;
  }

  get top() {
    return this._position.y;
  }

  get bottom() {
    return this._position.y + this.height;
  }

  get left() {
    return this._position.x;
  }

  get right() {
    return this._position.x + this.width;
  }

  get topLeft() {
    return this._position;
  }

  get topCenter() {
    return point(this._position.x + this.width / 2, this._position.y);
  }

  get topRight() {
    return point(this._position.x + this.width, this._position.y);
  }

  get bottomLeft() {
    return point(this._position.x, this._position.y + this.height);
  }

  get bottomCenter() {
    return point(this._position.x + this.width / 2, this._position.y + this.height);
  }

  get bottomRight() {
    return point(this._position.x + this.width, this._position.y + this.height);
  }

  get leftCenter() {
    return point(
      this._position.x,
      this._position.y + this.height / 2,
    );
  }

  get rightCenter() {
    return point(
      this._position.x + this.width,
      this._position.y + this.height / 2,
    );
  }

  get center() {
    return point(
      this._position.x + this.width / 2,
      this._position.y + this.height / 2,
    );
  }

  edgeHeading(aPoint: Position): Edge {
    const firstDiagonal = Line.between(this.topLeft, this.bottomRight);
    const secondDiagonal = Line.between(this.bottomLeft, this.topRight);
    const belowFirstDiagonal = firstDiagonal.yFor(aPoint.x) < aPoint.y;
    const belowSecondDiagonal = secondDiagonal.yFor(aPoint.x) < aPoint.y;

    if (belowFirstDiagonal && belowSecondDiagonal) return "bottom";
    if (belowFirstDiagonal && !belowSecondDiagonal) return "left";
    if (!belowFirstDiagonal && belowSecondDiagonal) return "right";
    if (!belowFirstDiagonal && !belowSecondDiagonal) return "top";

    throw new Error("The impossible happened");
  }

  centerAtEdge(edge: Edge) {
    switch (edge) {
      case "top":
        return this.topCenter;
      case "bottom":
        return this.bottomCenter;
      case "left":
        return this.leftCenter;
      case "right":
        return this.rightCenter;
    }
  }

  edgeLine(edge: Edge) {
    switch (edge) {
      case "top":
        return Line.horizontal(this.top);
      case "bottom":
        return Line.horizontal(this.bottom);
      case "left":
        return Line.vertical(this.left);
      case "right":
        return Line.vertical(this.right);
    }
  }
}

abstract class Line {
  static between(p1: Position, p2: Position) {
    if (p1.x == p2.x) return Line.vertical(p1.x);

    return new LineBetweenPoints(p1, p2);
  }

  static vertical(x: number) {
    return new VerticalLine(x);
  }

  static horizontal(y: number) {
    return new HorizontalLine(y);
  }

  abstract yFor(x: number): number

  abstract xFor(y: number): number

  abstract intersectionWith(anotherLine: Line): Position

  abstract intersectionWithLineBetweenPoints(anotherLine: LineBetweenPoints): Position
}

class LineBetweenPoints extends Line {
  private readonly _p: Position;
  private readonly _dx: number;
  private readonly _dy: number;

  constructor(p1: Position, p2: Position) {
    super();
    this._dy = p2.y - p1.y;
    this._dx = p2.x - p1.x;
    this._p = p1;
  }

  get slope() {
    return this._dy / this._dx;
  }

  yFor(x: number) {
    return this._dy / this._dx * (x - this._p.x) + this._p.y;
  }

  xFor(y: number) {
    return (y - this._p.y) * this._dx / this._dy + this._p.x;
  }

  intersectionWith(anotherLine: Line): Position {
    return anotherLine.intersectionWithLineBetweenPoints(this);
  }

  intersectionWithLineBetweenPoints(anotherLine: LineBetweenPoints): Position {
    const intersectionX = (this.slope * this._p.x - anotherLine.slope * anotherLine._p.x + anotherLine._p.y - this._p.y) / (this.slope - anotherLine.slope);
    return point(intersectionX, this.yFor(intersectionX));
  }
}

class HorizontalLine extends Line {
  private readonly _y: number;

  constructor(y: number) {
    super();
    this._y = y;
  }

  yFor(x: number) {
    return this._y;
  }

  xFor(y: number): never {
    throw new Error();
  }

  intersectionWith(anotherLine: Line): Position {
    return point(anotherLine.xFor(this._y), this._y);
  }

  intersectionWithLineBetweenPoints(anotherLine: LineBetweenPoints): Position {
    return this.intersectionWith(anotherLine);
  }
}

class VerticalLine extends Line {
  private readonly _x: number;

  constructor(x: number) {
    super();
    this._x = x;
  }

  yFor(x: number): never {
    throw new Error();
  }

  xFor(y: number) {
    return this._x;
  }

  intersectionWith(anotherLine: Line): Position {
    return point(this._x, anotherLine.yFor(this._x));
  }

  intersectionWithLineBetweenPoints(anotherLine: LineBetweenPoints): Position {
    return this.intersectionWith(anotherLine);
  }
}

/*
x: number;
y: number;
readonly bottom: number;
readonly height: number;
readonly left: number;
readonly right: number;
readonly top: number;
readonly width: number;
readonly x: number;
readonly y: number;
toJSON(): any;
 */

function aabbHitDetection(rect1: Box, rect2: Box): { delta: Position } | null {
  const overlapX = Math.min(rect1.right - rect2.left, rect2.right - rect1.left);
  const overlapY = Math.min(rect1.bottom - rect2.top, rect2.bottom - rect1.top);

  if (overlapX <= 0 || overlapY <= 0) {
    return null;
  }

  let deltaX = 0;
  let deltaY = 0;

  if (overlapX < overlapY) {
    // Separate horizontally
    const rect1CenterX = rect1.center.x;
    const rect2CenterX = rect2.center.x;

    if (rect1CenterX < rect2CenterX) {
      // Move rect1 to the left
      deltaX = -overlapX;
    } else {
      // Move rect1 to the right
      deltaX = overlapX;
    }
  } else {
    // Separate vertically
    const rect1CenterY = rect1.center.y;
    const rect2CenterY = rect2.center.y;

    if (rect1CenterY < rect2CenterY) {
      // Move rect1 up
      deltaY = -overlapY;
    } else {
      // Move rect1 down
      deltaY = overlapY;
    }
  }

  return {
    delta: point(deltaX, deltaY),
  };
}

// @ts-ignore
diagram.addEventListener(TranslationEvent.eventName, (event: TranslationEvent) => {
  for (const [elemento, cajita] of cajitas) {
    if (elemento === event.target) continue;

    const cajita1 = cajitas.get(elemento)!;
    const cajita2 = cajitas.get(event.target)!;

    const hit = aabbHitDetection(
      cajita1.box,
      cajita2.box,
    );

    if (hit === null) continue;

    if (hit.delta.x !== 0) cajita.x += hit.delta.x;
    if (hit.delta.y !== 0) cajita.y += hit.delta.y;
  }

});

function addLineJoining(c1: Cajita, c2: Cajita) {
  const r1 = c1.elemento();
  const r2 = c2.elemento();
  r1.addEventListener("translate", update);
  r2.addEventListener("translate", update);
  const lineElement = createSvgElement("line");
  update();

  function update() {
    const box1 = c1.box;
    const box2 = c2.box;
    const lineBetweenCenters = Line.between(box1.center, box2.center);

    const p1 = box1.centerAtEdge(box1.edgeHeading(box2.center));
    const p2 = box2.edgeLine(box2.edgeHeading(box1.center))
      .intersectionWith(lineBetweenCenters);
    lineElement.setAttribute("x1", String(p1.x));
    lineElement.setAttribute("y1", String(p1.y));
    lineElement.setAttribute("x2", String(p2.x));
    lineElement.setAttribute("y2", String(p2.y));
  }

  diagram.append(lineElement);
}

const r1 = agregarCajitaEn(point(10, 10));
const r2 = agregarCajitaEn(point(150, 50));
agregarCajitaEn(point(300, 50));

document.body.appendChild(diagram);
addLineJoining(r1, r2);


