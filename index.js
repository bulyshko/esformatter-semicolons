exports.nodeBefore = function(node) {
  if (~['ExpressionStatement', 'VariableDeclaration', 'ReturnStatement'].indexOf(node.type)) {
    var token = node.endToken;

    while (isEmpty(token) || isComment(token)) {
      token = token.prev;
    }

    if (!isSemicolon(token)) {
      var next = {
        type: 'Punctuator',
        value: ';',
        prev: token,
        next: token.next,
        root: token.root
      };
      if (token.next) {
        token.next.prev = next;
      } else if (token.root) {
        token.root.endToken = next;
      }
      token.next = next;
    }
  } else if ('EmptyStatement' === node.type) {
    // FIXME: Basically, setting value to an empty string
    // and changing type to "EmptyStatement" for "WhiteSpace",
    // "Indent", and "LineBreak" is a workaround to prevent a bug.
    // See https://github.com/bulyshko/esformatter-semicolons/issues/2
    var token = node.startToken;
    var prev = token.prev;

    while (isEmpty(prev)) {
      prev.type = 'EmptyStatement';
      prev.value = '';
      prev = prev.prev;
    }

    token.value = '';
  }
};

function isEmpty(token) {
  return token &&
    (token.type === 'WhiteSpace' ||
    token.type === 'Indent' ||
    token.type === 'LineBreak');
}

function isComment(token) {
  return token &&
    (token.type === 'LineComment' ||
    token.type === 'BlockComment');
}

function isSemicolon(token) {
  return token && token.type === 'Punctuator' && token.value === ';';
}
