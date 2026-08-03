import katex from 'katex';

const delimiters = [
  { open: '$$', close: '$$', displayMode: true },
  { open: '\\[', close: '\\]', displayMode: true },
  { open: '\\(', close: '\\)', displayMode: false },
  { open: '$', close: '$', displayMode: false }
];

// Keeps existing MTH, PHY, and STA banks readable while new content can use explicit LaTeX delimiters.
const legacySubscriptCharacters = '₀₁₂₃₄₅₆₇₈₉₋₊ₐₑₙ';
const legacySuperscriptCharacters = '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁱʳⁿᵃᵇᵖᵣˣ';
const legacyGroup = String.raw`(?:\((?:[^()]|\([^()]*\))*\)|\[(?:[^\[\]]|\[[^\[\]]*\])*\]|\|[^|]*\|)`;
const legacyNumber = String.raw`\d+(?:\.\d+)?(?:[A-Za-zα-ωΑ-ΩπΔ∞√∅ΣΦΩεθκλμρστφω°·]+)?!?`;
const legacyIdentifier = String.raw`[A-Za-z0-9_α-ωΑ-Ω⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁱʳⁿᵃᵇᵖᵣˣ̄₀-₉₋₊ₐₑₙπΔ∞√∅ΣΦΩεθκλμρστφω°·!']+`;
const legacyBaseAtom = String.raw`(?:${legacyNumber}|${legacyIdentifier}|${legacyGroup})+`;
const legacyFunctionName = String.raw`(?:sin|cos|tan|log|ln|lim|det|max|min|exp|sec|csc|cot)`;
const legacyAtom = String.raw`(?:${legacyBaseAtom}${legacyFunctionName}\s+${legacyBaseAtom}|${legacyFunctionName}\s+${legacyBaseAtom}|${legacyBaseAtom})`;
const signedLegacyAtom = String.raw`[+\-±]?${legacyAtom}`;
const legacyExpressionValue = String.raw`(?:${signedLegacyAtom}|\?)`;
const legacyExpressionPattern = new RegExp(
  String.raw`(?<![\w$])(?:${signedLegacyAtom})(?:\s*(?:\^|=|[+\-*/×÷∪∩±≤≥→≈≠∝⊂])\s*${legacyExpressionValue})+(?![\w$])`,
  'g'
);
const legacyStandalonePattern = new RegExp(
  String.raw`(?<![\w$])(?:${signedLegacyAtom})(?![\w$])`,
  'g'
);
const legacyIntegralPattern = new RegExp(
  String.raw`(?<![\w$])(?:∫|∑|∮)[${legacySubscriptCharacters}${legacySuperscriptCharacters}]*\s*[^,;:.?!]+`,
  'g'
);

