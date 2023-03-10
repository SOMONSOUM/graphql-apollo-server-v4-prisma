class UNAUTHENTICATED extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UNAUTHENTICATED';
  }
}

class UNAUTHORIZED extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UNAUTHORIZED';
  }
}

class FORBIDDEN extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FORBIDDEN';
  }
}

class NOT_FOUND extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NOT_FOUND';
  }
}

class INTERNAL_SERVER_ERROR extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'INTERNAL_SERVER_ERROR';
  }
}

class BAD_REQUEST extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BAD_REQUEST';
  }
}

class CONFLICT extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CONFLICT';
  }
}

class UNPROCESSABLE_ENTITY extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UNPROCESSABLE_ENTITY';
  }
}

class INVALID_CREDENTIALS extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'INVALID_CREDENTIALS';
  }
}

export {
  UNAUTHENTICATED,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  CONFLICT,
  UNPROCESSABLE_ENTITY,
  INVALID_CREDENTIALS,
};
