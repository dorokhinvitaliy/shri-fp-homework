import * as R from 'ramda';

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => {
    const isStarRed = R.propEq("star", "red");
    const isSquareGreen = R.propEq("square", "green");
    const isTriangleWhite = R.propEq("triangle", "white");
    const isCircleWhite = R.propEq("circle", "white");

    const isCorrect = R.allPass([
        isStarRed,
        isSquareGreen,
        isTriangleWhite,
        isCircleWhite,
    ]);

    return isCorrect(shapes);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
    const isGreen = R.equals('green');
    const colors = R.props(['star', 'square', 'triangle', 'circle'], shapes);
    const greenOnly = R.filter(isGreen, colors);
    return R.gte(R.length(greenOnly), 2);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
    const isBlue = R.equals('blue');
    const isRed = R.equals('red');
    const colors = R.props(['star', 'square', 'triangle', 'circle'], shapes);
    const blueOnly = R.filter(isBlue, colors);
    const redOnly = R.filter(isRed, colors);
    return R.equals(R.length(blueOnly), R.length(redOnly));
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (shapes) => {
    const isStarCorrect = R.propEq("star", "red");
    const isSquareCorrect = R.propEq("square", "orange");
    const isCircleCorrect = R.propEq("circle", "blue");

    const isCorrect = R.allPass([
        isStarCorrect,
        isSquareCorrect,
        isCircleCorrect,
    ]);

    return isCorrect(shapes);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.pipe(
  R.props(['star', 'square', 'triangle', 'circle']),
  R.reject(R.equals('white')),
  R.countBy(R.identity),
  R.values,
  R.any(R.gte(R.__, 3))
);


// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
    const colors = R.props(['star', 'square', 'triangle', 'circle'], shapes);

    const greenCount = R.pipe(
        R.filter(R.equals('green')),
        R.length
    )(colors);

    const redCount = R.pipe(
        R.filter(R.equals('red')),
        R.length
    )(colors);

    const isTriangleGreen = R.propEq('triangle', 'green');

    return greenCount === 2 && redCount === 1 && isTriangleGreen(shapes);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.pipe(
    R.props(['star', 'square', 'triangle', 'circle']),
    R.all(R.equals('orange'))
);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.pipe(
    R.prop('star'),
    R.allPass([
        R.complement(R.equals('red')),
        R.complement(R.equals('white'))
    ])
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.pipe(
    R.props(['star', 'square', 'triangle', 'circle']),
    R.all(R.equals('green'))
);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (shapes) => {
    const triangleColor = shapes.triangle;
    const squareColor = shapes.square;

    return triangleColor === squareColor && triangleColor !== 'white';
};