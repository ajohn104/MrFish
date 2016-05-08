var Tokens = {
  Indent: 
    ["  "],
  Separator: 
    [".", "{", "}", "[", "]", "(", ")", ":", ","],
  OneCharacterOperators: 
    ["+", "-", "*", "/", "^", "="],
  WordOperators:
    ["not", "and", "or", "equal_to", "not_equal_to", "greater_than", 
     "less_than", "less_than_or_equal_to", "greater_than_or_equal_to"],
  Reserved:
    [ "declare", "as", "provide", "function", "needs", "type", 
      "if", "else", "while", "foreach", "in", "of", "new", "with", "this"],
  Comment: 
    [">>"],
  BoolLit: 
    ["true", "false"],
  Unused:
    ["break", "class", "const", "continue", "debugger", "delete", "export", "extends",
     "function", "import", "instanceof", "super", "typeof", "var", "void", "with",
      "return", "try", "catch", "throw", "finally", "let", "do", "switch", "case", "defaults"]
};

// ErrUC = Error: Unexpected Characters, ErrUR = Error: Unused Reserved
Tokens.kinds = 
  [ { kind:"Newline", abbr: null}, {kind:"UnexpectedChars", abbr:"ErrUC"},
    {kind:"Indent", abbr:null, display: "INDENT"}, {kind:"Id", abbr: "Id"}, 
    {kind:"Reserved", abbr: null}, {kind:"Unused", abbr: "ErrUR"}, 
    {kind:"Comment", abbr: undefined}, {kind:"Separator", abbr: null}, 
    {kind:"Operator", abbr: null}, {kind:"BoolLit", abbr: "Bool"},
    {kind:"IntLit", abbr: "Int"}, {kind:"StrLit", abbr: "Str"}, 
    {kind:"Dedent", abbr: null, display: "DEDENT"} ];

module.exports = Tokens;