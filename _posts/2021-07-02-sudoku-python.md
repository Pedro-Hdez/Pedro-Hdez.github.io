---
layout: post
title: Generador y solucionador de Sudokus
autor: pedro
portada: "../assets/images/portadas/python_proyecto_es.png"
image: assets/images/sudokupython/portada.jpg
categories: [Python, Inteligencia Artificial]
description: "Aplicación de consola para generar y resolver Sudokus."
beforetoc: "En este post se comentará el procedimiento que se siguió para programar el generador y
solucionador de Sudokus, también se explicará su código y aprenderás a usarlo."
toc: true
---

## Prerrequisitos

Para ejecutar el programa necesitas instalar Python en tu dispositivo. Puedes descargar los archivos 
necesarios desde su [sitio oficial](https://www.python.org/downloads/). Si utilizas alguna 
distribución de Linux es muy probable que Python ya se encuentre instalado, si es así, te 
recomiendo actualizarlo porque es probable que tengas una versión antigüa. 

Aquí unas [guías excelentes](https://realpython.com/installing-python/)
para la instalación de Python en cualquier sistema operativo.

Si deseas revisar el código fuente original, o bien, quieres ejecutar el programa, puedes encontrar 
el proyecto en este [repositorio de Github](https://github.com/Pedro-Hdez/sudoku-python).

## Breve Historia del Sudoku

El Sudoku tal y como lo conocemos hoy en día es un invento relativamente nuevo ¡Incluso es más joven que el cubo de Rubik!. Howard Garns, un inventor de rompecabezas estadounidense lo publicó en la revista de su mismo país titulada *Dell Pencill Puzzles & Word Games* en el año de 1979 bajo el nombre de *Number Place*.

Cinco años después, en 1984 el rompecabezas llega a Japón en donde obtuvo un gran recibimiento; ahí, la comunidad lo acogió con el nombre de **Sudoku**, que es la forma abreviada de la expresión *"Sūji wa dokushin ni kagiru"* que significa *"Los dígitos solo deben aparecer una vez"*.

El responsable del éxito mundial del juego fue el Neozelandés Wayne Gould, quien en 1997 se encontraba vacacionando en Tokio cuando descubrió el juego. A partir de este suceso se dio a la tarea de construir un programa de computadora para generar tableros de Sudoku y comenzó a publicarlos en diarios de Estados Unidos desde donde se propagó a prácticamente todos los rincones del planeta.

## Objetivo del Juego y sus Reglas

Aunque existen muchas variantes del juego, nos centraremos en el original, el cual, es muy sencillo:

El Sudoku se juega en un tablero cuadrado de 9x9 (81 casillas) dividido en 9 cuadrados internos de 3x3. Inicialmente se nos proporcionará un tablero semivacío como el que se muestra a continuación:

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/ejemploTableroPromedio.png" />
    <p><i>Figura 1. Tablero promedio de Sudoku</i></p>
</div>


El objetivo es terminar de llenar el tablero con los números del 1 al 9 utilizando los valores que ya se encuentran en la cuadrícula para inferir los que faltan. Debemos respetar las siguientes reglas:

* Cada dígito debe aparecer una sola vez en cada renglón.
* Cada dígito debe aparecer una sola vez en cada columna.
* Cada dígito debe aparecer una sola vez en cada cuadrado interno.

## Ejemplo

Si bien hay muy pocas reglas, a veces puede resultar confuso cuando nunca lo hemos jugado. A continuación un ejemplo:

Supongamos que queremos resolver el siguiente tablero (ignorar las casillas sombreadas, son generadas automáticamente por el [software que utilicé para los ejemplos](https://sudoku.com/)):

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/tableroAResolver.png" />
    <p><i>Figura 2. Tablero a resolver</i></p>
</div>

Si nos centramos en la casilla central del segundo cuadrado interno podemos ver que no es posible colocar un 2 porque otro 2 ya existe en el mismo renglón; también podemos notar que sería un error poner el 5 ya que otro 5 se encuentra ya colocado en la misma columna. Asimismo, poner un 9 no es válido porque el 9 ya existe en ese cuadrado interno y en el renglón correspondiente:

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/error2.png" />
    <p><i>Figura 3. Error: número repetido en el renglón</i></p>
</div>

<br>

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/error5.png" />
    <p><i>Figura 4. Error: número repetido en la columna</i></p>
</div>

<br>

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/error9.png" />
    <p><i>Figura 5. Error: número repetido en renglón y cuadrado interno</i></p>
</div>

<br>

Si observamos bien, los únicos números que no rompen las reglas son el 1 y el 6:

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/validos.png" />
    <p><i>Figura 6. El 1 y el 6 son válidos</i></p>
</div>

¿Entonces cuál elegir? la respuesta es ejecutar un **Algoritmo de Backtracking** para probar ambos números y saber con cúal de éstos es posible resolver el rompecabezas; sin embargo, esta opción es difícil de ejecutar para un ser humano, es por eso que aquí aprenderemos a cómo programarlo para que la computadora lo haga por nosotros. 

Una opción más viable para un ser humano sería dejar pendiente esa casilla, continuar resolviendo otras y llenarla cuando estemos 100% seguros de que solamente un único valor puede encajar en ella sin romper las reglas.

Abajo se muestra el tablero resuelto, observa que ningún número se repite ni por renglón, ni por columna, ni tampoco se repite dentro de un mismo cuadrado interno:

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/ejemploResuelto.png" />
    <p><i>Figura 7. Ejemplo resuelto</i></p>
</div>