function isLegacyFormula(value) {
  const formula = value.trim();
  const hasStrongMathSignal = /[=/*×÷∪∩±≤≥→≈≠∝⊂^²³⁴⁵⁻ⁱʳⁿᵃᵇᵖᵣˣ̄√πΔ∞∅∫∑∮ΣΦΩαβεθκλμρστφω°·]/.test(formula);
  const hasNumericSubtraction = /[0-9].*-.*[0-9]/.test(formula);
  const hasFactorial = /^(?:[A-Za-z]|\d+)!$/.test(formula);
  const isSignedNumber = /^[-+]\d+(?:\.\d+)?$/.test(formula);
  if (!hasStrongMathSignal && !hasNumericSubtraction && !hasFactorial && !isSignedNumber) return false;

  return true;
}

function legacyToLatex(value) {
  const superscripts = {
    '⁰': '0',
    '¹': '1',
    '²': '2',
    '³': '3',
    '⁴': '4',
    '⁵': '5',
    '⁶': '6',
    '⁷': '7',
    '⁸': '8',
    '⁹': '9',
    '⁺': '+',
    '⁻': '-',
    'ⁱ': 'i',
    'ʳ': 'r',
    'ⁿ': 'n',
    'ᵃ': 'a',
    'ᵇ': 'b',
    'ᵖ': 'p',
    'ᵣ': 'r',
    'ˣ': 'x'
  };
  const subscripts = {
    '₀': '0',
    '₁': '1',
    '₂': '2',
    '₃': '3',
    '₄': '4',
    '₅': '5',
    '₆': '6',
    '₇': '7',
    '₈': '8',
    '₉': '9',
    '₋': '-',
    '₊': '+',
    'ₐ': 'a',
    'ₑ': 'e',
    'ₙ': 'n'
  };
  const convertSuperscript = (value) => [...value].map((character) => superscripts[character]).join('');
  const convertSubscript = (value) => [...value].map((character) => subscripts[character]).join('');

  return value
    .replace(/(∫|∑|∮)([₀-₉₋₊ₐₑₙ]+)([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁱʳⁿᵃᵇᵖᵣˣ]+)?/g, (_, symbol, subscript, superscript) => {
      const upper = superscript ? `^{${convertSuperscript(superscript)}}` : '';
      return `\\${symbol === '∫' ? 'int' : symbol === '∑' ? 'sum' : 'oint'}_{${convertSubscript(subscript)}}${upper}`;
    })
    .replace(/([\)\]])([₀-₉₋₊ₐₑₙ]+)([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁱʳⁿᵃᵇᵖᵣˣ]+)?/g, (_, base, subscript, superscript) => {
      const upper = superscript ? `^{${convertSuperscript(superscript)}}` : '';
      return `${base}_{${convertSubscript(subscript)}}${upper}`;
    })
    .replace(/([A-Za-z])̄/g, '\\bar{$1}')
    .replace(/([A-Za-zα-ωΑ-Ω]+)([₀-₉₋₊ₐₑₙ]+)/g, (_, base, subscript) => {
      return `${base}_{${convertSubscript(subscript)}}`;
    })
    .replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁱʳⁿᵃᵇᵖᵣˣ]+)/g, (superscript) => {
      return `^{${convertSuperscript(superscript)}}`;
    })
    .replace(/([A-Za-z]+)_([A-Za-z0-9]+)/g, '$1_{$2}')
    .replace(/√\(([^()]*)\)/g, '\\sqrt{$1}')
    .replace(/√([A-Za-z0-9]+)/g, '\\sqrt{$1}')
    .replace(/√/g, '\\sqrt{}')
    .replace(/\b(sin|cos|tan|log|ln|lim|det|max|min|exp|sec|csc|cot)\b/g, '\\$1 ')
    .replace(/∘/g, '\\circ ')
    .replace(/∝/g, '\\propto ')
    .replace(/≈/g, '\\approx ')
    .replace(/≠/g, '\\ne ')
    .replace(/⊂/g, '\\subset ')
    .replace(/°/g, '^{\\circ}')
    .replace(/·/g, '\\cdot ')
    .replace(/π/g, '\\pi ')
    .replace(/Δ/g, '\\Delta ')
    .replace(/∞/g, '\\infty ')
    .replace(/∅/g, '\\varnothing ')
    .replace(/∪/g, '\\cup ')
    .replace(/∩/g, '\\cap ')
    .replace(/∫/g, '\\int ')
    .replace(/∑/g, '\\sum ')
    .replace(/±/g, '\\pm ')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/≤/g, '\\leq ')
    .replace(/≥/g, '\\geq ')
    .replace(/→/g, '\\to ')
    .replace(/μ/g, '\\mu ')
    .replace(/θ/g, '\\theta ')
    .replace(/α/g, '\\alpha ')
    .replace(/β/g, '\\beta ')
    .replace(/ε/g, '\\epsilon ')
    .replace(/κ/g, '\\kappa ')
    .replace(/λ/g, '\\lambda ')
    .replace(/ρ/g, '\\rho ')
    .replace(/σ/g, '\\sigma ')
    .replace(/τ/g, '\\tau ')
    .replace(/φ/g, '\\phi ')
    .replace(/ω/g, '\\omega ')
    .replace(/Σ/g, '\\Sigma ')
    .replace(/Φ/g, '\\Phi ')
    .replace(/Ω/g, '\\Omega ')
    .replace(/î/g, '\\hat{\\imath}')
    .replace(/ĵ/g, '\\hat{\\jmath}');
}

function getLegacyMathParts(text) {
  // Preserve piecewise prose as text until it uses explicit LaTeX cases; partial extraction makes it harder to read.
  if (/[{}]/.test(text) && /\bif\b/.test(text)) {
    return [{ type: 'text', value: text }];
  }

  const patterns = [legacyExpressionPattern, legacyIntegralPattern, legacyStandalonePattern];
  const matches = patterns
    .flatMap((pattern) => [...text.matchAll(new RegExp(pattern.source, 'g'))])
    .filter((match) => isLegacyFormula(match[0]))
    .sort((left, right) => left.index - right.index || right[0].length - left[0].length);
  const parts = [];
  let cursor = 0;

  matches.forEach((match) => {
    const start = match.index;
    const end = start + match[0].length;
    if (start < cursor) return;

    if (start > cursor) {
      parts.push({ type: 'text', value: text.slice(cursor, start) });
    }
    parts.push({ type: 'math', value: legacyToLatex(match[0]), displayMode: false });
    cursor = end;
  });

  if (cursor < text.length) {
    parts.push({ type: 'text', value: text.slice(cursor) });
  }

  return parts;
}

function findClosingDelimiter(text, start, close) {
  let index = start;

  while (index < text.length) {
    const closeIndex = text.indexOf(close, index);
    if (closeIndex === -1) return -1;
    if (text[closeIndex - 1] !== '\\') return closeIndex;
    index = closeIndex + close.length;
  }

  return -1;
}

function getMathParts(text, legacyMath) {
  const parts = [];
  let plainText = '';
  let index = 0;

  function addPlainText(value) {
    if (!value) return;
    plainText += value;
  }

  function flushPlainText() {
    if (!plainText) return;
    parts.push(...(legacyMath ? getLegacyMathParts(plainText) : [{ type: 'text', value: plainText }]));
    plainText = '';
  }

  while (index < text.length) {
    const delimiter = delimiters.find(({ open }) => text.startsWith(open, index));

    if (!delimiter || (delimiter.open === '$' && text[index - 1] === '\\')) {
      addPlainText(text[index]);
      index += 1;
      continue;
    }

    if (delimiter.open === '$') {
      const previousCharacter = text[index - 1];
      const nextCharacter = text[index + 1];
      if (previousCharacter && /[\w$]/.test(previousCharacter)) {
        addPlainText(text[index]);
        index += 1;
        continue;
      }
      if (!nextCharacter) {
        addPlainText(text[index]);
        index += 1;
        continue;
      }
    }

    const contentStart = index + delimiter.open.length;
    const closingIndex = findClosingDelimiter(text, contentStart, delimiter.close);
    if (closingIndex === -1) {
      addPlainText(text[index]);
      index += 1;
      continue;
    }

    const formula = text.slice(contentStart, closingIndex).trim();
    const followingCharacter = text[closingIndex + delimiter.close.length];
    if (!formula || (delimiter.open === '$' && followingCharacter && /[\w$]/.test(followingCharacter))) {
      addPlainText(text[index]);
      index += 1;
      continue;
    }

    flushPlainText();
    parts.push({ type: 'math', value: formula, displayMode: delimiter.displayMode });
    index = closingIndex + delimiter.close.length;
  }

  flushPlainText();
  return parts;
}

function MathText({ children, className = '', legacyMath = false }) {
  const text = String(children ?? '');
  const parts = getMathParts(text, legacyMath);

  return (
    <span className={`math-text ${className}`.trim()}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={`text-${index}`}>{part.value}</span>;
        }

        const html = katex.renderToString(part.value, {
          displayMode: part.displayMode,
          output: 'htmlAndMathml',
          throwOnError: false
        });

        return (
          <span
            key={`math-${index}`}
            className={part.displayMode ? 'math-display' : 'math-inline'}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}

export default MathText;
