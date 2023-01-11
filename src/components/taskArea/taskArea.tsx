import React, { FC, ReactElement } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import { ITaskApi } from './interfaces/ITaskApi';
import { IUpdateTask } from '../createTaskForm/interfaces/IUpdateTask';
import { Status } from '../createTaskForm/enums/Status';
import { countTasks } from './helpers/countTasks';

import { Grid, Box, Alert, LinearProgress } from '@mui/material';

import { format } from 'date-fns';

import { TaskCounter } from '../taskCounter/taskCounter';
import { Task } from '../task/task';

export const TaskArea: FC = (): ReactElement => {
  const queryClient = useQueryClient();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => {
      return sendApiRequest<ITaskApi[]>('http://localhost:3200/tasks', 'GET');
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: (data: IUpdateTask) => {
      return sendApiRequest<IUpdateTask>(
        'http://localhost:3200/tasks/',
        'PUT',
        data,
      );
    },
    onSuccess: () => {
      // Mevcut sorgu verilerini geçersiz kılma
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    },
  });

  const onStatusChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    updateTaskMutation.mutate({
      id: id,
      status: e.target.checked ? Status.inProgress : Status.todo,
    });
  };

  const markCompleteHandler = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    updateTaskMutation.mutate({
      id: id,
      status: Status.completed,
    });
  };

  return (
    <Grid item md={8} px={4}>
      <Box mb={8} px={4}>
        <h2>Status Of Your Task As On {format(new Date(), 'PPPP')}</h2>
      </Box>

      <Grid container display="flex" justifyContent="center">
        <Grid
          item
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          mb={8}
          md={10}
          xs={12}
        >
          <TaskCounter
            status={Status.todo}
            count={data ? countTasks(data, Status.todo) : undefined}
          />
          <TaskCounter
            status={Status.inProgress}
            count={data ? countTasks(data, Status.inProgress) : undefined}
          />
          <TaskCounter
            status={Status.completed}
            count={data ? countTasks(data, Status.completed) : undefined}
          />
        </Grid>
        <Grid item display="flex" flexDirection="column" md={8} xs={10}>
          <>
            {isError && (
              <Alert
                severity="error"
                sx={{
                  fontSize: '16px',
                  marginBottom: '20px',
                  paddingY: '10px',
                }}
              >
                There was an error fetching your tasks
              </Alert>
            )}

            {!isError && Array.isArray(data) && data?.length === 0 && (
              <Alert
                severity="warning"
                sx={{
                  fontSize: '16px',
                  marginBottom: '20px',
                  paddingY: '10px',
                }}
              >
                You do not have any tasks created yet. Start by creating some
                tasks.
              </Alert>
            )}

            {isLoading ? (
              <LinearProgress />
            ) : (
              Array.isArray(data) &&
              data.length > 0 &&
              data.map((task, index) => {
                return task.status === Status.todo ||
                  task.status === Status.inProgress ? (
                  <Task
                    key={index + task.priority}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    date={new Date(task.date)}
                    priority={task.priority}
                    status={task.status}
                    onStatusChange={onStatusChangeHandler}
                    onClick={markCompleteHandler}
                  />
                ) : (
                  false
                );
              })
            )}
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};
