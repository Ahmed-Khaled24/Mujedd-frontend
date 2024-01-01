import { capitalize } from 'lodash';

import { User } from '../../types/user';
import Button from '../Button';
import {
    UserItemContainer,
    UserItemImage,
    UserItemUsername,
} from './user-item.styles';
import { Link } from 'react-router-dom';

type UserItemProps = {
    action: string;
    actionHandler: React.MouseEventHandler<HTMLButtonElement>;
} & Partial<User>;

const UserItem = ({
    fname,
    lname,
    username,
    imageUrl,
    action,
    actionHandler,
}: UserItemProps) => {
    return (
        <UserItemContainer>
            <UserItemImage src={imageUrl} alt="user profile" />
            <div>
                <Link to={'#'} className='text-indigo-950'>
                    {fname} {lname}
                </Link>
                <UserItemUsername>@{username}</UserItemUsername>
            </div>
            {action && (
                <Button
                    select="primary700"
                    type="button"
                    onClick={actionHandler}
                    className="text-white text-sm ml-auto max-w-[35%]"
                >
                    {capitalize(action)}
                </Button>
            )}
        </UserItemContainer>
    );
};

export default UserItem;
