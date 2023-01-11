import { Status } from '../enums/Status';

export interface IUpdateTask {
  id: string;
  status: `${Status}`;
}
