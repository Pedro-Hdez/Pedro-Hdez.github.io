---
layout: post
title: "Docker y Ciencia de Datos"
author: pedro
portada: assets/images/portadas/ciencia_datos_proyecto_es.png
categories: [Ciencia de datos]
description: "Mini proyecto de limpieza de datos generando una imagen de Docker."
beforetoc: "En esta publicación se realizará una limpieza de datos de Covid-19 en México utilizando
la línea de comandos de Unix y se generará un contenedor de Docker para la reproducibilidad del 
proceso."
toc: true
---

## Objetivo

El objetivo de este pequeño tratamiento de datos es obtener el número total de casos positivos
y negativos de Covid-19 para cada municipio de Sonora, partiendo de la [base de datos federal](https://www.gob.mx/salud/documentos/datos-abiertos-152127) correspondiente a dicha enfermedad. Estos resultados se almacenarán en un archivo
csv. De este modo, tendremos un conjunto de datos limpios sobre los cuales podríamos aplicar
técnicas de análisis.

## Prerrequisitos

El único requisito es tener instalado Docker en nuestra computadora. [Aquí](https://docs.docker.com/get-docker/) puedes consultar las guías
de instalación.

El código fuente de este mini proyecto lo puedes encontrar en [este repositorio](https://github.com/Pedro-Hdez/DataScienceAndDockerMiniProject).

## Procedimiento

El procedimiento consta de dos sencillos pasos:

1. Para la descarga y limpieza preliminar de los datos usaremos las herramientas de la línea de comandos de Unix, más específicamente, utilizando la distribución de Ubuntu.
2. Con el paso anterior obtendremos un archivo csv pero cada casilla contendrá las claves de los valores reales. Por lo tanto, es necesaria una segunda etapa para sustituir dichas claves y así obtener un resultado humanamente legible. Para esta etapa nos apoyaremos de un script de Python utilizando la librería Pandas.

Este procedimiento se realizará desde un Dockerfile, por lo tanto, cualquier usuario puede reproducirlo y obtendrá exactamente el mismo resultado que se mostrará en este post; además, nos ahorraremos todos los problemas de configuración de nuestro ambiente de trabajo ¡Qué bonito es Docker!.

### Archivos necesarios

Se presenta una breve explicación de la función de cada archivo necesario. Recuerda que todos éstos los puedes encontrar en el repositorio del proyecto.

- **Dockerfile**: Archivo que contiene las instrucciones necesarias para la configuración de nuestro ambiente de trabajo y para realizar el procedimiento de limpieza de datos.
- **data_processing.yml**: Entorno de Anaconda. Recordemos que necesitamos ejecutar un script de Python y utilizar Pandas. Me di a la tarea de instalar todas las dependencias necesarias y desde el Dockerfile instalaremos Anaconda y exportaremos este archivo a un nuevo entorno.
- **fix_data.py**: Script de Python para ejecutar la segunda etapa del procedimiento y obtener un resultado final.
- **201128_Catalogos.xlsx**: Este archivo contiene las claves y valores reales utilizados en la base de datos que vamos a procesar. Es necesario para intercambiar el valor de las claves por sus valores reales.

Los archivos más relevantes son **Dockerfile** y **fix_data.py**. A continuación les echaremos un vistazo.

### Dockerfile

```yml
FROM ubuntu

FROM continuumio/miniconda3
```
