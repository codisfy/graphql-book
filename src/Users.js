import {
  useQuery,
  useMutation,
  gql
} from "@apollo/client";
import { ROOT_QUERY } from './App'
import { client } from './index'


const ADD_FAKE_USERS_MUTATION = gql`
    mutation addFakeUsers($count:Int!) {
        addFakeUsers(count:$count) {
            githubLogin
            name
            avatar
        }
    }
`

const refetch = async () => {
  await client.refetchQueries({
    include: ["allUsers"],
  });
}

const Users = () => {
  const { loading, error, data } = useQuery(ROOT_QUERY);

  if (error) return <p>Error :(</p>;
  if (loading) {
    return <p>loading users...</p>
  } else {
    return <>
      <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />
    </>
  }

}

const UserList = ({ count, users, refetchUsers }) => {

  const [addFakeUsers] = useMutation(ADD_FAKE_USERS_MUTATION, { refetchQueries: ['allUsers'] });

  return <div>
    <p>{count} Users</p>
    <button onClick={() => refetchUsers()}>Refetch</button>
    <button onClick={() => addFakeUsers({ variables: { count: 1 } })}>Add Fake Users</button>
    <ul>
      {users.map(user =>
        <UserListItem key={user.githubLogin}
          name={user.name}
          avatar={user.avatar} />
      )}
    </ul>
  </div>
}

const UserListItem = ({ name, avatar }) =>
  <li>
    <img src={avatar} width={48} height={48} alt="" />
    {name}
  </li>

export default Users