import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';

import { Status } from './enums/Status';
import { Priority } from './enums/Priority';

import { TaskTitleField } from './_taskTitleField';
import { TaskDescriptionField } from './_taskDescriptionField';
import { TaskDateField } from './_taskDateField';
import { TaskSelectField } from './_taskSelectField';

import { ICreateTask } from '../taskArea/interfaces/ICreateTask';

export const CreateTaskForm: FC = (): ReactElement => {
  const queryClient = useQueryClient();

  // Declare component states
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<string>(Status.todo);
  const [priority, setPriority] = useState<string>(Priority.normal);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (data: ICreateTask) => {
      return sendApiRequest<ICreateTask>(
        'http://localhost:3200/tasks/',
        'POST',
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

  function createTaskHandler() {
    if (!title || !date || !description) {
      return;
    }

    const task: ICreateTask = {
      title,
      description,
      date: date.toString(),
      status,
      priority,
    };

    createTaskMutation.mutate(task);
  }

  // Manage Side Effects inside the application
  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      setShowSuccess(true);
      // Reset Form Elements
      setTitle(undefined);
      setDescription(undefined);
      setDate(new Date());
      setStatus(Status.todo);
      setPriority(Priority.normal);
    }

    const successTimeout = setTimeout(() => {
      setShowSuccess(false);
    }, 5000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [createTaskMutation.isSuccess]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width="100%"
      px={4}
      my={6}
    >
      {showSuccess && (
        <Alert
          sx={{
            width: '100%',
            color: 'text.primary',
            marginBottom: '20px',
          }}
          severity="success"
        >
          <AlertTitle>Success</AlertTitle>
          The task has been created successfully.
        </Alert>
      )}

      <Typography mb={2} component="h2" variant="h6">
        Create A Task
      </Typography>

      <Stack sx={{ width: '100%' }} spacing={2}>
        <TaskTitleField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={createTaskMutation.isLoading}
        />
        <TaskDescriptionField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={createTaskMutation.isLoading}
        />
        <TaskDateField
          value={date}
          onChange={(date) => setDate(date)}
          disabled={createTaskMutation.isLoading}
        />

        <Stack sx={{ width: '100%' }} direction="row" spacing={2}>
          <TaskSelectField
            label="Status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as string)}
            disabled={createTaskMutation.isLoading}
            items={[
              {
                value: Status.todo,
                label: Status.todo.toUpperCase(),
              },
              {
                value: Status.inProgress,
                label: Status.inProgress.toUpperCase(),
              },
            ]}
          />
          <TaskSelectField
            label="Priority"
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as string)}
            disabled={createTaskMutation.isLoading}
            items={[
              {
                value: Priority.low,
                label: Priority.low.toUpperCase(),
              },
              {
                value: Priority.normal,
                label: Priority.normal.toUpperCase(),
              },
              {
                value: Priority.high,
                label: Priority.high.toUpperCase(),
              },
            ]}
          />
        </Stack>

        {createTaskMutation.isLoading && <LinearProgress />}

        <Button
          disabled={
            !title ||
            !description ||
            !date ||
            !status ||
            !priority ||
            createTaskMutation.isLoading
          }
          onClick={createTaskHandler}
          variant="contained"
          size="large"
          fullWidth
        >
          <Typography fontWeight="bold">Create A Task</Typography>
        </Button>
      </Stack>
    </Box>
  );
};
