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
        x: (snake[0].x + step.x) == 0 ? 100 : (snake[0].x + step.x) % 100,
        y: (snake[0].y + step.y) == 0 ? 100 : (snake[0].y + step.y) % 100,
    }
    if (!eaten) {
        let del: Point = snake.pop()!
        context.clearRect(del!.x, del!.y, 1, 1)
    }
    return [next, ...snake]
}


function changeDirection(key: string, step: Point, keys: string[]): Point {
    console.log(1);
    
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
    const firstStepRed: Point = { x: 1, y: 0 }
    const snakeStartRed: Point[] = [ {x: 23, y: 50}, {x: 22, y: 50}, {x: 21, y: 50}, {x: 20, y: 50}, ]

    const blackKeys: string[] = ['right', 'left', 'down', 'up']
    const firstStepBlack: Point = { x: -1, y: 0 }
    const snakeStartBlack: Point[] = [ {x: 84, y: 50}, {x: 85, y: 50}, {x: 86, y: 50}, {x: 87, y: 50}, ]

    const [fruit, setFruit] = createSignal(startFruit)

    const [snakeRed, setSnakeRed] = createSignal(snakeStartRed)
    const [stepRed, setStepRed] = createSignal(firstStepRed)

    const [snakeBlack, setSnakeBlack] = createSignal(snakeStartBlack)
    const [stepBlack, setStepBlack] = createSignal(firstStepBlack)

    let context: CanvasRenderingContext2D
    onMount(() => {
        context = canvas!.getContext('2d')
        context.scale(5, 5)
        drawFruit(fruit(), context)
    })
    createEffect(() => {
        const e = event();
        console.log(2);
        
        if (e) {
                setStepRed(step => changeDirection(e.key, stepRed(), redKeys))
        }
    })
    let indexRed: number = 0;
    let eatenRed: boolean = false;
    let indexBlack: number = 0;
    let eatenBlack: boolean = false;
    let timer = setTimeout(function normal() {
        setSnakeRed(value => {return moveSnake(value, context, stepRed(), eatenRed)})
        // setSnakeBlack(value => {return moveSnake(value, context, stepBlack(), eatenBlack)})
        if (snakeRed()[0].x === fruit().x && snakeRed()[0].y === fruit().y) {            
            indexRed = 5
            setFruit((value) => {return {x: Math.floor(Math.random() * 100),
                y: Math.floor(Math.random() * 100)}})
            drawFruit(fruit(), context)
        } 
        if (indexRed > 0) {
            eatenRed = true
            indexRed--
        }
        else{ eatenRed = false
             indexRed = 0}
             if (snakeRed()[0].x === fruit().x && snakeRed()[0].y === fruit().y) {            
            indexRed = 5
            setFruit((value) => {return {x: Math.floor(Math.random() * 100),
                y: Math.floor(Math.random() * 100)}})
            drawFruit(fruit(), context)
        } 
        if (indexRed > 0) {
            eatenRed = true
            indexRed--
        }
        else{ eatenRed = false
             indexRed = 0}

        if (snakeBlack()[0].x === fruit().x && snakeBlack()[0].y === fruit().y) {            
                indexBlack = 5
                setFruit((value) => {return {x: Math.floor(Math.random() * 100),
                    y: Math.floor(Math.random() * 100)}})
                drawFruit(fruit(), context)
            } 
            if (indexBlack > 0) {
                eatenBlack = true
                indexBlack--
            }
            else{ eatenBlack = false
                 indexBlack = 0}
        timer = setTimeout(normal, 50)
    }, 50)

    createEffect(() => {
        drawSnake(snakeRed(), context, 'red')
        drawSnake(snakeBlack(), context, 'black')
    })
    return (
        <div>
            <canvas ref={canvas} class={styles.field} width="502" height="502"/>
        </div>
    )
}
export default () => <Game/>
