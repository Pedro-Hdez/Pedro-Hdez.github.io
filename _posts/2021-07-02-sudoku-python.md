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

El Sudoku tal y como lo conocemos hoy en día es un invento relativamente nuevo ¡Incluso es más joven que el cubo de Rubik!. Howard Garns, un inventor de rompecabezas estadounidense lo publicó en la revista de su mismo país titulada _Dell Pencill Puzzles & Word Games_ en el año de 1979 bajo el nombre de _Number Place_.

Cinco años después, en 1984 el rompecabezas llega a Japón en donde obtuvo un gran recibimiento; ahí, la comunidad lo acogió con el nombre de **Sudoku**, que es la forma abreviada de la expresión _"Sūji wa dokushin ni kagiru"_ que significa _"Los dígitos solo deben aparecer una vez"_.

El responsable del éxito mundial del juego fue el Neozelandés Wayne Gould, quien en 1997 se encontraba vacacionando en Tokio cuando descubrió el juego. A partir de este suceso se dio a la tarea de construir un programa de computadora para generar tableros de Sudoku y comenzó a publicarlos en diarios de Estados Unidos desde donde se propagó a prácticamente todos los rincones del planeta.

## Objetivo del Juego y sus Reglas

Aunque existen muchas variantes del juego, nos centraremos en el original, el cual, es muy sencillo:

El Sudoku se juega en un tablero cuadrado de 9x9 (81 casillas) dividido en 9 cuadrados internos de 3x3. Inicialmente se nos proporcionará un tablero semivacío como el que se muestra a continuación:

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/ejemploTableroPromedio.png" />
    <p><i>Figura 1. Tablero promedio de Sudoku</i></p>
</div>

El objetivo es terminar de llenar el tablero con los números del 1 al 9 utilizando los valores que ya se encuentran en la cuadrícula para inferir los que faltan. Debemos respetar las siguientes reglas:

- Cada dígito debe aparecer una sola vez en cada renglón.
- Cada dígito debe aparecer una sola vez en cada columna.
- Cada dígito debe aparecer una sola vez en cada cuadrado interno.

### Ejemplo

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

## Implementación

