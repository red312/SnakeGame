import { Component, createEffect } from 'solid-js'
import { onMount, onCleanup } from "solid-js";
import { createSignal } from "solid-js";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import styles from '../styles/Game.module.css'

type Point = {
    x: number
    y: number
}

type Snakes = {
    red: Point[]
    black: Point[]
    redStep: Point
    blackStep: Point
}


function drawFruit(point: Point, context: CanvasRenderingContext2D): void {
    context.fillRect(point.x, point.y, 1, 1)
}

function drawSnake(snake: Point[], context: CanvasRenderingContext2D, color: string): void {
    snake.forEach((point) => {
        if (color === 'black') {
            context.fillStyle = 'black'
        } else context.fillStyle = 'red'
        context.fillRect(point.x, point.y, 1, 1)
    })
}

function moveSnake(snake: Point[], context: CanvasRenderingContext2D, step: Point, eaten: boolean): Point[] {
    const next: Point = {
        x: (snake[0].x + step.x) === 0 ? 99 : (snake[0].x + step.x) % 100,
        y: (snake[0].y + step.y) === 0 ? 99 : (snake[0].y + step.y) % 100,
    }
    if (!eaten) {
        let del: Point = snake.pop()!
        context.clearRect(del!.x, del!.y, 1, 1)
    }
    return [next, ...snake]
}


function changeDirection(key: string, step: Point, keys: string[]): Point {
    switch(key) {
        case(keys[0]): { //d
            return step.x === -1 ? step : {x: 1, y: 0}
        }
        case(keys[1]): { // a
            return step.x === 1 ? step : {x: -1, y: 0}
        }
        case(keys[2]): { //s
            return step.y === -1 ? step : {x: 0, y: 1}
        }
        case(keys[3]): { //w
            return step.y === 1 ? step : {x: 0, y: -1}
        }
        default: {
            return {x: step.x, y: step.y}
        }
    }
}

const Game: Component = () => {
    let canvas
    const event = useKeyDownEvent();
    const startFruit: Point = {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100)
    }

    const redKeys: string[] = ['d', 'a', 's', 'w']
    const snakesStart: Snakes = {
        red: [ {x: 23, y: 50}, {x: 22, y: 50}, {x: 21, y: 50}, {x: 20, y: 50}, ],
        black: [ {x: 77, y: 50}, {x: 78, y: 50}, {x: 79, y: 50}, {x: 80, y: 50}, ],
        redStep: { x: 1, y: 0 },
        blackStep: { x: -1, y: 0}
    }

    const startEaten: Point = {
        x: 0,
        y: 0
    }

    const [eatenNumber, setEatenNumber] = createSignal(startEaten)
    const blackKeys: string[] = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp']

    const [snakes, setSnakes] = createSignal(snakesStart)
    const [fruit, setFruit] = createSignal(startFruit)

    let context: CanvasRenderingContext2D
    onMount(() => {
        context = canvas!.getContext('2d')
        context.scale(5, 5)
        drawFruit(fruit(), context)
    })
    createEffect(() => {
        const e = event();
        if (e) {
            if (redKeys.indexOf(e.key) !== -1)
            {   
                setSnakes(snakes => {return {red: snakes.red,
                    black: snakes.black, 
                    redStep: changeDirection(e.key, snakes.redStep, redKeys),
                    blackStep: snakes.blackStep
                }})
            }
            if (blackKeys.indexOf(e.key) !== -1)
            {   
                setSnakes(snakes => {return {red: snakes.red,
                    black: snakes.black, 
                    blackStep: changeDirection(e.key, snakes.blackStep, blackKeys),
                    redStep: snakes.redStep
                }})
            }
        }
    })
    let eatenRed: boolean = false;
    let eatenBlack: boolean = false;
    let indexRed: number = 0
    let indexBlack: number = 0
    let timer = setTimeout(function normal() {
        setSnakes(value => {return {red:  moveSnake(value.red, context, value.redStep, eatenRed), black: moveSnake(value.black, context, value.blackStep, eatenBlack), redStep: value.redStep, blackStep: value.blackStep}})
        if (snakes().red[0].x === fruit().x && snakes().red[0].y === fruit().y) {
            indexRed = 5
            eatenRed = true
            setEatenNumber(value => {return {x: value.x + 5, y: value.y}})
            setFruit((value) => {return {x: Math.floor(Math.random() * 100),
                y: Math.floor(Math.random() * 100)}})
            drawFruit(fruit(), context)
        }
        if (snakes().black[0].x === fruit().x && snakes().black[0].y === fruit().y) {
            indexBlack = 5
            eatenBlack = true
            setEatenNumber(value => {return {x: value.x, y: value.y + 5}})
            setFruit((value) => {return {x: Math.floor(Math.random() * 100),
                y: Math.floor(Math.random() * 100)}})
            drawFruit(fruit(), context)
        }
        if (indexRed > 0) {
            indexRed--
        } else {eatenRed = false}
        if (indexBlack > 0) {
            indexBlack--
        } else {eatenBlack = false}
        timer = setTimeout(normal, 50)
    }, 50)

    createEffect(() => {
        drawSnake(snakes().red, context, 'red')
        drawSnake(snakes().black, context, 'black')
    })
    return (
        <div>
            <div>
                {eatenNumber().x} : {eatenNumber().y}
            </div>
            <canvas ref={canvas} class={styles.field} width="500" height="500"/>
        </div>
    )
}
export default () => <Game/>
