import moment from 'moment-timezone';
import { SetStateAction, useEffect, useState } from 'react';
import { GoDash, GoDotFill } from 'react-icons/go';

import {
    ModalContent,
    StatusContainer,
    StatusIcon,
    StatusInput,
    StatusItem,
} from '../pages/study-planner/study-planner.styles';
import {
    useEditTaskMutation,
    useFetchTaskQuery,
    useRemoveTaskMutation,
} from '../store';
import { Task } from '../types/event';
import { getEditTask } from '../utils/getEditTask';
import { errorToast, successToast } from '../utils/toasts';
import Button from './button/button.component';
import { CustomInput } from './input/Input.component';
import { Modal } from './modal/modal.component';

interface ModalProps {
    ID: number;
    Tasks: Task[];
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
type Status = {
    color: string;
    status: string;
};
export const EditTaskModal: React.FC<ModalProps> = ({
    Tasks,
    showModal,
    setShowModal,
    ID,
}) => {
    const { data: getTasks } = useFetchTaskQuery(ID);
    const task = getTasks?.data || [];
    const existingTask = task;

    const id = ID;
    const [title, setTitle] = useState(task.Title);
    const [description, setDescription] = useState(task.Description);
    const [color, setColor] = useState(task?.Color || '#000ff3');
    const [due_date, setDueDate] = useState(
        moment.tz(task.DueDate, moment.tz.guess()).format().slice(0, 10),
    );
    const [due_start, setDueStart] = useState(
        moment.tz(task.StartDate, moment.tz.guess()).format().slice(11, 16),
    );
    const [due_end, setDueEnd] = useState(
        moment.tz(task.DueDate, moment.tz.guess()).format().slice(11, 16),
    );
    const [status, setStatus] = useState(task.Status);
    const statuses: Status[] = [
        {
            color: '#1F51FF',
            status: 'In Progress',
        },
        {
            color: '#495057',
            status: 'Hold',
        },
        {
            color: '#008200',
            status: 'Done',
        },
    ];
    const [statusColor, setStatusColor] = useState('');
    const [statusIsRunning, setStatusIsRunning] = useState(false);

    useEffect(() => {
        setTitle(task.Title);
        setDescription(task.Description);
        setColor(task.Color);
        setDueDate(moment(task.DueDate).format().slice(0, 10));
        setDueStart(moment(task.StartDate).format().slice(11, 16));
        setDueEnd(moment(task.DueDate).format().slice(11, 16));
        setStatus(task.Status);
        const matchingStatus = statuses.find((s) => s.status === task.Status);
        if (matchingStatus) {
            setStatusColor(matchingStatus.color);
        } else {
            setStatusColor('#000000');
        }
    }, [task]);

    const handleDueStartChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newDueStart = event.target.value;
        setDueStart(newDueStart);
        if (newDueStart > due_end) {
            setDueEnd(newDueStart);
        }
    };
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            const customInputForm =
                document.querySelector('.custom-input-form');
            if (customInputForm && !customInputForm.contains(event.target)) {
                setStatusIsRunning(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const handleDueEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDueEnd = event.target.value;
        if (newDueEnd >= due_start) {
            setDueEnd(newDueEnd);
        }
    };

    const [
        editTask,
        {
            isSuccess: isTaskEditedSuccessfully,
            isError: isTaskEditError,
            isLoading: isTaskEditing,
            error: taskEditError,
        },
    ] = useEditTaskMutation();
    useEffect(() => {
        if (isTaskEditError) {
            errorToast('Error editing task!', taskEditError as string);
        }
        if (isTaskEditedSuccessfully) {
            successToast('Task edited successfully!');
        }
    }, [isTaskEditedSuccessfully, isTaskEditError]);

    const [
        deleteTask,
        {
            isSuccess: isTaskDeletededSuccessfully,
            isError: isTaskDeleteError,
            error: taskDeleteError,
        },
    ] = useRemoveTaskMutation();
    useEffect(() => {
        if (isTaskDeleteError) {
            errorToast('Error deleting the task!', taskDeleteError as string);
        }
        if (isTaskDeletededSuccessfully) {
            successToast('Task deleted successfully!');
        }
    }, [isTaskDeletededSuccessfully, isTaskDeleteError]);

    const handleDelete = async () => {
        await deleteTask(ID).unwrap();
        setShowModal(false);
    };

    const handleEditForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const StartDateTime = new Date(`${due_date}T${due_start}`);
        const EndDateTime = new Date(`${due_date}T${due_end}`);
        const nowDate = new Date();
        const differenceInMonths = moment(StartDateTime)
            .add(1, 'days')
            .diff(moment(nowDate), 'months');
        if (differenceInMonths >= 1) {
            errorToast('Date exceeds 1 month ahead!');
            return;
        }
        if (due_start === due_end) {
            errorToast('Start and due date can not match!');
            return;
        }

        if (StartDateTime < nowDate) {
            errorToast('This is an old date!!');
            return;
        }
        for (const task of Tasks) {
            if (task.ID !== id && task.DueDate && task.StartDate) {
                const taskStartDate = new Date(task.StartDate);
                const taskDueDate = new Date(task.DueDate);
                // if start date is in the interval of other task
                if (
                    StartDateTime >= taskStartDate &&
                    StartDateTime < taskDueDate
                ) {
                    errorToast(
                        'Task start time overlaps with another task. Please choose a different time.',
                    );
                    return;
                }

                // if end date is in the interval of other task
                if (EndDateTime >= taskStartDate && EndDateTime < taskDueDate) {
                    errorToast(
                        'Task end time overlaps with another task. Please choose a different time.',
                    );
                    return;
                }
                // if some other task interval is inside this interval
                if (
                    StartDateTime <= taskStartDate &&
                    EndDateTime >= taskStartDate &&
                    EndDateTime >= taskDueDate
                ) {
                    errorToast(
                        'Task duration overlaps with another task. Please adjust the start or end time.',
                    );

                    return;
                }
            }
        }

        const task: Task = {
            ID: id,
            Title: title,
            Description: description,
            DueDate: moment
                .tz(due_date + 'T' + due_end, moment.tz.guess())
                .utc()
                .format('YYYY-MM-DDTHH:mm'),
            StartDate: moment
                .tz(due_date + 'T' + due_start, moment.tz.guess())
                .utc()
                .format('YYYY-MM-DDTHH:mm'),
            Status: status,
            Color: color,
        };

        const updatedTask = getEditTask(task, existingTask);

        if (Object.keys(updatedTask).length === 1) {
            setShowModal(false);
            return;
        }

        await editTask(updatedTask as Task).unwrap();
        setShowModal(false);
    };

