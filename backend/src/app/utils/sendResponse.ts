import type { Response } from 'express';

type TPayload<T, M> = {
  success?: boolean;
  status: number;
  message: string;
  data?: T;
  meta?: M;
};

const sendResponse = <T, M>(res: Response, payload: TPayload<T, M>) => {
  const response = {
    success: payload?.success ?? true,
    ...payload,
  };

  res.status(payload.status).send(response);
};

export default sendResponse;
