#MrFish

This is a language that anyone, including those with zero experience in programming, can read and understand. Writing in it might require some programming background, but only because of the nature of programming. To start things off, here's the Grammar.

##Grammar
###Macrosyntax

```

    Program         ::= Stmt Block?
    Block           ::= (Newline Stmt)*
    Stmt            ::= Declaration
                     |  Assignment
                     |  IfStmt
                     |  Loop
                     |  Return
                     |  FuncDef
                     |  TypeDef
                     |  Exp

    Declaration     ::= 'declare' Id ('as' | '=') (Obj | Exp)
    Assignment      ::= Id '=' (Object | Exp)
    Return          ::= 'provide' Exp?
    FuncDef         ::= 'function' Func
    Func            ::= Id 'needs' '(' (Id ('=' Exp)? (',' Id ('=' Exp)? )* )? ')' ':' Indent Block Dedent

    TypeDef         ::= 'type' Id ('as' Id)? ':' Indent (Newline (Func | Property))* Dedent 

    IfStmt          ::= 'if' '(' Exp ')' ':' Indent Block Dedent (Newline ElseIf)* (Newline Else)?
    ElseIf          ::= 'else' 'if'  '(' Exp ')' ':' Indent Block Dedent
    Else            ::= 'else' ':' Indent Block Dedent

    Loop            ::= ForIn | ForOf | While
    While           ::= 'while' '(' Exp ')' ':' Indent Block Dedent
    ForIn           ::= 'foreach' '(' Id 'in' Exp ')' ':' Indent Block Dedent
    ForOf           ::= 'foreach' '(' Id 'of' Exp ')' ':' Indent Block Dedent

    Exp            ::= Exp1 ('or' Exp1)*
    Exp1           ::= Exp2 ('and' Exp2)*
    Exp2           ::= Exp3 (CompareOp Exp3)*
    Exp3           ::= Exp4 (AddOp Exp4)*
    Exp4           ::= Exp5 (MulOp Exp5)*
    Exp5           ::= PrefixOp? Exp6
    Exp6           ::= Exp7 (PowerOp Exp6)?
    Exp7           ::= ('new' Exp8 Call) | Exp8
    Exp8           ::= Exp9 (Call | '.' Exp8 | '[' Exp8 ']')
    Exp9           ::= Id | BoolLit | IntLit | StringLit | '(' Exp ')' | ArrayLit | This 

    ArrayLit        ::= '[' (Exp (',' Exp)* )? ']'
    Obj             ::= 'properties' ':' Indent Newline (Func | Property) (Newline (Func | Property))* Dedent
    Prop            ::= (Id | StringLit | Intlit | BoolLit) ':' Exp
    Call            ::= 'with' '(' (Id '=' Exp (',' Id '=' Exp)* )? ')'

```
 

###Microsyntax

```

    CompareOp       ::= 'equal_to' | 'not_equal_to' | 'greater_than' | 'less_than' | 'less_than_or_equal_to' | 'greater_than_or_equal_to'
    AddOp           ::= '+' | '-'
    MulOp           ::= '*' | '/' | 'mod'
    PrefixOp        ::= '-' | 'not'
    PowerOp         ::= '^'
    This            :: 'this'
    IntLit          ::= '[+-]?((0x[a-fA-F0-9]+)|(\d+(\.\d+)?([eE][+-]?\d+)?))'
    StringLit       ::= '\"[^\"\\]*(?:\\.[^\"\\]*)*\"|\'[^\'\\]*(?:\\.[^\'\\]*)*\''
    Id              ::= '[_$a-zA-Z][$\w]*(?=[^$\w]|$)'
    Newline         ::= NEWLINE
    Indent          ::= INDENT
    Dedent          ::= DEDENT

```

This doesn't currently capture everything, but it will soon enough. The only thing it likely won't capture is the possibility of having unnecessary new lines placed around. So let it be known that any extra new lines (ie, lines with nothing on them) are completely ignored. They won't affect the whitespacing at all.