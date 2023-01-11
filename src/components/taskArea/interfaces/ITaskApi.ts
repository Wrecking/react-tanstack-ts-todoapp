import { Status } from '../../createTaskForm/enums/Status';
import { Priority } from '../../createTaskForm/enums/Priority';

export interface ITaskApi {
  id: string;
  title: string;
  description: string;
  date: string;
  status: `${Status}`;
  priority: `${Priority}`;
}