Una vez conocidas las reglas es momento de comenzar a pensar en la implementación de una solución computacional al problema de resolver y generar tableros de Sudoku. Recuerda que puedes encontrar el código fuente [aquí](https://github.com/Pedro-Hdez/sudoku-python).

### Planeación y Consideraciones

El objetivo del proyecto es construir un programa que resuelva Sudokus y también que sea capaz de generar tableros parcialmente completos para que alguien más los utilice para jugar.

He optado por construir la clase `SudokuBoard` que contiene el atributo `self.board` donde se almacenará el tablero. Asimismo, la clase tendrá métodos públicos para resolver, imprimir y generar tableros de Sudoku.

Antes de comenzar a programar necesitamos saber cómo vamos a representar el juego en la computadora y también debemos establecer una manera para darle a conocer al programa el tablero que deseamos resolver.

#### Representación del Tablero

Para ésto, nos olvidaremos momentáneamente de los cuadrados internos y representaremos el tablero como un arreglo 2-dimensional (lista de listas) de $$9x9$$. Cada renglón del tablero corresponde a una lista diferente; además, los espacios vacíos se van a representar con el número 0. Aquí un pequeño ejemplo:

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/representacionDelTablero.png" />
    <p><i>Figura 8. Representación del tablero en el programa</i></p>
</div>

#### Entrada del Tablero al Programa

Considero que la forma más eficiente para que el programa lea el tablero a resolver es que lo haga secuencialmente. De este modo también será muy fácil y rápido para nosotros como humanos escribir los valores de las 81 casillas del tablero. A continuación, un ejemplo de cómo le pasaríamos al programa el tablero a resolver:

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/tableroComoCadena.png" />
    <p><i>Figura 9. Entrada secuencial del tablero al programa</i></p>
</div>

### Métodos base

#### Constructor

```python
class SudokuBoard:
    def __init__(self, board=None):
        """
            This class represents a Sudoku Board and its methods.

            Params
            ------
            board: It expects a 81 characters <string> object containing the numbers distribution
                in the board. Empty cells are represented with 0. If <None> is given, then an
                empty board will be created (9x9 board filled with 0's).
        """

        # Populate the board with 0's
        self.__resetBoard()

        # If board was given, copy it to the self.board attribute
        if board:
            for i in range(0,9):
                for j in range(0,9):
                    self.board[i][j] = int(board[(i*9) + j])
```

Recordemos que el programa no solo solucionará Sudokus, sino que también los generará. Por ese motivo no es obligatorio darle al constructor un tablero inicial, por lo que su parámetro `board`
es opcional. Además, siempre que creemos una instancia de la clase se utilizará el método privado `self.__resetBoard()` que inicializa el atributo `self.board` como un tablero vacío. En caso de que el parámetro `board` sea una cadena de 81 caracteres, entonces utilizamos los ciclos For anidados para copiar los valores de la cadena proporcionada al tablero interno.

A continuación, el método que resetea el tablero, o en otras palabras, el que crea un tablero interno vacío.

```python
    def __resetBoard(self):
        """
            This private functions resets the board state. This is, fill it with 0's
            (empty spaces).
        """
        self.board = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]]
```

#### Método para imprimir el tablero en consola

Ahora, veamos un método para imprimir el tablero:

```python
    def printBoard(self):
        """
            This method prints the board with the standard Sudoku format.
        """
        for i in range(9):
            if i%3 == 0 and i != 0:
                print("- - - - - - - - - - - - ")
            for j in range(9):
                if j%3 == 0 and j != 0:
                    print(" | ", end="")
                if j == 8:
                    print(self.board[i][j])
                else:
                    print(str(self.board[i][j]) + " ", end="")
```

Podríamos simplemente recorrer el arreglo bidimensional `self.board` e ir imprimiendo valor a valor, pero le daremos un pequeño retoque al formato de la salida para que se asemeje un poco más a un tablero de Sudoku real. Cada tres renglones imprimiremos una línea horizontal y cada tres columnas imprimiremos una línea vertical, ésto con la finalidad de hacer visible la separación entre cada uno de los nueve cuadrados internos, aquí un pequeño ejemplo de cómo se ve el tablero impreso en consola:

<div style="text-align:center">
    <img style="width:100%; height:100%;" src="../assets/images/sudokupython/ejemploPrintBoard.png" />
    <p><i>Figura 10. Ejemplo de la impresión de un tablero</i></p>
</div>

#### Método para convertir el tablero en una cadena de caracteres

Este método nos será de importancia más adelante, pero considero que es bueno familiarizarse con él desde este momento:

```python
    def boardAsString(self):
        """
            This method converts the board in a string.

            Returns
            -------
            - A <str> object which stores the board.
        """
        string = "".join([str(col) for row in self.board for col in row])
        return string
```

Aquí utilizamos el método `join` de la clase `<str>` combinado con la comprehensión de listas para convertir el arreglo bidimensional que representa al tablero, en un arreglo unidimiensional de caracteres.

### Solucionador de Sudokus

Ya que hemos visto los métodos base, es hora de comenzar a codificar los métodos para solucionar Sudokus.

Primero, vamos a establecer la forma de resolver una sola casilla, este corto y fácil algoritmo será la base de todo el programa:

Sea $$(x,y)$$ la posición de una casilla vacía en el tablero

Para todo número $$n \in [1,9]$$ :

1.  Revisar que podemos poner $$n$$ en $$(x,y)$$ sin romper las reglas
2.  Si $$n$$ en $$(x,y)$$ rompe una regla, probar con el siguiente número $$n$$
3.  Si $$n$$ en $$(x,y)$$ es válido, asignar el valor $$n$$ a la casilla vacía $$(x,y)$$

Si ningún número $$n \in [1,9]$$ puede asignarse a la casilla $$(x,y)$$, entonces la casilla no se puede resolver.

A partir de ésto construiremos el método que solucionará los tableros, usaremos recursividad para repetir el mismo algoritmo en todas las casillas vacías; además, el método implementará la técnica de BackTracking para dar marcha atrás y probar diferentes combinaciones una vez que nos encontremos con una casilla irresoluble.

#### Método para encontrar una casilla vacía

Primero necesitamos un algoritmo para encontrar una casilla vacía, para ello utilizaremos el siguiente método privado:

```python
    def __findEmptySpace(self, board=None, emptySpace=None):
        """
            This method finds an empty space in a board. Empty spaces are represented
            with 0.

            Params
            ------
            - board: <SudokuBoard> object. this function will use 'board' attribute of the object
                     given to search for the empty space. If None, the method will use the
                     'self.board' board.

            -emptySpace: <int> object. If is given, then we will search for the n-th empty space
                         (n = emptySpace). If not given, then the method will return the first
                         empty space that it finds.

            Returns
            -------
            - If empty space was found, then a <tuple> object is returned which contains the
              empty space coordinates: (row, col)
            - If no empty space was found, then returns None.

        """

        # board selection
        if board:
            b = board.board
        else:
            b = self.board

        # Aux. variable to search the n-th empty space in case it is required
        k = 0

        # Nested loops to iterate the boaord
        for row in range(len(b)):
            for col in range(len(b)):
                # If an empty space was found, decide if a return is needed
                if b[row][col] == 0:
                    if not emptySpace:
                        return (row, col)
                    else:
                        if k == emptySpace:
                            return (row, col)
                        k += 1

        return None
```

El método recibe dos parámetros:

- `board`: Objeto de la clase `<SudokuBoard>` en donde buscaremos la casilla vacía, si este parámetro se omite, entonces el espacio vacío se buscará en el mismo objeto desde el cual este método se invocó.
- `emptySpace`: Número entero que sirve para regresar la posición del n-ésimo espacio vacío; si se omite, entonces la función regresará la posición del primer espacio vacío que el algoritmo encuentre.

Estos dos argumentos son vitales para cuando se genera un tablero nuevo, más adelante se explicará con más detalle el por qué los necesitamos, en este momento son irrelevantes y al momento de usar el método para solucionar un Sudoku se van a omitir.

El algoritmo es muy simple, primero toma el arreglo bidimensional que representa al tablero, puede ser el que se proporcionó en el parámetro `board` o el atributo `self.board`. Una vez seleccionado el tablero, éste se recorre en orden con dos ciclos For anidados. Dentro de este par de ciclos se revisa si la posición actual es una casilla vacía (representada por un cero). S es así, entonces se decide si se regresa o no la posición actual de acuerdo al parámetro `emptySpace`. Recordemos que dicho parámetro representa el n-ésimo espacio vacío, en caso de que `emptySpace != None`, debemos continuar con la búsqueda hasta que sea necesario. Si al final recorrimos todo el tablero y no encontramos espacios vacíos, entonces se regresa un `None`

### Método para revisar que las reglas del Sudoku

Ya sabemos cómo buscar una casilla vacía, ahora necesitamos un método para revisar que ninguna regla del juego se rompa cuando asignemos un valor al espacio vacío que encontremos.

```python
    def __checkRules(self, num, space):
        """
            This method checks if a number can be placed in certain space following the
            Sudoku Rules.

            Params
            ------
            num: <int> object from 1 to 9
            space: <tuple> object with (row, col) coordinates of the space

            Return
            ------
            - False if the number cannot be placed in the space according to
              Sudoku rules or if the space already contains a number
            - True if the number can be placed in the space.
        """

        # Checking if the number is already in the same row as the space
        for col in self.board[space[0]]:
            if col == num:
                return False

        # Checking if the number is already in the same column as the space
        for row in range(len(self.board)):
            if self.board[row][space[1]] == num:
                return False

        # Checking if the number is already in the internal square which
        # the space belongs
        internalSquareRow = space[0] // 3
        internalSquareCol = space[1] // 3

        for i in range(3):
            for j in range(3):
                if self.board[i + (internalSquareRow * 3)][j + (internalSquareCol * 3)] == num:
                    return False

        # If the number can be placed in the space, according to Sudoku rules, then
        # return True.
        return True
```

El algoritmo es muy intuitivo, se revisan las tres reglas del Sudoku tal y como un ser humano lo hace. Se reciben dos parámetros:

- `n`: Número que se desea revisar en el espacio vacío.
- `space`: Tupla que contiene la posición del espacio vacío.

El primer ciclo For revisa que el número que queremos asignar no exista previamente en la columna correspondiente al espacio vacío. El segundo ciclo revisa que el número no se repita en el renglón donde el espacio vacío se encuentra. El resto del código se encarga de ubicar el cuadrado interno al que pertenece la casilla vacía, luego ese cuadrado interno se revisa completamente con dos ciclos For anidados para asegurarnos de que el número no se repite dentro de él. Si alguna regla se rompe, se regresa un `False`, pero si terminamos de revisar todas las reglas sin ningún problema, entonces se regresa un `True`.
