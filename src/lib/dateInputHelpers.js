const regex = delimiter => {
  const r = {
    letters: /[A-Za-z]+/g,
    specialChars: /[-. !?><:;\/"^'|\\{}()\[\]+=_*&%$#@~`]+/g,
    doubleDelim: new RegExp(`[${delimiter}][${delimiter}]`),
    beginningDelim: new RegExp(`^[${delimiter}]`),
    threeDelims: new RegExp(`(.)*[${delimiter}](.)*[${delimiter}](.)*[${delimiter}]`),
  };

  return r;
};

const hasMoreThanTwoDelims = (v, delimiter) => v.split("").filter(ch => ch === delimiter).length > 2;

const hasLessThanTwoDelimiters = (v, delimiter) => v.split("").filter(ch => ch === delimiter).length < 2;

const hasNoDelimiters = (v, delimiter) => v.split("").filter(ch => ch === delimiter).length === 0;

const hasOnlyOneDelimiter = (v, delimiter) => v.split(delimiter).length === 2;

const hasThreeDigitMonth = (v, delimiter) =>
  hasOnlyOneDelimiter(v, delimiter) && v.split(delimiter).find(val => val.length > 2);

const hasLongerThanFourDigits = (v, delimiter) => v.split(delimiter).find(seq => seq.length > 4);

const isLeapYear = year => {
  const marchFirst = new Date(new Date(year, 2, 1, 0, 0, 0).setFullYear(year));
  const lastDayOfFeb = new Date(marchFirst.getTime() - 10 * 60 * 1000).getDate();
  return lastDayOfFeb === 29;
};

function normalizeDate(str, format, delimiter) {
  const sliced = str.split(delimiter).map(Number);
  let d = 0,
    m = 0,
    y = 0,
    res;

  if (format === "DMY") {
    [d, m, y] = sliced;
  }
  if (format === "MDY") {
    [m, d, y] = sliced;
  }
  if (format === "YMD") {
    [y, m, d] = sliced;
  }

  if (
    !d ||
    !m ||
    !y ||
    m > 12 ||
    ([1, 3, 5, 7, 8, 10, 12].includes(m) && d > 31) ||
    ([4, 6, 9, 7, 11].includes(m) && d > 30) ||
    (m === 2 && (isLeapYear(y) ? d > 29 : d > 28))
  ) {
    res = null;
  } else {
    const date = new Date(y, m - 1, d, 12, 0, 0).setFullYear(y);
    res = isNaN(new Date(date).getTime()) ? null : new Date(date);
  }
  // res && console.log("valid date!!!", res);

  return res;
}

function handleInput(e, format, delimiter) {
  let v = e.currentTarget.value;

  if (/delete/i.test(e.inputType)) {
    return;
  }

  let [selectionStart, selectionEnd] = [
    e.currentTarget.selectionStart || 0,
    e.currentTarget.selectionEnd || 0,
  ];

  const lastChar = v[v.length - 1];
  const regEx = regex(delimiter);

  v = v.replace(regEx.letters, "");
  v = v.replace(regEx.specialChars, delimiter);

  if (v.length > 10) {
    v = v.slice(0, selectionStart - 1) + v.slice(selectionEnd, v.length);
  }

  if (format === "DMY" || format === "MDY") {
    if (lastChar && lastChar.match(/\d/)) {
      if (v.length === 3) {
        v = [v.substring(0, 2), delimiter, v[2]].join("");
      }
      if (v.length === 5 && hasThreeDigitMonth(v, delimiter)) {
        v = [v.substring(0, 4), delimiter, v[4]].join("");
      }
      if (v.length === 6 && hasLessThanTwoDelimiters(v, delimiter)) {
        v = [v.substring(0, 5), delimiter, v[5]].join("");
      }
    }
  } else if (format === "YMD") {
    if (lastChar && lastChar.match(/\d/)) {
      if (v.length === 5 && hasNoDelimiters(v, delimiter)) {
        v = [v.substring(0, 4), delimiter, v[4]].join("");
      }
      if (v.length === 8 && hasOnlyOneDelimiter(v, delimiter)) {
        v = [v.substring(0, 7), delimiter, v[7]].join("");
      }
    }
  }

  if (hasLongerThanFourDigits(v, delimiter)) {
    v = v
      .split(delimiter)
      .map(seq => (seq.length < 4 ? seq : seq.slice(0, 4)))
      .join(delimiter);
  }

  if (v.match(regEx.threeDelims)) {
    let i = v.length;
    while (i > -1) {
      if (v[i] === delimiter) {
        v = v.slice(0, i);
        break;
      }
      i--;
    }
  }

  v = v.replace(regEx.beginningDelim, "");
  v = v.replace(regEx.doubleDelim, delimiter);

  e.currentTarget.value = v;
}

const handleDateInput = e => handleInput(e, "DMY", "/");
const normalizeDateStr = str => normalizeDate(str, "DMY", "/");

export { handleDateInput, normalizeDateStr };
