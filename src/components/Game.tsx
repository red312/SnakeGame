import { Component, Show, batch, createEffect } from 'solid-js'
import { onMount, onCleanup } from "solid-js";
import { createSignal } from "solid-js";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import styles from '../styles/Game.module.css'

type Point = {
    x: number
    y: number
}

enum EColor {
    black, red
}

type Snake = {
    body: Point[]
    step: Point
    eaten: number
    color: EColor
    keys: string[]
}


function updateFruit(context: CanvasRenderingContext2D): Point {
    const point: Point = {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100)
    }
    context.fillRect(point.x, point.y, 1, 1)
    return point
}

function drawSnake(snake: Snake, context: CanvasRenderingContext2D): void {
    snake.body.forEach((point, index) => {
        if (index == 0) {
            if (snake.color == EColor.red)
                context.fillStyle = 'black'
            else context.fillStyle = 'red'
        } 
        else if (snake.color === EColor.black) {
            context.fillStyle = 'black'
        } else context.fillStyle = 'red'
        context.fillRect(point.x, point.y, 1, 1)
    })
}

function moveSnake(snake: Snake, context: CanvasRenderingContext2D): Snake {
    const next: Point = {
        x: (snake.body[0].x + snake.step.x) === -1 ? 100 : (snake.body[0].x + snake.step.x) % 100,
        y: (snake.body[0].y + snake.step.y) === -1 ? 100 : (snake.body[0].y + snake.step.y) % 100,
    }
    if (snake.eaten == 0) {
        let del: Point = snake.body.pop()!
        context.clearRect(del.x, del.y, 1, 1)
    }
    else snake.eaten--
    snake.body = [next, ...snake.body]
    drawSnake(snake, context)
    return snake
}


function changeDirection(snake: Snake, key: string): Snake {
    switch(key) {
        case(snake.keys[0]): { //d
            snake.step = snake.step.x === -1 ? snake.step : {x: 1, y: 0}
            break
        }
        case(snake.keys[1]): { // a
            snake.step = snake.step.x === 1 ? snake.step : {x: -1, y: 0}
            break
        }
        case(snake.keys[2]): { //s
            snake.step = snake.step.y === -1 ? snake.step : {x: 0, y: 1}
            break
        }
        case(snake.keys[3]): { //w
            snake.step =  snake.step.y === 1 ? snake.step : {x: 0, y: -1}
            break
        }
    }
    return snake
}

function snakeEat(snake: Snake): Snake {
    snake.eaten = 5
    return snake
}

const Game: Component = () => {
    let canvas
    const event = useKeyDownEvent();
    const startFruit: Point = {
        x: 0,
        y: 0
    }
    const counter: Point = {
        x: 0,
        y: 0
    }
    const [eaten, setEaten] = createSignal(counter)
    const snakeRedStart: Snake = {
        body: [ {x: 24, y: 50}, {x: 23, y: 50}, {x: 22, y: 50}, {x: 21, y: 50}, {x: 20, y: 50} ],
        step: { x: 1, y: 0 },
        eaten: 0,
        color: EColor.red,
        keys: ['d', 'a', 's', 'w'],
    }
    const snakeBlackStart: Snake = {
        body: [ {x: 76, y: 50}, {x: 77, y: 50}, {x: 78, y: 50}, {x: 79, y: 50}, {x: 80, y: 50} ],
        step: { x: -1, y: 0 },
        eaten: 0,
        color: EColor.black,
        keys: ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'],
    }

    const [snakeRed, setSnakeRed] = createSignal(snakeRedStart)
    const [snakeBlack, setSnakeBlack] = createSignal(snakeBlackStart)

    const [fruit, setFruit] = createSignal(startFruit)

    let context: CanvasRenderingContext2D
    onMount(() => {
        context = canvas!.getContext('2d')
        context.scale(5, 5)
        setFruit(() => updateFruit(context))
    })
    createEffect(() => {
        const e = event();
        if (e) {
                if (snakeRed().keys.indexOf(e.key) !== -1) {   
                    setSnakeRed(snake => changeDirection(snake, e.key))
                    }   
                if (snakeBlack().keys.indexOf(e.key) !== -1) {   
                    setSnakeBlack(snake => changeDirection(snake, e.key))
                    }
                }  
        }
    )
    const timer = setInterval(() => {
        setSnakeRed(snake => moveSnake(snake, context))
        setSnakeBlack(snake => moveSnake(snake, context))
        if (snakeRed().body[0].x === fruit().x && snakeRed().body[0].y === fruit().y) {
            setSnakeRed(snake => snakeEat(snake))
            setEaten(() => {return {x: eaten().x + 5, y: eaten().y}})
            setFruit(() => updateFruit(context))
        }
        if (snakeBlack().body[0].x === fruit().x && snakeBlack().body[0].y === fruit().y) {
            setSnakeBlack(snake => snakeEat(snake))
            setEaten(() => {return {x: eaten().x, y: eaten().y + 5}})
            setFruit(() => updateFruit(context))
        }
    }, 50)
    onCleanup(() => clearInterval(timer))
    return (
        <div>
            <h1 class={styles.name}>
                SNAKOW
            </h1>
            <div class={styles.counter}>
                <div>
                    <span style="color:red">{ eaten().x }</span> : <span>{ eaten().y }</span>
                </div>
            </div>
            <canvas ref={canvas} class={styles.field} width="500" height="500"/>
        </div>
    )
}
export default () => <Game/>
