/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import * as R from "ramda";

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const log = R.tap(writeLog);

  const isValid = R.allPass([
    R.test(/^[0-9.]+$/),
    R.pipe(R.length, R.gt(R.__, 2)),
    R.pipe(R.length, R.lt(R.__, 10)),
    R.pipe(parseFloat, R.lt(0)),
  ]);

  const parseAndRound = R.pipe(parseFloat, Math.round);

  const convertToBinary = (n) =>
    api.get("https://api.tech/numbers/base")({
      number: String(n),
      from: 10,
      to: 2,
    });

  const getAnimalById = (id) => api.get(`https://animals.tech/${id}`)({});

  const handleValidationError = () => handleError("ValidationError");

  const onSuccess = R.pipe(R.prop("result"), handleSuccess);
  const extractResult = R.prop("result");

  const process = R.pipe(
    log,
    R.ifElse(
      isValid,
      R.pipe(
        parseAndRound,
        log,
        convertToBinary,
        R.andThen(
          R.pipe(
            extractResult,
            log,
            R.tap((binary) => log(binary.length)),
            R.pipe(
              R.length,
              (len) => len * len,
              log,
              (square) => square % 3,
              log,
              (id) => getAnimalById(id),
              R.andThen(onSuccess)
            )
          )
        ),

        R.otherwise(handleError)
      ),
      handleValidationError
    )
  );

  process(value);
};

export default processSequence;
