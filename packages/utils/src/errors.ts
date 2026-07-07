import { ErrorCode } from "./error-codes";

type FieldError = {
	field: string;
	code: ErrorCode;
	message: string;
};

export class AppError extends Error {
	constructor(
		readonly code: ErrorCode,
		readonly status: number,
		message: string,
		readonly fieldErrors?: FieldError[],
	) {
		super(message);
		this.name = this.constructor.name;
	}

	get isServerError(): boolean {
		return this.status >= 500;
	}

	static from(err: unknown): AppError {
		if (err instanceof AppError) return err;
		return new AppError(ErrorCode.INTERNAL_ERROR, 500, "Internal server error");
	}
}

export class BadRequest extends AppError {
	constructor(code: ErrorCode, message: string, fieldErrors?: FieldError[]) {
		super(code, 400, message, fieldErrors);
	}
}

export class Unauthorized extends AppError {
	constructor(code: ErrorCode, message: string) {
		super(code, 401, message);
	}
}

export class Forbidden extends AppError {
	constructor(code: ErrorCode, message: string) {
		super(code, 403, message);
	}
}

export class NotFound extends AppError {
	constructor(code: ErrorCode, message: string) {
		super(code, 404, message);
	}
}

export class Conflict extends AppError {
	constructor(code: ErrorCode, message: string) {
		super(code, 409, message);
	}
}

export class UnprocessableEntity extends AppError {
	constructor(code: ErrorCode, message: string, fieldErrors?: FieldError[]) {
		super(code, 422, message, fieldErrors);
	}
}