    return (
        <Modal
            isOpen={showModal}
            setIsOpen={setShowModal}
            title={'Edit Task'}
            width="lg"
        >
            <ModalContent>
                <form onSubmit={handleEditForm}>
                    <div className="w-full">
                        <CustomInput
                            required
                            label="Task name"
                            type="text"
                            value={title}
                            onChange={(e: {
                                target: { value: SetStateAction<string> };
                            }) => setTitle(e.target?.value)}
                        />
                    </div>
                    <div className="flex w-full justify-between pt-[6px] gap-6">
                        <div className="w-1/2 relative">
                            <StatusIcon size={24} color={statusColor} />
                            <StatusInput
                                required
                                color={statusColor}
                                label="Status"
                                type="text"
                                className="custom-input-form"
                                value={status}
                                onClick={() => {
                                    setStatusIsRunning(true);
                                }}
                            />
                            {statusIsRunning && (
                                <StatusContainer>
                                    {statuses.map((status) => (
                                        <StatusItem
                                            onClick={() => {
                                                setStatus(status.status);
                                                setStatusColor(status.color);
                                            }}
                                        >
                                            <GoDotFill
                                                size={24}
                                                color={status.color}
                                            />
                                            <span>{status.status}</span>
                                        </StatusItem>
                                    ))}
                                </StatusContainer>
                            )}
                        </div>
                        <div className="w-1/2">
                            <CustomInput
                                required
                                label="Select color"
                                id="color"
                                className="rounded border  border-slate-400 p-2 w-full h-[49px] bg-white focus-visible:outline-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2"
                                type="color"
                                value={color}
                                onChange={(e: {
                                    target: { value: SetStateAction<string> };
                                }) => setColor(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex w-full justify-between pt-[6px] gap-6">
                        <div className="w-1/2 flex flex-col justify-between">
                            <CustomInput
                                required
                                value={due_date}
                                type="date"
                                label="Due date"
                                onChange={(e: {
                                    target: { value: SetStateAction<string> };
                                }) => setDueDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row justify-between mt-auto w-1/2">
                            <input
                                type="time"
                                className="rounded border border-slate-400 p-2 min-w-0 focus-visible:outline-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 mr-1"
                                value={due_start}
                                onChange={handleDueStartChange}
                            />
                            <span className="text-xl pt-3">
                                <GoDash />
                            </span>
                            <input
                                type="time"
                                className="rounded border ml-1 border-slate-400 p-2 min-w-0 focus-visible:outline-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2"
                                value={due_end}
                                onChange={handleDueEndChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-[6px]">
                        <CustomInput
                            label="Description"
                            value={description}
                            onChange={(e: { target: { value: any } }) =>
                                setDescription(e.target.value)
                            }
                            multiline="true"
                            placeholder="Enter description..."
                            maxLength={1000}
                            cols={33}
                            rows={4}
                        />
                    </div>
                    <div className="w-full flex flex-row gap-4 justify-end items-end pt-5">
                        <Button
                            type="submit"
                            select="primary"
                            className="!w-[25%] border-2 border-indigo-900 "
                            loading={isTaskEditing}
                        >
                            Save
                        </Button>
                        <Button
                            select="danger"
                            outline={true}
                            onClick={handleDelete}
                            className="!w-[25%]"
                        >
                            Delete
                        </Button>
                    </div>
                </form>
            </ModalContent>
        </Modal>
    );
};
